import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Loading from '../components/Loading';
import {
	addUserToActivityAction,
	cancelConfirmProofAction,
	comfirmActivityBuListStudentCodeAction,
	confirmProofAction,
	fetchAllActivityAction,
	fetchUserByActivityAction,
} from '../store/actions';
import { Layout, Button, Switch, Space, Input, message } from 'antd';
import styles from '../styles/Admin.module.css';
import useModelOnlyShowActivity from '../hooks/useModelOnlyShowActivity';
import InputSelectWithAddItem from '../components/InputSelectWithAddItem';
import { nameLevelActivity, nameTarget, nameTypeActivity } from '../config';
import TableCustom from '../components/TableCustom';
import useModelUser from '../hooks/useModelUser';

const { Content } = Layout;

let option = [
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

export default function AdminManageUserByActivity() {
	const [inputStudentCode, setInputStudentCode] = useState('');
	const dispatch = useDispatch();
	const { loading } = useSelector((s) => s.activity);
	const listNews = useSelector((s) =>
		s.activity.value.map((c, key) => ({ ...c, key }))
	);
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
		if (listNews.length === 0)
			dispatch(fetchAllActivityAction()).catch((error) =>
				console.log(error.message)
			);
	}, []);

	const handleConfirm = (uid, acId, confirm) => {
		console.log('handle confirm: ', { uid, acId, confirm });
		if (confirm === 'true') dispatch(confirmProofAction({ uid, acId }));
		else if (confirm === 'false')
			dispatch(cancelConfirmProofAction({ uid, acId, confirm: false }));
		else dispatch(cancelConfirmProofAction({ uid, acId, confirm }));
	};

	const handleClickNameActivity = (item, uid) => {
		setDataModel({ ...item, uid });
		setVisible(true);
	};
	const handleShowUserDetail = (uid, acId, item) => {
		console.log(item);
		if (!item.fullName)
			dispatch(addUserToActivityAction({ uid, acId })).then((res) => {
				setDataModelUser(res.payload);
			});
		else setDataModelUser(item);
		setVisibleUserModel(true);
	};
	const expandedRowRender = (activity, index) => {
		const columns = [
			{
				title: 'Tên',
				key: 'displayName',
				render: (item) => (
					<Button
						type="link"
						onClick={() =>
							handleShowUserDetail(item.id, activity.id, item)
						}
					>
						{item.displayName}
					</Button>
				),
			},
			{
				title: 'Mssv',
				key: 'studentCode',
				searchFilter: true,
				dataIndex: 'studentCode',
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
				defaultFilteredValue: ['false', 'cancel'],
				render: (item) => {
					return (
						<InputSelectWithAddItem
							defaultValue={item.confirm.toString()}
							value={option}
							setValue={(key) =>
								handleConfirm(item.id, activity.id, key)
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
				{activity.users ? (
					<TableCustom
						columns={columns}
						dataSource={activity.users.map((c, key) => ({
							...c,
							key,
						}))}
						size="small"
						pagination={false}
					/>
				) : null}
			</>
		);
	};
	const handleConfirmByListStudentCode = (acId, index) => {
		const listStudentCode = inputStudentCode
			.split(/[,. -]+/)
			.filter((c) => c.length === 10 && parseInt(c));

		const listUserId = activity.users
			.filter((c) => listStudentCode.includes(c.studentCode))
			.map((c) => c.id);
		if (listUserId.length)
			dispatch(
				comfirmActivityBuListStudentCodeAction({ acId, listUserId })
			);
		else message.info('Không có SV có MSSV phù hợp để xác nhận');
		console.log(listUserId);
	};
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
			title: 'Loại hoạt động',
			dataIndex: 'typeActivity',
			key: 'typeActivity',
			filters: Object.entries(nameTypeActivity).map((c) => ({
				value: c[0],
				text: c[1],
			})),
			onFilter: (value, record) =>
				record.typeActivity.toString() === value,
			render: (text) => nameTypeActivity[text],
		},
		{
			title: 'Tên hoạt động',
			key: 'name',
			dataIndex: 'name',
			searchFilter: true,
			render: (item) => {
				return (
					<Button
						type="link"
						onClick={() =>
							handleClickNameActivity(item, activity.userId)
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
			render: (item) => item.target.map((c) => nameTarget[c]).join(', '),
		},
		{ title: 'Ngày diễn ra', dataIndex: 'date', key: 'date' },
		{
			title: 'Xác nhận bằng danh sách MSSV',
			key: 'action',
			render: (text, record, index) =>
				listNews[index]?.users?.length ? (
					<Space direction="horizontal">
						<Input
							onChange={(e) =>
								setInputStudentCode(e.target.value)
							}
						/>

						<Button
							onClick={() =>
								handleConfirmByListStudentCode(record.id, index)
							}
						>
							Thêm
						</Button>
					</Space>
				) : null,
		},
	];
	const onExpand = (expanded, record) => {
		console.log('CLicked expand', { expanded, record });
		if (!record.users)
			dispatch(fetchUserByActivityAction(record.id)).then((action) => {
				record.users = action.payload.respone;
			});
	};
	const loadTable = (list = []) => (
		<TableCustom
			pagination={false}
			columns={columns}
			expandable={{
				expandedRowRender,
				onExpand,
			}}
			dataSource={list}
			size="small"
		/>
	);
	return (
		<Content className={styles.contentAdminManageUser}>
			{listNews?.length ? loadTable(listNews) : <Loading />}
			{ui()}
			{uiUserDetail()}
		</Content>
	);
}
