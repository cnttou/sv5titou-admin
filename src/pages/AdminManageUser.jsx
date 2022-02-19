import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Loading from '../components/Loading';
import {
	addUserDetailAction,
	updateConfirmProofAction,
	getAllDataAction,
} from '../store/actions';
import { Table, Layout, Button, Switch, Select, Tag, Space, Image } from 'antd';
import styles from '../styles/Admin.module.css';
import useModelOnlyShowActivity from '../hooks/useModelOnlyShowActivity';
import InputSelectWithAddItem from '../components/InputSelectWithAddItem';
import {
	fieldPesonal,
	nameDepartmentActivity,
	nameLevelActivity,
	nameLevelRegister,
	nameMajors,
	nameSex,
	nameTarget,
} from '../config';
import TableCustom from '../components/TableCustom';
import useModelUser from '../hooks/useModelUser';
import { CSVLink } from 'react-csv';
import { handleSortActivity } from '../utils/compareFunction';
import { checkFileImage } from '../components/ActivityFeed';
import { PaperClipOutlined } from '@ant-design/icons';

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
	const dispatch = useDispatch();
	const [csvData, setCsvData] = useState([]);
	const [listRowChooseData, setListRowChooseData] = useState([]);
	let { value: listUser, loading } = useSelector(
		(state) => state.userActivity
	);
	const listNews = useSelector((state) => state.activity.value);
	let { ui, setVisible, setDataModel } = useModelOnlyShowActivity({
		title: 'Chi tiết hoạt động.',
	});
	let {
		ui: uiUserDetail,
		setVisible: setVisibleUserModel,
		setDataModel: setDataModelUser,
	} = useModelUser({
		title: 'Chi tiết người dùng',
	});

	useEffect(async () => {
		if (listUser.length === 0) dispatch(getAllDataAction());
	}, []);

	const getImageActivity = (activities = [], condition = {}) => {
		const result = { ...initRestExportData };
		for (var value of activities) {
			if (value.confirm === false) continue;
			else if (value.typeActivity === 'require') {
				Object.values(value.images).forEach((image) => {
					if (image.target === 'hoc-tap') {
						result.requireHocTap.push(image.url);
					} else if (image.target === 'dao-duc') {
						result.requireDaoDuc.push(image.url);
					}
				});
			} else if (value.typeActivity === 'other') {
				Object.values(value.images).forEach((image) => {
					if (image.target === 'hoc-tap') {
						result.otherHocTap.push(image.url);
					} else if (image.target === 'dao-duc') {
						result.otherDaoDuc.push(image.url);
					}
				});
			} else {
				Object.values(value.images).forEach((image) => {
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
	useEffect(() => {
		if (loading === 0 && listRowChooseData.length) {
			const dataExport = listRowChooseData.map((user) => ({
				...user,
				sex: nameSex[user.sex],
				targetSuccess: user?.targetSuccess?.length
					? user.targetSuccess.map((c) => nameTarget[c]).join(', ')
					: '',
				majors: nameMajors[user.majors],
				department: nameDepartmentActivity[user.department],
				levelReview: nameLevelRegister[user.levelReview],
				...getImageActivity(Object.values(user.activities)),
			}));
			console.log('data export: ', dataExport);
			setCsvData(dataExport);
		} else {
			setCsvData([]);
		}
	}, [loading, listUser, listRowChooseData]);

	const handleConfirm = (uid, acId, confirm) => {
		console.log('handle confirm: ', { uid, acId, confirm });
		if (confirm === 'true')
			dispatch(updateConfirmProofAction({ uid, acId, confirm: true }));
		else if (confirm === 'false')
			dispatch(updateConfirmProofAction({ uid, acId, confirm: false }));
		else dispatch(updateConfirmProofAction({ uid, acId, confirm }));
	};
	const handleClickNameActivity = (item, uid) => {
		setDataModel({ ...item, uid });
		setVisible(true);
	};
	const handleShowUserDetail = (item) => {
		console.log(item);
		setDataModelUser(item);
		setVisibleUserModel(true);
	};
	const handleChangeTargetSuccess = (value, item) => {
		dispatch(
			addUserDetailAction({
				uid: item.uid,
				targetSuccess: value,
			})
		).then((res) => {
			console.log('them thanh cong');
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
							onClick={() =>
								handleClickNameActivity(item, user.uid)
							}
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
				render: (item) => (
					<Space
						style={{ maxWidth: 350, overflowX: 'auto' }}
						direction="horizontal"
					>
						{Object.values(item.images).map((file) => (
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
											<a target="_blank" href={file.url}>
												{`${file.name}`}
											</a>
										</Button>
									</div>
								)}
								{item.target.length > 1 && (
									<p style={{ textAlign: 'center', margin: 0 }}>
										{nameTarget[file.target]}
									</p>
								)}
							</div>
						))}
					</Space>
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
								handleConfirm(user.uid, item.id, key)
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

		return (
			<>
				{user.activities && (
					<Table
						style={{ backgroundColor: '#69c0ff' }}
						columns={columns}
						dataSource={
							Object.values(user.activities)
								.sort(handleSortActivity)
								.map((c, key) => ({
									...c,
									key,
								})) || []
						}
						size="small"
						pagination={false}
					/>
				)}
			</>
		);
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
				<Button
					type="link"
					onClick={() => handleShowUserDetail(record)}
				>
					{record.fullName}
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

	const loadTable = (listUser = []) => (
		<TableCustom
			pagination={false}
			columns={columns}
			expandable={{
				expandedRowRender,
				rowExpandable: (record) =>
					Object.keys(record.activities).length,
			}}
			rowSelection={{
				onSelect: handleSelectRowTabel,
				onSelectAll: handleSelectRowTabel,
			}}
			dataSource={listUser}
			size="small"
			sticky={true}
		/>
	);
	return (
		<Content className={styles.contentAdminManageUser}>
			{loading === 0 && csvData.length !== 0 && (
				<CSVLink
					filename={'Export-SV5T.csv'}
					data={csvData}
					target="_blank"
					headers={headerCsv}
				>
					Xuất dữ liệu đã chọn
				</CSVLink>
			)}
			{listUser?.length ? (
				loadTable(listUser.map((c, key) => ({ ...c, key })))
			) : (
				<Loading />
			)}
			{ui()}
			{uiUserDetail()}
		</Content>
	);
}
