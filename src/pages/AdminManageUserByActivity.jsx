import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Loading from '../components/Loading';
import {
	comfirmActivityBuListStudentCodeAction,
	updateConfirmProofAction,
	getAllDataAction,
} from '../store/actions';
import {
	Layout,
	Button,
	Switch,
	Space,
	Input,
	message,
	Modal,
	Typography,
} from 'antd';
import styles from '../styles/Admin.module.css';
import useModelOnlyShowActivity from '../hooks/useModelOnlyShowActivity';
import InputSelectWithAddItem from '../components/InputSelectWithAddItem';
import { nameLevelActivity, nameTarget, nameTypeActivity } from '../config';
import TableCustom from '../components/TableCustom';
import useModelUser from '../hooks/useModelUser';

const { Text } = Typography;
const { Content } = Layout;
const { confirm } = Modal;

const filterConfirm = [
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
];

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

export default function AdminManageUserByActivity() {
	const [inputStudentCode, setInputStudentCode] = useState('');
	const dispatch = useDispatch();
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
		if (listNews.length === 0) dispatch(getAllDataAction());
	}, []);

	const handleConfirm = (uid, acId, confirm) => {
		console.log('handle confirm: ', { uid, acId, confirm });
		if (confirm === 'true')
			return dispatch(updateConfirmProofAction({ uid, acId, confirm: true }));
		else if (confirm === 'false')
			return dispatch(updateConfirmProofAction({ uid, acId, confirm: false }));
		else return dispatch(updateConfirmProofAction({ uid, acId, confirm }));
	};
	const handleShowUserDetail = (uid, acId, item) => {
		setDataModelUser(item);
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
						{item.fullName || item.displayName}
					</Button>
				),
			},
			{
				title: 'Email',
				key: 'email',
				searchFilter: true,
				dataIndex: 'email',
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
				filters: filterConfirm,
				onFilter: (value, record) => {
					const currentActivity = record.activities[activity.id];
					if (value === 'notproof')
						return currentActivity.proof === 0;
					else if (value === 'cancel')
						return currentActivity.confirm.toString().length > 5;
					else if (value === 'false')
						return (
							currentActivity.confirm === false &&
							currentActivity.proof !== 0
						);
					else if (value === 'true')
						return currentActivity.confirm === true;
				},
				defaultFilteredValue: [],
				render: (user) => {
					console.log(user);
					return (
						<InputSelectWithAddItem
							defaultValue={user.activities[
								activity.id
							].confirm.toString()}
							value={option}
							setValue={(key) =>
								handleConfirm(user.userId, activity.id, key)
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
						dataSource={activity.users.map((user, key) => ({
							...user,
							key,
						}))}
						size="small"
						pagination={false}
					/>
				) : null}
			</>
		);
	};
	const handleConfirmByListStudentCode = (activity) => {
		const listStudentCode = inputStudentCode
			.split(/[,. -]+/)
			.filter((c) => c.length === 10 && parseInt(c));

		const listUser = activity.users.filter((c) =>
			listStudentCode.includes(c.studentCode)
		);
		const listUserId = listUser.map((c) => c.id);

		if (!listUserId.length) {
			message.info('Không có SV có MSSV phù hợp để xác nhận');
			return;
		}
		confirm({
			title: 'Xác nhận',
			icon: null,
			content: (
				<>
					<p>{`Có ${listUserId.length} sinh viên sẽ được xác nhận hoạt động này`}</p>
					{listUser.map((user) => (
						<Text key={user.userId}>{`${user.studentCode} - ${
							user.fullName || user.displayName
						}`}</Text>
					))}
				</>
			),
			onOk() {
				return Promise.all(
					listUserId.map((uid) =>
						handleConfirm(uid, activity.id, true)
					)
				);
			},
			onCancel() {
				console.log('Cancel');
			},
		});

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
			onFilter: (value, record) => record.typeActivity === value,
			render: (text) => nameTypeActivity[text],
		},
		{
			title: 'Tên hoạt động',
			key: 'name',
			dataIndex: 'name',
			searchFilter: true,
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
								handleConfirmByListStudentCode(record)
							}
						>
							Thêm
						</Button>
					</Space>
				) : null,
		},
	];
	const loadTable = (list = []) => (
		<TableCustom
			pagination={false}
			columns={columns}
			expandable={{
				expandedRowRender,
				rowExpandable: (activity) => activity.users.length,
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
