import { useEffect, useState } from 'react';
import Loading from '../components/Loading';
import {
	Table,
	Layout,
	Button,
	Switch,
	Select,
	Tag,
	Space,
	Image,
	Modal,
	message,
} from 'antd';
import styles from '../styles/Admin.module.css';
import InputSelectWithAddItem from '../components/InputSelectWithAddItem';
import {
	fieldPesonal,
	nameLevelActivity,
	nameLevelRegister,
	nameTarget,
} from '../config';
import TableCustom from '../components/TableCustom';
import { CSVLink } from 'react-csv';
import ActivityFeed, { checkFileImage } from '../components/ActivityFeed';
import { PaperClipOutlined } from '@ant-design/icons';
import {
	getActivityByIds,
	getAllUserApi,
	serializerDoc,
	serializerDocToObject,
	getUserActivityByUids,
	updateUserActivityApi,
	updateUserApi,
} from '../api/firestore';
import UserDetail from '../components/UserDetail';

const { Content } = Layout;

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
];
const colorOption = {
	'hoc-tap': '#ff9c6e',
	'tinh-nguyen': '#ffc53d',
	'the-luc': '#bae637',
	'dao-duc': '#f759ab',
	'hoi-nhap': '#40a9ff',
};
const headerCsv = Object.entries(fieldPesonal).map(([k, v]) => ({
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
const tagRender = (props) => {
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
	const [chooseActivity, setChooseActivity] = useState();
	const [showUserModel, setShowUserModel] = useState(false);
	const [showActivityModel, setShowActivityModel] = useState(false);
	const [dataModel, setDataModel] = useState(null);
	const [userActivity, setUserActivity] = useState([]);

	// const getImageActivity = (activities = [], condition = {}) => {
	// 	const result = { ...initRestExportData };
	// 	for (var value of activities) {
	// 		if (value.confirm === false) continue;
	// 		else if (value.typeActivity === 'require') {
	// 			Object.values(value.images).forEach((image) => {
	// 				if (image.target === 'hoc-tap') {
	// 					result.requireHocTap.push(image.url);
	// 				} else if (image.target === 'dao-duc') {
	// 					result.requireDaoDuc.push(image.url);
	// 				}
	// 			});
	// 		} else if (value.typeActivity === 'other') {
	// 			Object.values(value.images).forEach((image) => {
	// 				if (image.target === 'hoc-tap') {
	// 					result.otherHocTap.push(image.url);
	// 				} else if (image.target === 'dao-duc') {
	// 					result.otherDaoDuc.push(image.url);
	// 				}
	// 			});
	// 		} else {
	// 			Object.values(value.images).forEach((image) => {
	// 				if (image.target === 'tieu-bieu-khac') {
	// 					result.targetOtherSuccess.push(image.url);
	// 				} else if (image.target === 'hoi-nhap') {
	// 					result.targetHoiNhap.push(image.url);
	// 				} else if (image.target === 'ky-nang') {
	// 					result.targetKyNang.push(image.url);
	// 				} else if (image.target === 've-ngoai-ngu') {
	// 					result.targetNgoaiNgu.push(image.url);
	// 				} else if (image.target === 'tinh-nguyen') {
	// 					result.targetTinhNguyen.push(image.url);
	// 				} else if (image.target === 'the-luc') {
	// 					result.targetTheLuc.push(image.url);
	// 				}
	// 			});
	// 		}
	// 	}
	// 	return result;
	// };
	// useEffect(() => {
	// 	if (loading === 0 && listRowChooseData.length) {
	// 		const dataExport = listRowChooseData.map((user) => ({
	// 			...user,
	// 			sex: nameSex[user.sex],
	// 			targetSuccess: user?.targetSuccess?.length
	// 				? user.targetSuccess.map((c) => nameTarget[c]).join(', ')
	// 				: '',
	// 			majors: nameMajors[user.majors],
	// 			department: nameDepartmentActivity[user.department],
	// 			levelReview: nameLevelRegister[user.levelReview],
	// 			...getImageActivity(Object.values(user.activities)),
	// 		}));
	// 		console.log('data export: ', dataExport);
	// 		setCsvData(dataExport);
	// 	} else {
	// 		setCsvData([]);
	// 	}
	// }, [loading, userActivity, listRowChooseData]);

	const handleConfirmActivity = (item, confirm) => {
		let data = {};
		if (confirm === 'true') data = { confirm: true };
		else if (confirm === 'false') data = { confirm: false };
		else data = { confirm };
		updateUserActivityApi(item.id, data)
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
			.then((res) => {
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
					item.proof.length ? (
						<Space
							style={{ maxWidth: 350, overflowX: 'auto' }}
							direction="horizontal"
						>
							{item.proof.map((file) => (
								<div key={file.name}>
									{checkFileImage(file.name) ? (
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
												>
													{`${file.name}`}
												</a>
											</Button>
										</div>
									)}
									{item.target.length > 1 && (
										<p
											style={{
												textAlign: 'center',
												margin: 0,
											}}
										>
											{nameTarget[file.target]}
										</p>
									)}
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
							setValue={(key) => handleConfirmActivity(item, key)}
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

	const handleSelectRowTabel = (record, selected, selectedRows, e) => {
		console.log('selectedRowss', selectedRows);
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
			searchFilter: true,
		},
		{
			title: 'Xét SV5T cấp',
			key: 'levelReview',
			filters: Object.entries(nameLevelRegister).map((c) => ({
				text: c[1],
				value: c[0],
			})),
			onFilter: (value, record) => record.levelReview === value,
			render: (record) => nameLevelRegister[record.levelReview],
		},
		{
			title: 'Lớp',
			key: 'classUser',
			dataIndex: 'classUser',
			searchFilter: true,
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
			filters: options.map((c) => ({
				value: c.value,
				text: c.label,
			})),
			onFilter: (value, record) => {
				if (record.targetSuccess)
					return record.targetSuccess.includes(value) || false;
				else return false;
			},
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

	useEffect(async () => {
		setLoading(true);
		getAllUserApi()
			.then(serializerDoc)
			.then((data) => {
				setUserActivity(data);
				setLoading(false);
				const uids = data.map((c) => c.id);
				if (uids.length > 10) uids.length = 10;
				return uids;
			})
			.then(async (uids) => {
				getMoreUserDetail(uids);
			});
	}, []);
	const getMoreUserDetail = async (uids) => {
		setLoading(true);
		let userActivities = await getUserActivityByUids(uids).then(
			serializerDoc
		);

		let acIds = userActivities.map((c) => c.acId);
		acIds = [...new Set(acIds)];

		if (!acIds.length) return setLoading(false);

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
		setLoading(false);
	};
	const onChangeTable = (
		{ current, pageSize },
		filters,
		sorter,
		{ currentDataSource, action }
	) => {
		if (action !== 'paginate') return;
		const start = (current - 1) * pageSize;
		const end = start + pageSize;
		getMoreUserDetail(currentDataSource.slice(start, end).map((c) => c.id));
	};

	useEffect(() => {
		console.log(userActivity);
	}, [userActivity]);

	return (
		<Content className={styles.contentAdminManageUser}>
			{loading == false && csvData.length !== 0 && (
				<CSVLink
					filename={'Export-SV5T.csv'}
					data={csvData}
					target="_blank"
					headers={headerCsv}
				>
					Xuất dữ liệu đã chọn
				</CSVLink>
			)}
			<TableCustom
				columns={columns}
				expandable={{
					expandedRowRender,
					rowExpandable: (record) => record?.activities?.length,
				}}
				rowSelection={{
					onSelect: handleSelectRowTabel,
					onSelectAll: handleSelectRowTabel,
				}}
				dataSource={userActivity}
				loading={loading}
				rowKey={(record) => record.id}
				size="middle"
				rowClassName="rowTable"
				pagination={{ position: ['topCenter'] }}
				sticky={true}
				onChange={onChangeTable}
			/>
			<Modal
				visible={showUserModel || showActivityModel}
				title={
					showUserModel ? 'Chi tiết sinh viên' : 'Chi tiết hoạt động'
				}
				centered={true}
				onCancel={() => {
					setShowUserModel(false);
					setShowActivityModel(false);
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
			</Modal>
		</Content>
	);
}
