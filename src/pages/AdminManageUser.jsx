import {
    ExclamationCircleOutlined,
    ExportOutlined,
    FilterOutlined,
    PaperClipOutlined,
    ReloadOutlined
} from '@ant-design/icons';
import {
    Button, Card, Form, Image, Input, Layout, message, Modal, Select, Space, Switch, Table, Tag
} from 'antd';
import Search from 'antd/lib/input/Search';
import React, { useEffect, useState } from 'react';
import { CSVLink } from 'react-csv';
import {
    getActivityByIds, getAllActivityApi,
    getAllUserActivityApi, getUserActivityByUids, getUserApi, getUserExportApi, serializerDoc,
    serializerDocToObject, updateUserActivityApi,
    updateUserApi
} from '../api/firestore';
import ActivityFeed, { checkFileImage } from '../components/ActivityFeed';
import InputSelectWithAddItem from '../components/InputSelectWithAddItem';
import TableCustom from '../components/TableCustom';
import UserDetail from '../components/UserDetail';
import {
    fieldPersonal, nameDepartmentActivity, nameLevelActivity,
    nameLevelRegister, nameMajors, nameSex, nameTarget
} from '../config';
import styles from '../styles/Admin.module.css';
import { compareString } from '../utils/compareFunction';

const { Content } = Layout;
const { confirm } = Modal;
const { Option } = Select;

const option = [
	{
		key: 'false',
		label: 'Chưa xác nhận',
		style: {
			backgroundColor: 'white',
		},
	},
	{
		key: 'true',
		label: 'Đã xác nhận',
		style: {
			backgroundColor: '#95de64',
		},
	},
	{
		key: 'Minh chứng không hợp lệ',
		label: 'Minh chứng không hợp lệ',
		style: {
			backgroundColor: '#ff7875',
		},
	},
];

const options = [
	{ value: 'hoc-tap', label: 'Học tập', color: '#ff9c6e' },
	{ value: 'tinh-nguyen', label: 'Tình nguyện', color: '#ffc53d' },
	{ value: 'the-luc', label: 'Thể lực', color: '#bae637' },
	{ value: 'dao-duc', label: 'Đạo đức', color: '#f759ab' },
	{ value: 'hoi-nhap', label: 'Hội nhập', color: '#40a9ff' },
	{ value: 'none', label: 'Chưa hoàn thành cái nào', color: '#722ed1' },
];
const colorOption = {
	'hoc-tap': '#ff9c6e',
	'tinh-nguyen': '#ffc53d',
	'the-luc': '#bae637',
	'dao-duc': '#f759ab',
	'hoi-nhap': '#40a9ff',
	none: '#722ed1',
};
const headerCsv = Object.entries(fieldPersonal).map(([k, v]) => ({
	label: v.label,
	key: k,
}));

const initRestExportData = {
	targetOtherSuccess: [],
	targetHoiNhap: [],
	targetKyNang: [],
	targetNgoaiNgu: [],
	targetTinhNguyen: [],
	targetTheLuc: [],
	otherHocTap: [],
	requireHocTap: [],
	otherDaoDuc: [],
	requireDaoDuc: [],
};
export const tagRender = (props) => {
	const { label, value, closable, onClose } = props;
	const onPreventMouseDown = (event) => {
		event.preventDefault();
		event.stopPropagation();
	};

	return (
		<Tag
			color={colorOption[value]}
			onMouseDown={onPreventMouseDown}
			closable={closable}
			onClose={onClose}
			style={{ marginRight: 3 }}
		>
			{label}
		</Tag>
	);
};

