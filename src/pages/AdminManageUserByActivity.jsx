import { ExclamationCircleOutlined } from '@ant-design/icons';
import {
	Button,
	Card,
	Input,
	Layout,
	message,
	Modal,
	Select,
	Table,
	Typography,
} from 'antd';
import { useRef, useState } from 'react';
import {
	getAllRegisterActivityApi,
	getUserApi,
	serializerDoc,
	updateUserActivityApi,
} from '../api/firestore';
import FilterStudent from '../components/FilterStudent';
import InputSelectWithAddItem from '../components/InputSelectWithAddItem';
import ShowProofImage from '../components/ShowProofImage';
import { optionProof } from '../config';
import styles from '../styles/Admin.module.css';

const { Text } = Typography;
const { Content } = Layout;
const { confirm } = Modal;

export default function AdminManageUserByActivity() {
	const [users, setUsers] = useState([]);
	const [activityChoice, setActivityChoice] = useState();
	const [activities, setActivities] = useState([]);
	const [loadingUser, setLoadingUser] = useState(false);
	const [searchValue, setSearchValue] = useState('');
	const inputStudentCode = useRef([]);
	const filterValueRef = useRef({});
	const timeout = useRef();

	const handleConfirmActivity = (id, uid, confirm) => {
		let data = {};
		if (confirm === 'true') data = { confirm: true };
		else if (confirm === 'false') data = { confirm: false };
		else data = { confirm: false, reason: confirm };
		return updateUserActivityApi(id, uid, data)
			.then(() => {
				message.success('Cập nhật thành công');
				const newState = users.map((user) => {
					if (user.id === uid) {
						const newConfirm = data.confirm
							? user.confirm.concat(id)
							: user.confirm.filter((i) => i !== id);

						const activitiesNew = { ...user.activities };
						user.activityId.forEach((acid) => {
							if (acid === id) activitiesNew[acid].reason = data.reason || '';
						});
						return {
							...user,
							confirm: newConfirm,
							activities: activitiesNew,
						};
					}
					return user;
				});
				setUsers(newState);
			})
			.catch(() => {
				message.error('Cập nhật thất bại, vui lòng thử lại');
			});
	};

	const showBoxQuestion = (id, uid, key) => {
		confirm({
			title: 'Bạn có chắc muốn xác nhận hoạt động?',
			icon: <ExclamationCircleOutlined />,
			content: 'Hoạt động này KHÔNG có minh chứng',
			onOk() {
				return handleConfirmActivity(id, uid, key);
			},
			onCancel() {},
		});
	};

	const handleConfirmByListStudentCode = () => {
		const listStudentCode = inputStudentCode.current
			.split(/[,. -]+/)
			.filter((c) => c.length === 10 && parseInt(c));

		const listUser = users.filter(
			(user) =>
				listStudentCode.includes(user.studentCode) &&
				Object.keys(user.activities[activityChoice?.id].proof||{}).length >= 1 &&
				user.activityId.includes(activityChoice?.id)
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
					<p>{`Có ${listUserId.length} sinh viên trong trang này sẽ được xác nhận`}</p>
					{listUser.map((user) => (
						<Text key={user.id}>{`${user.studentCode} - ${
							user.fullName || user.displayName
						}`}</Text>
					))}
				</>
			),
			onOk() {
				return Promise.all(
					listUserId.map((uid) =>
						handleConfirmActivity(activityChoice?.id, uid, 'true')
					)
				);
			},
		});
	};

	const changePage = (isNextPage) => {
		if (!activityChoice) {
			message.warning('Vui lòng chọn một hoạt động');
			return;
		}
		const data = {
			...filterValueRef.current,
			previous: undefined,
			next: undefined,
		};
		if (isNextPage) data.next = activities[activities.length - 1];
		else data.previous = activities[0];
		getUser(data);
	};

	const getUser = (dataFilter) => {
		if (!activityChoice) {
			message.warning('Vui lòng chọn một hoạt động.');
			return;
		}
		setLoadingUser(true);
		filterValueRef.current = dataFilter;
		console.log(dataFilter);
		return getUserApi({ ...dataFilter, acid: activityChoice?.id })
			.then(serializerDoc)
			.then((data) => {
				if (!data.length) {
					message.warning('Không có dữ liệu');
					return;
				}
				setUsers(data);
			})
			.catch((error) => {
				message.error('Lỗi tải dữ liệu');
				console.error(error);
			})
			.finally(() => setLoadingUser(false));
	};

	const getActivities = (dataFilter, nextPage = false) => {
		if (nextPage) dataFilter.next = activities[activities.length - 1];
		return getAllRegisterActivityApi(dataFilter)
			.then(serializerDoc)
			.then((data) => {
				if (!data.length) {
					message.warning('Không có dữ liệu');
					return;
				}
				setActivities(data);
			})
			.catch((error) => {
				message.error('Lỗi tải dữ liệu');
				console.log(error);
			});
	};

	const onSelectActivity = (idChoice) => {
		const activity = activities.find((c) => c.id === idChoice);
		if (activity) {
			setActivityChoice(activity);
			setSearchValue(activity.name);
		}
	};

	const handleChangeSearch = (value) => {
		clearTimeout(timeout.current);
		setSearchValue(value);
		timeout.current = setTimeout(() => {
			getActivities({ nameSearch: value });
		}, 400);
	};

	const columns = [
		{
			title: 'Tên',
			key: 'displayName',
			render: (user) => user.fullName || user.displayName,
		},
		{
			title: 'Email',
			key: 'email',
			dataIndex: 'email',
		},
		{
			title: 'Mssv',
			key: 'studentCode',
			dataIndex: 'studentCode',
		},
		{
			title: 'Minh chứng',
			key: 'proof',
			render: (user) => {
				return Object.values(user.activities[activityChoice?.id]?.proof || {})
					?.length ? (
					<ShowProofImage proof={user.activities[activityChoice?.id].proof} />
				) : (
					'Không có'
				);
			},
		},
		{
			title: 'Trạng thái',
			key: 'confirm',
			render: (user) => (
				<InputSelectWithAddItem
					value={
						user.activities[activityChoice?.id].reason ||
						user.confirm.includes(activityChoice?.id) + ''
					}
					option={optionProof}
					setValue={(key) =>
						Object.values(user.activities[activityChoice?.id]?.proof || {})
							.length
							? handleConfirmActivity(activityChoice?.id, user.id, key)
							: showBoxQuestion(activityChoice?.id, user.id, key)
					}
					style={{
						width: '100%',
						maxWidth: 250,
					}}
				/>
			),
		},
	];

	return (
		<Content className={styles.contentAdminManageUser}>
			<Card style={{ width: '100vw' }} size="small">
				<div className={styles.itemBetween}>
					<Select
						showSearch
						value={searchValue}
						placeholder="Chọn hoạt động"
						style={{ width: 240 }}
						showArrow={false}
						filterOption={false}
						notFoundContent={null}
						onSearch={handleChangeSearch}
						onSelect={onSelectActivity}
						options={activities.map((a) => ({ label: a.name, value: a.id }))}
					/>
					<FilterStudent getData={getUser} />
					<div>
						<Input.Group compact>
							<Input
								style={{ width: 220 }}
								placeholder="Danh sách MSSV để xác nhận"
								onChange={(e) => (inputStudentCode.current = e.target.value)}
							/>
							<Button
								type="primary"
								disabled={!activityChoice}
								onClick={handleConfirmByListStudentCode}
							>
								Xác nhận
							</Button>
						</Input.Group>
					</div>
				</div>
			</Card>
			<Table
				columns={columns}
				dataSource={users}
				loading={loadingUser}
				rowKey={(record) => record.id}
				rowClassName="rowTable"
				size="middle"
				pagination={false}
				footer={() => (
					<div className={styles.itemCenter}>
						<Button disabled={!users.length} onClick={() => changePage(false)}>
							Trang trước
						</Button>
						<Button disabled={!users.length} onClick={() => changePage(true)}>
							Trang sau
						</Button>
					</div>
				)}
			/>
		</Content>
	);
}
