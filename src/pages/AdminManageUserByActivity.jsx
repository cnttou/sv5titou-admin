import { ExclamationCircleOutlined } from '@ant-design/icons';
import {
    Button,
    Card,
    Input,
    Layout,
    message,
    Modal, Typography
} from 'antd';
import { useRef, useState } from 'react';
import {
    getAllRegisterActivityApi,
    getUserApi,
    serializerDoc,
    updateUserActivityApi
} from '../api/firestore';
import ChooceActivity from '../components/ChooceActivity';
import FilterStudent from '../components/FilterStudent';
import InputSelectWithAddItem from '../components/InputSelectWithAddItem';
import ShowProofImage from '../components/ShowProofImage';
import TableCustom from '../components/TableCustom';
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
	const [showModel, setShowModel] = useState(false);
	const inputStudentCode = useRef([]);
	const [hasMoreData, setHasMoreData] = useState(false);
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
		setLoading(true);
		filterValueRef.current = dataFilter;
		return getUserApi(dataFilter)
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
				console.log(error);
			})
			.finally(() => setLoading(false));
	};

	const getActivities = (dataFilter, nextPage = false) => {
		setLoading(true);
		if (nextPage) dataFilter.next = activities[activities.length - 1];
		else setHasMoreData(true);
		return getAllRegisterActivityApi(dataFilter)
			.then(serializerDoc)
			.then((data) => {
				if (!data.length) {
					setHasMoreData(false);
					return;
				}
				setActivities(data);
			})
			.catch((error) => {
				message.error('Lỗi tải dữ liệu');
				setHasMoreData(false);
				console.log(error);
			})
			.finally(() => setLoading(false));
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

	return (
		<Content className={styles.contentAdminManageUser}>
			<Card style={{ width: '100vw' }} size="small">
				<div className={styles.itemBetween}>
					<Button type="primary" onClick={() => setShowModel(true)}>
						Chọn hoạt động
					</Button>
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
			<TableCustom
				columns={columns}
				dataSource={users}
				loading={loading}
				rowKey={(record) => record.id}
				rowClassName="rowTable"
				size="middle"
				pagination={false}
				footer={() => (
					<div className={styles.itemCenter}>
						<Button
							disabled={!activityChoice}
							onClick={() => changePage(false)}
						>
							Trang trước
						</Button>
						<Button disabled={!activityChoice} onClick={() => changePage(true)}>
							Trang sau
						</Button>
					</div>
				)}
			/>
			<Modal
				visible={showModel}
				title={'Chọn một hoạt động'}
				centered={true}
				onCancel={() => setShowModel(false)}
				footer={null}
			>
				<ChooceActivity
					activities={activities}
					setActivityChoice={setActivityChoice}
					doSearch={getActivities}
					hasMoreData={hasMoreData}
				/>
			</Modal>
		</Content>
	);
}
