import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Button, Card, Layout, message, Modal, Space, Switch } from 'antd';
import React, { useRef, useState } from 'react';
import { uid as genId } from 'uid';
import {
	addActivityApi,
	deleteActivityApi,
	getAllRegisterActivityApi,
	serializerDoc,
	updateActivityApi,
} from '../api/firestore';
import FilterActivity from '../components/FilterActivity';
import Loading from '../components/Loading';
import TableCustom from '../components/TableCustom';
import {
	nameDepartmentActivity,
	nameLevelActivity,
	nameTarget,
} from '../config';
import FormActivity from '../forms/FormActivity';
import styles from '../styles/Admin.module.css';
import { nonAccentVietnamese } from '../utils/common';

const { Content } = Layout;
const { confirm } = Modal;

const initActivity = {
	image: '',
	typeActivity: 'register',
	active: true,
	department: null,
	level: null,
	name: '',
	date: null,
	location: '',
	summary: '',
	numPeople: null,
	target: [],
};

const TYPE_ACTION = {
	EDIT: 'edit',
	ADD: 'add',
};

const initChooseActivity = {
	type: '',
	activity: {},
};
export default function AdminManageActivity() {
	const [loading, setLoading] = useState(false);
	const [activities, setActivities] = useState([]);
	const [showModel, setShowModel] = useState(false);
	const [loadingForm, setLoadingForm] = useState(false);
	const [chooseActivity, setChooseActivity] = useState(initChooseActivity);
	const filterValueRef = useRef({});

	const handleShowModelToEdit = (item) => {
		setChooseActivity({ type: TYPE_ACTION.EDIT, activity: item });
		setShowModel(true);
	};

	const handleShowModelToAddNew = () => {
		setChooseActivity({ type: TYPE_ACTION.ADD, activity: initActivity });
		setShowModel(true);
	};

	const handleDeleteActivity = (item) => {
		confirm({
			title: 'Bạn có chắc muốn xóa hoạt động?',
			icon: <ExclamationCircleOutlined />,
			content: item.name,
			onOk() {
				return deleteActivityApi(item.id)
					.then(() => {
						message.success('Xóa thành công');
						setActivities((prevActivity) =>
							prevActivity.filter((a) => a.id !== item.id)
						);
					})
					.catch(() => {
						message.error('Xóa thất bại vui lòng thử lại');
					});
			},
			onCancel() {},
		});
	};

	const handleUpdateActivity = (data, item) => {
		updateActivityApi(item.id, {
			...item,
			...data,
			lastUpdate: new Date().getTime(),
			nameSearch: nonAccentVietnamese(data.name || item.name).split(/\s+/),
		})
			.then(() => {
				message.success('Cập nhật thành công');
				setActivities((prevActivity) =>
					prevActivity.map((a) => (a.id === item.id ? { ...a, ...data } : a))
				);
				setShowModel(false);
				setLoadingForm(false);
			})
			.catch(() => {
				message.error('Cập nhật không thành công. Vui lòng thử lại');
			});
	};

	const handleSubmitModel = (data) => {
		if (chooseActivity.type === TYPE_ACTION.ADD) {
			const id = genId(20);
			addActivityApi(id, {
				...data,
				createAt: new Date().getTime(),
				lastUpdate: new Date().getTime(),
				nameSearch: nonAccentVietnamese(data.name).split(/\s+/),
			})
				.then(() => {
					message.success('Thêm thành công');
					setActivities((prevActivity) => [...prevActivity, { ...data, id }]);
					setChooseActivity(initChooseActivity);
					setShowModel(false);
				})
				.catch(() => {
					message.error('Thêm không thành công, vui lòng thử lại');
				});
			setLoadingForm(false);
		} else {
			handleUpdateActivity(data, chooseActivity.activity);
		}
	};

	const doGetAllRegisterActivity = (data) => {
		setLoading(true);
		filterValueRef.current = data;
		getAllRegisterActivityApi(data)
			.then(serializerDoc)
			.then((data) => {
				if (data.length) setActivities(data);
				else message.warning('Không có dữ liệu để tải');
			})
			.catch((error) => {
				console.error(error);
				message.error('Lỗi tải dữ liệu');
			})
			.finally(() => setLoading(false));
	};

	const changePage = (isNextPage) => {
		const data = {
			...filterValueRef.current,
			previous: undefined,
			next: undefined,
		};
		if (isNextPage) data.next = activities[activities.length - 1];
		else data.previous = activities[0];
		doGetAllRegisterActivity(data);
	};

	const columns = [
		{
			title: 'Trạng thái',
			dataIndex: 'active',
			key: 'active',
			width: 120,
			render: (text, record, index) => (
				<Switch
					checked={text}
					onChange={(value) =>
						handleUpdateActivity({ active: value }, record, index)
					}
					size="small"
				/>
			),
		},
		{
			title: 'Cấp hoạt động',
			dataIndex: 'level',
			key: 'level',
			width: 150,
			render: (text) => nameLevelActivity[text],
		},
		{
			title: 'Khoa',
			dataIndex: 'department',
			key: 'department',
			width: 200,
			render: (text) => nameDepartmentActivity[text],
		},
		{
			title: 'Tên chương trình',
			dataIndex: 'name',
			key: 'name',
		},
		{
			title: 'Tiêu chí',
			dataIndex: 'target',
			key: 'target',
			render: (text) => text.map((c) => nameTarget[c]).join(', '),
		},
		{
			title: 'Thời gian',
			dataIndex: 'date',
			key: 'date',
			width: 150,
		},
		{
			title: 'Địa điểm',
			dataIndex: 'location',
			key: 'location',
			ellipsis: true,
			width: 180,
		},
		{
			title: 'Số người',
			dataIndex: 'numPeople',
			key: 'numPeople',
			width: 100,
		},
		{
			title: 'Thao tác',
			key: 'action',
			width: 160,
			render: (text, record) => (
				<Space size="middle">
					<Button onClick={() => handleShowModelToEdit(record)}>Sửa</Button>
					<Button danger onClick={() => handleDeleteActivity(record)}>
						Xóa
					</Button>
				</Space>
			),
		},
	];

	const loadTable = () => (
		<TableCustom
			columns={columns}
			dataSource={activities}
			pagination={false}
			scroll={{ y: window.screen.height - 200 }}
			footer={() => (
				<div className={styles.itemCenter}>
					<Button onClick={() => changePage(false)}>Trang trước</Button>
					<Button onClick={() => changePage(true)}>Trang sau</Button>
				</div>
			)}
		/>
	);

	return (
		<Content className={styles.content}>
			<Card style={{ width: '100vw' }} size="small">
				<div className={styles.itemBetween}>
					<FilterActivity getData={doGetAllRegisterActivity} />
					<Button type="primary" onClick={handleShowModelToAddNew}>
						Thêm hoạt động
					</Button>
				</div>
			</Card>
			{!loading ? loadTable() : <Loading />}
			<Modal
				width={770}
				visible={showModel}
				title={'Tạo hoặc chỉnh sửa hoạt động'}
				centered={true}
				onCancel={() => setShowModel(false)}
				footer={null}
			>
				<FormActivity
					item={chooseActivity.activity}
					handleSubmit={handleSubmitModel}
					loading={loadingForm}
					setLoading={setLoadingForm}
				/>
			</Modal>
		</Content>
	);
}
