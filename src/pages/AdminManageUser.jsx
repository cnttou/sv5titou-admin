import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Loading from '../components/Loading';
import {
	cancelConfirmProofAction,
	confirmProofAction,
	fetchUserActivityAction,
} from '../store/actions';
import { Table, Layout, Button } from 'antd';
import styles from '../styles/Admin.module.css';
import useModelOnlyShowActivity from '../hooks/useModelOnlyShowActivity';
import InputSelectWithAddItem from '../components/InputSelectWithAddItem';
import 'antd/lib/dropdown/style/index.css';
import { nameTarget } from '../config';

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

export default function AdminManageUser() {
	const dispatch = useDispatch();
	let listUser = useSelector((state) => state.userActivity.value);
	let { ui, setVisible, setDataModel } = useModelOnlyShowActivity({
		title: 'Chi tiết hoạt động.',
	});

	useEffect(async () => {
		dispatch(fetchUserActivityAction()).catch((error) =>
			console.log(error.message)
		);
	}, []);

	const handleConfirm = (uid, acId, confirm) => {
		let isConfirm = confirm === 'true';
		console.log('handle confirm: ', { uid, acId, confirm });
		if (isConfirm) dispatch(confirmProofAction({ uid, acId }));
		else dispatch(cancelConfirmProofAction({ uid, acId, confirm }));
	};

	const handleClickNameActivity = (item, uid) => {
		setDataModel({ ...item, uid });
		setVisible(true);
	};

	const expandedRowRender = (activity) => {
		const columns = [
			// {
			// 	title: 'Trạng thái',
			// 	dataIndex: 'active',
			// 	key: 'active',
			// 	// filters: [
			// 	// 	{
			// 	// 		text: 'Chưa kích hoạt',
			// 	// 		value: 'false',
			// 	// 	},
			// 	// 	{
			// 	// 		text: 'Đã kích hoạt',
			// 	// 		value: 'true',
			// 	// 	},
			// 	// ],
			// 	// defaultFilteredValue: ['true'],
			// 	// onFilter: (value, record) => record.active.toString() === value,
			// 	render: (text) => <Switch checked={text} size="small" />,
			// },
			{
				title: 'Tên hoạt động',
				key: 'name',
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
				title: 'Tiêu chí',
				key: 'target',
				render: (item) => nameTarget[item.target],
			},
			{ title: 'Ngày diễn ra', dataIndex: 'date', key: 'date' },
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
				],
				onFilter: (value, record) => {
					if (
						record.confirm.toString().length > 5 &&
						value === 'cancel'
					)
						return true;
					else return record.confirm.toString() === value;
				},
				defaultFilteredValue: ['false', 'cancel'],
				render: (item) => {
					return (
						<InputSelectWithAddItem
							defaultValue={item.confirm.toString()}
							value={option}
							setValue={(key) =>
								handleConfirm(activity.userId, item.id, key)
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
			<Table
				columns={columns}
				dataSource={
					activity.listData.map((c, key) => ({ ...c, key })) || []
				}
				size="small"
				pagination={false}
			/>
		);
	};

	const columns = [
		{
			title: 'Tên',
			key: 'name',
			filters: [
				{
					text: 'Có đăng ký hoạt động',
					value: 'registered',
				},
				{
					text: 'Không đăng ký hoạt động',
					value: 'unregistered',
				},
				{
					text: 'Có hoạt động chưa xác nhận',
					value: 'notConfirm',
				},
			],
			onFilter: (value, record) => {
				if (value === 'registered' && record.listData.length !== 0)
					return true;
				else if (
					value === 'unregistered' &&
					record.listData.length === 0
				)
					return true;
				else if (value === 'notConfirm')
					return record.listData.filter((c) => c.confirm === 'false')
						.length;

				return false;
			},
			defaultFilteredValue: ['notConfirm'],
			render: (item) => (
				<p>
					{item.fullName ||
						item.email.slice(10, item.email.indexOf('@'))}
				</p>
			),
		},
		{
			title: 'Mssv',
			key: 'mssv',
			render: (item) => <p>{item.email.slice(0, 10)}</p>,
		},
		{
			title: 'Lớp',
			key: 'classUser',
			render: (item) => <p>{item.classUser || 'Sv chưa điền'}</p>,
		},
	];

	const loadTable = (listUser = []) => (
		<Table
			pagination={false}
			columns={columns}
			expandable={{
				rowExpandable: (record) => record.listData.length !== 0,
				expandedRowRender,
			}}
			dataSource={listUser}
			size="small"
		/>
	);
	return (
		<Content className={styles.contentAdminManageUser}>
			{listUser?.length ? (
				loadTable(listUser.map((c, key) => ({ ...c, key })))
			) : (
				<Loading />
			)}
			{ui()}
		</Content>
	);
}