export default function AdminManageUser() {
	const [csvData, setCsvData] = useState([]);
	const [listRowChooseData, setListRowChooseData] = useState([]);
	const [loading, setLoading] = useState(false);
	const [total, setTotal] = useState(10);
	const [loadingExport, setLoadingExport] = useState(false);
	const [showUserModel, setShowUserModel] = useState(false);
	const [showExportModel, setShowExportModel] = useState(false);
	const [showActivityModel, setShowActivityModel] = useState(false);
	const [dataModel, setDataModel] = useState(null);
	const [userActivity, setUserActivity] = useState([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [searchStudent, setSearchStudent] = useState('');
	const [searchClassUser, setSearchClassUser] = useState('');
	const [filterLevelReview, setFilterLevelReview] = useState('');
	const [filterTargetSuccess, setFilterTargetSuccess] = useState([]);
	const [isFiltering, setIsFiltering] = useState(false);

	const getProofActivity = (activities = []) => {
		const result = { ...initRestExportData };
		for (var activity of activities) {
			if (activity.confirm === false) continue;
			if (activity.typeActivity === 'require') {
				Object.values(activity.proof).forEach((image) => {
					if (image.target === 'hoc-tap') {
						result.requireHocTap.push(image.url);
					} else if (image.target === 'dao-duc') {
						result.requireDaoDuc.push(image.url);
					}
				});
			} else if (activity.typeActivity === 'other') {
				Object.values(activity.proof).forEach((image) => {
					if (image.target === 'hoc-tap') {
						result.otherHocTap.push(image.url);
					} else if (image.target === 'dao-duc') {
						result.otherDaoDuc.push(image.url);
					}
				});
			} else {
				Object.values(activity.proof).forEach((image) => {
					if (image.target === 'tieu-bieu-khac') {
						result.targetOtherSuccess.push(image.url);
					} else if (image.target === 'hoi-nhap') {
						result.targetHoiNhap.push(image.url);
					} else if (image.target === 'ky-nang') {
						result.targetKyNang.push(image.url);
					} else if (image.target === 've-ngoai-ngu') {
						result.targetNgoaiNgu.push(image.url);
					} else if (image.target === 'tinh-nguyen') {
						result.targetTinhNguyen.push(image.url);
					} else if (image.target === 'the-luc') {
						result.targetTheLuc.push(image.url);
					}
				});
			}
		}
		return result;
	};

	const handleConfirmActivity = (item, confirm) => {
		let data = {};
		if (confirm === 'true') data = { confirm: true };
		else if (confirm === 'false') data = { confirm: false };
		else data = { confirm };
		return updateUserActivityApi(item.id, data)
			.then(() => {
				message.success('Cập nhật thành công');
				setUserActivity((preState) =>
					preState.map((usr) =>
						usr.id === item.uid
							? {
									...usr,
									activities: usr.activities.map((a) =>
										a.id === item.id ? { ...a, ...data } : a
									),
							  }
							: usr
					)
				);
			})
			.catch(() => {
				message.error('Cập nhật thất bại, vui lòng thử lại');
			});
	};
	const handleClickNameActivity = (item) => {
		setDataModel({ ...item, uid: item.uid });
		setShowActivityModel(true);
	};
	const handleClickNameUser = (item) => {
		setDataModel(item);
		setShowUserModel(true);
	};
	const handleChangeTargetSuccess = (targetSuccess, user) => {
		updateUserApi(user.id, { targetSuccess })
			.then(() => {
				message.success('Cập nhật thành công');
				setUserActivity((preState) =>
					preState.map((usr) =>
						usr.id === user.id ? { ...usr, targetSuccess } : usr
					)
				);
			})
			.catch(() => {
				message.error('Cập nhật thất bại, vui lòng thử lại');
			});
	};
	const showBoxQuestion = (item, key) => {
		confirm({
			title: 'Bạn có chắc muốn xác nhận hoạt động?',
			icon: <ExclamationCircleOutlined />,
			content: 'Hoạt động này KHÔNG có minh chứng',
			onOk() {
				return handleConfirmActivity(item, key);
			},
			onCancel() {},
		});
	};
	const expandedRowRender = (user) => {
		const columns = [
			{
				title: 'Trạng thái',
				dataIndex: 'active',
				key: 'active',
				filters: [
					{
						text: 'Chưa kích hoạt',
						value: 'false',
					},
					{
						text: 'Đã kích hoạt',
						value: 'true',
					},
				],
				defaultFilteredValue: ['true'],
				onFilter: (value, record) => record.active.toString() === value,
				render: (text) => <Switch checked={text} size="small" />,
			},
			{
				title: 'Tên hoạt động',
				key: 'name',
				render: (item) => {
					return (
						<Button
							type="link"
							onClick={() => handleClickNameActivity(item)}
						>
							{item.name}
						</Button>
					);
				},
			},
			{
				title: 'Cấp hoạt động',
				dataIndex: 'level',
				key: 'level',
				render: (text) => nameLevelActivity[text],
			},
			{
				title: 'Tiêu chí',
				key: 'target',
				render: (item) =>
					item.target.map((c) => nameTarget[c]).join(', '),
			},
			{
				title: 'Minh chứng',
				key: 'proof',
				render: (item) =>
					Object.values(item.proof).length ? (
						<Space
							style={{ maxWidth: 350, overflowX: 'auto' }}
							direction="horizontal"
						>
							{Object.values(item.proof).map((file) => (
								<div key={file.name}>
									{checkFileImage(file.typeFile) ? (
										<>
											<Image
												height={80}
												width={130}
												style={{ objectFit: 'cover' }}
												alt={file.name}
												src={file.url}
											/>
										</>
									) : (
										<div key={file.name}>
											<Button
												icon={<PaperClipOutlined />}
												type="link"
												block
											>
												<a
													target="_blank"
													href={file.url}
													rel="noreferrer"
												>
													{`${file.name}`}
												</a>
											</Button>
										</div>
									)}
									<p
										style={{
											textAlign: 'center',
											margin: 0,
										}}
									>
										{nameTarget[file.target]}
									</p>
								</div>
							))}
						</Space>
					) : (
						'Không có'
					),
			},
			{
				title: 'Trạng thái',
				key: 'confirm',
				filters: [
					{
						text: 'Đã xác nhận',
						value: 'true',
					},
					{
						text: 'Chưa xác nhận',
						value: 'false',
					},
					{
						text: 'MC không hợp lệ',
						value: 'cancel',
					},
					{
						text: 'Chưa thêm minh chứng',
						value: 'notproof',
					},
				],
				onFilter: (value, record) => {
					if (value === 'notproof') return record.proof === 0;
					else if (value === 'cancel')
						return record.confirm.toString().length > 5;
					else if (value === 'false')
						return record.confirm === false && record.proof !== 0;
					else if (value === 'true') return record.confirm === true;
				},
				defaultFilteredValue: [],
				render: (item) => {
					return (
						<InputSelectWithAddItem
							value={item.confirm.toString()}
							option={option}
							setValue={(key) =>
								Object.values(item.proof || {}).length
									? handleConfirmActivity(item, key)
									: showBoxQuestion(item, key)
							}
							style={{
								width: '100%',
								maxWidth: 250,
							}}
						/>
					);
				},
			},
		];

		if (user.activities.length)
			return (
				<Table
					tableLayout={'unset'}
					style={{ backgroundColor: '#69c0ff' }}
					columns={columns}
					dataSource={user.activities.map((c, index) => ({
						...c,
						key: index,
					}))}
					size="small"
					pagination={false}
				/>
			);
		else return <></>;
	};

	const handleSelectRowTable = (record, selected, selectedRows) => {
		setListRowChooseData(selectedRows);
	};
	const columns = [
		{
			title: 'Tên',
			key: 'fullName',
			render: (record) => (
				<Button type="link" onClick={() => handleClickNameUser(record)}>
					{record.fullName || record.displayName}
				</Button>
			),
		},
		{
			title: 'Mssv',
			key: 'studentCode',
			dataIndex: 'studentCode',
		},
		{
			title: 'Xét SV5T cấp',
			key: 'levelReview',
			render: (record) => nameLevelRegister[record.levelReview],
		},
		{
			title: 'Lớp',
			key: 'classUser',
			dataIndex: 'classUser',
		},
		{
			title: 'Điểm RL',
			key: 'pointTraining',
			dataIndex: 'pointTraining',
		},
		{
			title: 'Điểm HT',
			key: 'gpa',
			dataIndex: 'gpa',
		},
		{
			title: 'Đã hoàn thành',
			key: 'action',
			render: (record) => (
				<Select
					maxTagCount="responsive"
					mode="tags"
					placeholder="Tiêu chí đã hoàn thành"
					tagRender={tagRender}
					defaultValue={record.targetSuccess}
					style={{ width: 200 }}
					options={options}
					onChange={(value) =>
						handleChangeTargetSuccess(value, record)
					}
				/>
			),
		},
	];

	const getUser = (page = 1, pageSize = 10, ...other) => {
		//other: studentCode, levelReview, classUser, targetSuccess;
		setLoading(true);
		return getUserApi(page, pageSize, ...other)
			.then(serializerDoc)
			.then((data) => {
				if (data.length === pageSize) {
					setTotal(page * 10 + 10);
				}
				if (!data.length) {
					message.warning('Không có dữ liệu');
					setLoading(false);
					return;
				}
				setUserActivity(data);
				setLoading(false);
				return data.map((c) => c.id);
			})
			.then(async (uids) => {
				uids?.length && getMoreUserDetail(uids);
			});
	};

	const handleChangePage = (page) => {
		setCurrentPage(page);
	};

	const getMoreUserDetail = async (uids) => {
		let userActivities = await getUserActivityByUids(uids).then(
			serializerDoc
		);

		let acIds = userActivities.map((c) => c.acId);
		acIds = [...new Set(acIds)];

		if (!acIds.length) return;

		const activities = await getActivityByIds(acIds).then(
			serializerDocToObject
		);
		userActivities = userActivities
			.map((c) => ({
				...activities[c.acId],
				...c,
			}))
			.filter((c) => c.name && c.proof);
		setUserActivity((preState) =>
			preState.map((user) => ({
				...user,
				activities:
					userActivities.filter(
						(mapUserAc) => mapUserAc.uid === user.id
					) || [],
			}))
		);
	};
	const onChangeTable = (paginate, filters, sorter, { action }) => {
		if (action !== 'paginate') return;
		const nextPage =
			paginate.current > currentPage
				? userActivity[userActivity.length - 1]?.createAt
				: null;
		const prevPage =
			paginate.current > currentPage ? null : userActivity[0].createAt;
		setListRowChooseData([]);
		if (isFiltering) {
			getUser(
				paginate.current,
				10,
				'',
				searchClassUser,
				filterLevelReview,
				filterTargetSuccess,
				nextPage,
				prevPage
			);
		} else {
			getUser(
				paginate.current,
				10,
				null,
				null,
				null,
				null,
				nextPage,
				prevPage
			);
		}
		setCurrentPage(paginate.current);
	};
	const doResetFilter = () => {
		setFilterLevelReview('');
		setSearchClassUser('');
		setFilterTargetSuccess([]);
		setIsFiltering(false);
		getUser();
	};
	const onFinfishExportForm = async (values) => {
		const { classUser, levelReview, targetSuccess } = values;
		setLoadingExport(true);
		const users = await getUserExportApi(
			classUser,
			levelReview,
			targetSuccess.sort((a, b) => compareString(b, a))
		).then(serializerDoc);
		if (!users.length) {
			message.error('Không có dữ liệu nào để xuất');
			setLoadingExport(false);
			return;
		}
		let mapUserActivity = await getAllUserActivityApi().then(serializerDoc);
		const activities = await getAllActivityApi().then(
			serializerDocToObject
		);

		mapUserActivity = mapUserActivity
			.map((c) => ({
				...activities[c.acId],
				...c,
			}))
			.filter((c) => c.name && c.proof);

		const userHasActivity = users.map((user) => ({
			...user,
			activities:
				mapUserActivity.filter(
					(mapUserAc) => mapUserAc.uid === user.id
				) || [],
		}));

		const dataExport = userHasActivity.map((user) => ({
			...user,
			sex: nameSex[user.sex],
			targetSuccess: user?.targetSuccess?.length
				? user.targetSuccess.map((c) => nameTarget[c]).join(', ')
				: '',
			majors: nameMajors[user.majors],
			department: nameDepartmentActivity[user.department],
			levelReview: nameLevelRegister[user.levelReview],
			...getProofActivity(user.activities),
		}));

		setCsvData(dataExport);
		setLoadingExport(false);
	};

	useEffect(async () => {
		getUser();
	}, []);

	return (
		<Content className={styles.contentAdminManageUser}>
			<Card style={{ width: '100vw' }} size="small">
				<Space>
					<Search
						placeholder="Tìm theo MSSV"
						value={searchStudent}
						onChange={(e) => setSearchStudent(e.target.value)}
						onSearch={() => getUser(1, 10, searchStudent)}
						enterButton
					/>
					<Input
						placeholder="Lọc theo lớp"
						value={searchClassUser}
						onChange={(e) => setSearchClassUser(e.target.value)}
					/>
					<Select
						onChange={(value) => setFilterLevelReview(value)}
						placeholder="Lọc theo cấp xét"
						style={{ minWidth: 200 }}
						value={filterLevelReview || null}
					>
						{Object.entries(nameLevelRegister).map((c) => (
							<Option key={c[0]} value={c[0]}>
								{c[1]}
							</Option>
						))}
						<Option value=""></Option>
					</Select>
					<Select
						maxTagCount="responsive"
						mode="tags"
						placeholder="Lọc tiêu chí hoàn thành"
						tagRender={tagRender}
						style={{ minWidth: 200 }}
						options={options}
						value={filterTargetSuccess}
						onChange={(value) => {
							if (value.includes('none'))
								setFilterTargetSuccess(['none']);
							else
								setFilterTargetSuccess(
									value.sort((a, b) => compareString(b, a))
								);
						}}
					/>
					<Button
						icon={<FilterOutlined />}
						onClick={() => {
							setIsFiltering(true);
							setCurrentPage(1);
							getUser(
								1,
								10,
								'',
								searchClassUser,
								filterLevelReview,
								filterTargetSuccess
							);
						}}
					>
						Lọc
					</Button>
					<Button
						type="primary"
						icon={<ReloadOutlined />}
						onClick={() => {
							doResetFilter();
						}}
					>
						Đặt lại
					</Button>
					<Button
						icon={<ExportOutlined />}
						style={{ background: '#a0d911' }}
						onClick={() => {
							setShowExportModel(true);
						}}
					>
						Xuất dữ liệu
					</Button>
				</Space>
			</Card>
			<TableCustom
				style={{
					height: 'calc(100vh - 82px - 64px)',
					overflow: 'scroll',
				}}
				sticky={true}
				loading={loading}
				columns={columns}
				expandable={{
					expandedRowRender,
					rowExpandable: (record) => record?.activities?.length,
				}}
				rowSelection={{
					onSelect: handleSelectRowTable,
					onSelectAll: handleSelectRowTable,
				}}
				dataSource={userActivity}
				rowKey={(record) => record.id}
				size="middle"
				align="center"
				tableLayout={'unset'}
				rowClassName="rowTable"
				pagination={{
					position: ['bottomCenter'],
					simple: true,
					current: currentPage,
					total: total,
					onChange: handleChangePage,
				}}
				onChange={onChangeTable}
			/>
			<Modal
				visible={showUserModel || showActivityModel || showExportModel}
				title={
					showUserModel
						? 'Chi tiết sinh viên'
						: showExportModel
						? 'Xuất dữ liệu'
						: 'Chi tiết hoạt động'
				}
				centered={true}
				onCancel={() => {
					setShowUserModel(false);
					setShowActivityModel(false);
					setShowExportModel(false);
				}}
				footer={null}
			>
				{showUserModel && <UserDetail {...dataModel} />}
				{showActivityModel && (
					<ActivityFeed
						{...dataModel}
						canRemoveProof={true}
						showFull={true}
						btnDetail={false}
						loading={false}
					/>
				)}
				{showExportModel && (
					<>
						<Form
							labelCol={{ span: 6 }}
							wrapperCol={{ span: 16 }}
							layout="horizontal"
							onFinish={onFinfishExportForm}
						>
							<Form.Item label="Chọn lớp" name="classUser">
								<Input placeholder="Lọc theo lớp" />
							</Form.Item>
							<Form.Item
								label="Cấp xét"
								name="levelReview"
								initialValues="xet-cap-khoa"
								required
							>
								<Select placeholder="Lọc theo cấp xét">
									{Object.entries(nameLevelRegister).map(
										(c) => (
											<Option key={c[0]} value={c[0]}>
												{c[1]}
											</Option>
										)
									)}
								</Select>
							</Form.Item>
							<Form.Item
								label="Tiêu chí"
								name="targetSuccess"
								required
							>
								<Select
									mode="tags"
									placeholder="Tiêu chí hoàn thành"
									options={options}
								/>
							</Form.Item>
							<Form.Item label="">
								{csvData?.length && !loadingExport ? (
									<CSVLink
										filename={'Export-SV5T.csv'}
										data={csvData}
										target="_blank"
										headers={headerCsv}
										onClick={() =>
											setShowExportModel(false)
										}
									>
										Tải dữ liệu
									</CSVLink>
								) : (
									<Button
										type="primary"
										htmlType="submit"
										loading={loadingExport}
									>
										Xuất dữ liệu
									</Button>
								)}
							</Form.Item>
						</Form>
					</>
				)}
			</Modal>
		</Content>
	);
}
