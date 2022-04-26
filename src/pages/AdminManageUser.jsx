import { ExclamationCircleOutlined, ExportOutlined } from '@ant-design/icons';
import {
    Button,
    Card,
    Layout,
    message,
    Modal,
    Select, Switch,
    Table
} from 'antd';
import React, { useRef, useState } from 'react';
import {
    getActivitiesById,
    getUserApi,
    serializerDoc,
    updateUserActivityApi,
    updateUserApi
} from '../api/firestore';
import ActivityFeed from '../components/ActivityFeed';
import ExportStudent from '../components/ExportStudent';
import FilterStudent from '../components/FilterStudent';
import InputSelectWithAddItem from '../components/InputSelectWithAddItem';
import Loading from '../components/Loading';
import ShowProofImage from '../components/ShowProofImage';
import TableCustom from '../components/TableCustom';
import TagRender from '../components/TagRender';
import UserDetail from '../components/UserDetail';
import {
    nameLevelActivity,
    nameLevelRegister,
    nameTarget,
    optionProof,
    optionsTargetSuccess
} from '../config';
import styles from '../styles/Admin.module.css';

const { Content } = Layout;
const { confirm } = Modal;

const NameModel = {
	user: 'Chi tiết sinh viên',
	export: 'Xuất dữ liệu',
	activity: 'Chi tiết hoạt động',
};

