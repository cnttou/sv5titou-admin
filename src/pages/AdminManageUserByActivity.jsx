import { useEffect, useState } from 'react';
import Loading from '../components/Loading';
import {
	Layout,
	Button,
	Space,
	Input,
	message,
	Modal,
	Image,
	Typography,
} from 'antd';
import styles from '../styles/Admin.module.css';
import InputSelectWithAddItem from '../components/InputSelectWithAddItem';
import { nameLevelActivity, nameTarget, nameTypeActivity } from '../config';
import TableCustom from '../components/TableCustom';
import ActivityFeed, { checkFileImage } from '../components/ActivityFeed';
import { ExclamationCircleOutlined, PaperClipOutlined } from '@ant-design/icons';
import {
	getActivityApi,
	getUserActivityByAcIds,
	getUserByIds,
	serializerDoc,
	serializerDocToObject,
	updateUserActivityApi,
} from '../api/firestore';
import UserDetail from '../components/UserDetail';

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
	const [activities, setActivities] = useState([]);
	const [loading, setLoading] = useState(false);
	const [showUserModel, setShowUserModel] = useState(false);
	const [showActivityModel, setShowActivityModel] = useState(false);
	const [dataModel, setDataModel] = useState(null);

	useEffect(async () => {
		setLoading(true);
		getActivityApi()
			.then(serializerDoc)
			.then((data) => {
				setActivities(data);
				setLoading(false);
				const acIds = data.map((c) => c.id);
				if (acIds.length > 10) acIds.length = 10;
				return acIds;
			})
			.then((acIds) => {
				getMoreUserDetail(acIds);
			})
			.catch(() => {
				message.error('Không thể tải dữ liệu vui lòng thử lại');
			});
	}, []);

	useEffect(() => {
		console.log(activities);
	}, [activities]);

	const handleConfirmActivity = (user, confirm) => {
		let data = {};
		if (confirm === 'true') data = { confirm: true };
		else if (confirm === 'false') data = { confirm: false };
		else data = { confirm };
		return updateUserActivityApi(user.id, data)
			.then(() => {
				message.success('Cập nhật thành công');
				setActivities((preState) =>
					preState.map((activity) =>
						activity.id === user.acId
							? {
									...activity,
									users: activity.users.map((u) =>
										u.uid === user.uid
											? { ...u, ...data }
											: u
									),
							  }
							: activity
					)
				);
			})
			.catch(() => {
				message.error('Cập nhật thất bại, vui lòng thử lại');
			});
	};

	const handleClickNameUser = (item) => {
		setDataModel(item);
		setShowUserModel(true);
	};

    const showBoxQuestion = (user, key) => {
		confirm({
			title: 'Bạn có chắc muốn xác nhận hoạt động?',
			icon: <ExclamationCircleOutlined />,
			content:
				'Hoạt động này KHÔNG có minh chứng',
			onOk() {
				return handleConfirmActivity(user, key);
			},
			onCancel() {},
		});
	};

	const expandedRowRender = (activity, index) => {
		const columns = [
			{
				title: 'Tên',
				key: 'displayName',
				render: (item) => (
					<Button
						type="link"
						onClick={() => handleClickNameUser(item)}
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
				title: 'Minh chứng',
				key: 'proof',
				render: (item) =>
					item.proof && Object.values(item.proof)?.length ? (
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
				filters: filterConfirm,
				onFilter: (value, record) => {
					if (value === 'notproof') return record.proof === 0;
					else if (value === 'cancel')
						return record.confirm.toString().length > 5;
					else if (value === 'false')
						return record.confirm === false && record.proof !== 0;
					else if (value === 'true') return record.confirm === true;
				},
				defaultFilteredValue: [],
				render: (user) => {
					return (
						<InputSelectWithAddItem
							value={user.confirm.toString()}
							option={option}
							setValue={(key) =>
								Object.values(user.proof || {}).length
									? handleConfirmActivity(user, key)
									: showBoxQuestion(user, key)
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

		const listUser = activity.users.filter(
			(user) =>
				listStudentCode.includes(user.studentCode) &&
				user.activities[activity.id].proof >= 1 &&
				user.activities[activity.id].confirm === false
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
						<Text key={user.uid}>{`${user.studentCode} - ${
							user.fullName || user.displayName
						}`}</Text>
					))}
				</>
			),
			onOk() {
				return Promise.all(
					listUserId.map((uid) =>
						handleConfirmActivity(uid, activity.id, true)
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
			filters: Object.entries(nameLevelActivity).map((c) => ({
				text: c[1],
				value: c[0],
			})),
			onFilter: (value, record) => record.level === value,
			key: 'level',
			render: (text) => nameLevelActivity[text] || '---',
		},
		{
			title: 'Tiêu chí',
			key: 'target',
			filters: Object.entries(nameTarget).map((c) => ({
				value: c[0],
				text: c[1],
			})),
			onFilter: (value, record) => record.target.includes(value),
			render: (text) => text.target.map((c) => nameTarget[c]).join(', '),
		},
		{
			title: 'Ngày diễn ra',
			key: 'date',
			render: (text) => text.date || '---',
		},
		{
			title: 'Xác nhận bằng danh sách MSSV',
			key: 'action',
			render: (text, record) =>
				record?.users?.length ? (
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

	const getMoreUserDetail = async (acIds) => {
		setLoading(true);
		let userActivities = await getUserActivityByAcIds(acIds).then(
			serializerDoc
		);

		let uids = userActivities.map((c) => c.uid);
		uids = [...new Set(uids)];

		if (!uids.length) return setLoading(false);
		const users = await getUserByIds(uids).then(serializerDocToObject);

		userActivities = userActivities
			.map((c) => ({
				...users[c.uid],
				...c,
			}))
			.filter((c) => c.displayName && c.proof);
		setActivities((preState) =>
			preState.map((activity) => ({
				...activity,
				users: userActivities.filter(
					(mapUserAc) => mapUserAc.acId === activity.id
				),
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

	return (
		<Content className={styles.contentAdminManageUser}>
			<TableCustom
				columns={columns}
				expandable={{
					expandedRowRender,
					rowExpandable: (activity) => activity?.users?.length,
				}}
				dataSource={activities}
				loading={loading}
				rowKey={(record) => record.id}
				rowClassName="rowTable"
				size="middle"
				pagination={{ position: ['topCenter'] }}
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
