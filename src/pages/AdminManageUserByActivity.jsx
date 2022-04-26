import { ExclamationCircleOutlined } from '@ant-design/icons';
import {
	AutoComplete,
	Button,
	Card,
	Input,
	Layout,
	message,
	Modal,
	Table,
	Typography,
} from 'antd';
import { useEffect, useRef, useState } from 'react';
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
	const [loading, setLoading] = useState(false);
	const [searchValue, setSearchValue] = useState('');
	const inputStudentCode = useRef([]);
	const filterValueRef = useRef({});

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

		const listUser = activityChoice.users.filter(
			(user) =>
				listStudentCode.includes(user.studentCode) &&
				user.activities[activityChoice.id].proof >= 1 &&
				user.activities[activityChoice.id].confirm === false
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
						handleConfirmActivity(uid, activityChoice.id, true)
					)
				);
			},
		});
	};

	const changePage = (isNextPage) => {
		if (!activityChoice) {
			message.warning('Vui lòng chọn hoạt động');
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
		setLoading(true);
		filterValueRef.current = dataFilter;
        console.log(dataFilter);
        return getUserApi({ ...dataFilter, acid: activityChoice.id })
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
			.finally(() => setLoading(false));
	};

	const getActivities = (dataFilter, nextPage = false) => {
		setLoading(true);
		if (nextPage) dataFilter.next = activities[activities.length - 1];
		return getAllRegisterActivityApi(dataFilter)
			.then(serializerDoc)
			.then((data) => {
				if (!data.length) {
					return;
				}
				setActivities(data);
			})
			.catch((error) => {
				message.error('Lỗi tải dữ liệu');
				console.log(error);
			})
			.finally(() => setLoading(false));
	};

	const onSelectActivity = (idChoice) => {
		const activity = activities.find((c) => c.id === idChoice);
		if (activity) {
			setSearchValue(activity.name);
			setActivityChoice(activity);
		}
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
				return Object.values(user.activities[activityChoice.id].proof)
					?.length ? (
					<ShowProofImage proof={user.activities[activityChoice.id].proof} />
				) : (
					'Không có'
				);
			},
		},
		{
			title: 'Trạng thái',
			key: 'confirm',
			render: (user) => {
				const activity = user.activities[activityChoice.id];
				return (
					<InputSelectWithAddItem
						value={
							activity.reason ||
							user.confirm.includes(activityChoice.id).toString()
						}
						option={optionProof}
						setValue={(key) =>
							Object.values(activity.proof || {}).length
								? handleConfirmActivity(activityChoice.id, user.id, key)
								: showBoxQuestion(activityChoice.id, user.id, key)
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

	useEffect(() => {
		const timeout = setTimeout(() => {
			getActivities({ nameSearch: searchValue });
		}, 400);

		return () => {
			clearTimeout(timeout);
		};
	}, [searchValue]);

	return (
		<Content className={styles.contentAdminManageUser}>
			<Card style={{ width: '100vw' }} size="small">
				<div className={styles.itemBetween}>
					<AutoComplete
						autoFocus
						options={activities.map((a) => ({ label: a.name, value: a.id }))}
						style={{
							width: 200,
						}}
						value={searchValue}
						onSelect={onSelectActivity}
						onSearch={(value) => setSearchValue(value)}
						placeholder="Chọn hoạt động"
					/>
					<FilterStudent getData={getUser} />
					<div>
						<Input.Group compact>
							<Input
								style={{ width: '250px' }}
								placeholder="Danh sách MSSV để xác nhận"
							/>
							<Button
								type="primary"
								disabled={!activityChoice}
								onClick={handleConfirmByListStudentCode}
							>
								Xác nhận tất cả
							</Button>
						</Input.Group>
					</div>
				</div>
			</Card>
			<Table
				columns={columns}
				dataSource={users}
				loading={loading}
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