export default function AdminManageUser() {
	const [loading, setLoading] = useState(false);
	const [loadingDetail, setLoadingDetail] = useState(false);
	const [showModel, setShowModel] = useState('');
	const [dataModel, setDataModel] = useState(null);
	const [userActivity, setUserActivity] = useState([]);
	const filterValueRef = useRef({});

	const handleClickNameActivity = (item) => {
		setDataModel({ ...item, uid: item.uid });
		setShowModel(NameModel.activity);
	};
	const handleClickNameUser = (item) => {
		setDataModel(item);
		setShowModel(NameModel.user);
	};

	const showBoxQuestion = (item, key) => {
		confirm({
			title: 'Bạn có chắc muốn xác nhận hoạt động?',
			icon: <ExclamationCircleOutlined />,
			content: 'Hoạt động này KHÔNG có minh chứng',
			onOk() {
				return handleConfirmActivity(item, key);
			},
		});
	};
	const handleConfirmActivity = (id, uid, confirm) => {
		let data = {};
		if (confirm === 'true') data = { confirm: true };
		else if (confirm === 'false') data = { confirm: false };
		else data = { confirm: false, reason: confirm };
		return updateUserActivityApi(id, uid, data)
			.then(() => {
				message.success('Cập nhật thành công');
				const newState = userActivity.map((user) => {
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
				setUserActivity(newState);
			})
			.catch(() => {
				message.error('Cập nhật thất bại, vui lòng thử lại');
			});
	};

	const getActivitiesDetail = (ids, uid) => {
		setLoadingDetail(true);
		getActivitiesById(ids)
			.then((data) => {
				const newState = userActivity.map((user) => {
					if (user.id === uid) {
						const activitiesNew = { ...user.activities };
						user.activityId.forEach((id) => {
							activitiesNew[id].activity = data[id];
						});
						return { ...user, activities: activitiesNew };
					}
					return user;
				});
				setUserActivity(newState);
			})
			.catch((error) => console.log(error))
			.finally(() => setLoadingDetail(false));
	};

	const expandedRowRender = (user) => {
		const columns = [
			{
				title: 'Trạng thái',
				dataIndex: 'active',
				key: 'active',
				render: (value) => <Switch checked={value} size="small" />,
			},
			{
				title: 'Tên hoạt động',
				key: 'name',
				render: (item) => {
					return (
						<Button type="link" onClick={() => handleClickNameActivity(item)}>
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
			{
				title: 'Minh chứng',
				key: 'proof',
				render: (item) =>
					Object.values(item.proof).length ? (
						<ShowProofImage proof={item.proof} />
					) : (
						'Không có'
					),
			},
			{
				title: 'Trạng thái',
				key: 'confirm',
				render: (item) => {
					return (
						<InputSelectWithAddItem
							value={
								item.reason.toString() ||
								user.confirm.includes(item.id).toString()
							}
							option={optionProof}
							setValue={(key) =>
								Object.values(item.proof || {}).length
									? handleConfirmActivity(item.id, user.id, key)
									: showBoxQuestion(item, key)
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

		if (!loadingDetail) {
			return (
				<Table
					tableLayout={'unset'}
					style={{ backgroundColor: '#69c0ff' }}
					columns={columns}
					dataSource={Object.values(user.activities).map((c, index) => ({
						...c.activity,
						proof: c.proof || {},
						reason: c.reason,
						key: index,
					}))}
					size="small"
					pagination={false}
				/>
			);
		} else return <Loading />;
	};
	const handleChangeTargetSuccess = (targetSuccess, user) => {
		updateUserApi(user.id, { targetSuccess })
			.then(() => {
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
		},
		{
			title: 'Xét SV5T cấp',
			key: 'levelReview',
			render: (record) => nameLevelRegister[record.levelReview],
		},
		{
			title: 'Lớp',
			key: 'classUser',
			dataIndex: 'classUser',
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
			render: (record) => (
				<Select
					maxTagCount="responsive"
					mode="tags"
					placeholder="Tiêu chí đã hoàn thành"
					tagRender={TagRender}
					defaultValue={record.targetSuccess}
					style={{ width: 200 }}
					options={optionsTargetSuccess}
					onChange={(value) => handleChangeTargetSuccess(value, record)}
				/>
			),
		},
	];

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
				setUserActivity(data);
			})
			.catch((error) => {
				message.error('Lỗi tải dữ liệu');
				console.log(error);
			})
			.finally(() => setLoading(false));
	};

	const changePage = (isNextPage) => {
		const data = filterValueRef.current;
		if (isNextPage) data.next = userActivity[userActivity.length - 1];
		else data.previous = userActivity[0];
		getUser(data);
	};

	const expandedRows = (expanded, record) => {
		if (!expanded) return;
		if (!Object.values(record.activities)[0].activity) {
			getActivitiesDetail(record.activityId, record.id);
		}
	};

	return (
		<Content className={styles.contentAdminManageUser}>
			<Card style={{ width: '100vw' }} size="small">
				<div className={styles.itemBetween}>
					<FilterStudent getData={getUser} />
					<Button
						icon={<ExportOutlined />}
						style={{ background: '#a0d911' }}
						onClick={() => {
							setShowModel(NameModel.export);
						}}
					>
						Xuất dữ liệu
					</Button>
				</div>
			</Card>
			<TableCustom
				style={{
					height: 'calc(100vh - 82px - 64px)',
					overflow: 'scroll',
				}}
				sticky={true}
				loading={loading}
				columns={columns}
				expandable={{
					expandedRowRender,
					onExpand: expandedRows,
					rowExpandable: (record) => record?.activityId?.length,
				}}
				dataSource={userActivity}
				rowKey={(record) => record.id}
				size="middle"
				align="center"
				tableLayout={'unset'}
				rowClassName="rowTable"
				pagination={false}
				footer={() => (
					<div className={styles.itemCenter}>
						<Button onClick={() => changePage(false)}>Trang trước</Button>
						<Button onClick={() => changePage(true)}>Trang sau</Button>
					</div>
				)}
			/>
			<Modal
				visible={showModel !== ''}
				title={showModel}
				centered={true}
				onCancel={() => setShowModel('')}
				footer={null}
				bodyStyle={{ padding: 0 }}
			>
				{showModel === NameModel.user && <UserDetail {...dataModel} />}
				{showModel === NameModel.activity && (
					<ActivityFeed
						{...dataModel}
						showFull={true}
						btnDetail={false}
						loading={false}
					/>
				)}
				{showModel === NameModel.export && <ExportStudent />}
			</Modal>
		</Content>
	);
}
