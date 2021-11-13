import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Loading from '../components/Loading';
import {
	addUserToActivityAction,
	cancelConfirmProofAction,
	confirmProofAction,
	fetchAllActivityAction,
} from '../store/actions';
import { Layout, Button, Switch } from 'antd';
import styles from '../styles/Admin.module.css';
import useModelOnlyShowActivity from '../hooks/useModelOnlyShowActivity';
import InputSelectWithAddItem from '../components/InputSelectWithAddItem';
import {
	nameLevelActivity,
	nameLevelRegister,
	nameTarget,
	nameTypeActivity,
} from '../config';
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
	const dispatch = useDispatch();
	const { value: listNews, loading } = useSelector((s) => s.activity);
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
		let isConfirm = confirm === 'true';
		console.log('handle confirm: ', { uid, acId, confirm });
		if (isConfirm) dispatch(confirmProofAction({ uid, acId }));
		else
			dispatch(
				cancelConfirmProofAction({ uid, acId, confirm: isConfirm })
			);
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
	const expandedRowRender = (activity) => {
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
			// {
			// 	title: 'Xét SV5T cấp',
			// 	key: 'levelReview',
			// 	filters: Object.entries(nameLevelRegister).map((c) => ({
			// 		text: c[1],
			// 		value: c[0],
			// 	})),
			// 	onFilter: (value, record) => record.levelReview === value,
			// 	render: (item) => nameLevelRegister[item.levelReview],
			// },
			// {
			// 	title: 'Lớp',
			// 	key: 'classUser',
			// 	render: (item) => <p>{item.classUser || 'Sv chưa điền'}</p>,
			// },
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
			<TableCustom
				columns={columns}
				dataSource={
					activity.users.map((c, key) => ({ ...c, key })) || []
				}
				size="small"
				pagination={false}
			/>
		);
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
	];

	const loadTable = (list = []) => (
		<TableCustom
			pagination={false}
			columns={columns}
			expandable={{
				rowExpandable: (record) => record.users.length !== 0,
				expandedRowRender,
			}}
			dataSource={list}
			size="small"
		/>
	);
	return (
		<Content className={styles.contentAdminManageUser}>
			{listNews?.length ? (
				loadTable(listNews.map((c, key) => ({ ...c, key })))
			) : (
				<Loading />
			)}
			{ui()}
			{uiUserDetail()}
		</Content>
	);
}
