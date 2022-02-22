import { useEffect, useState } from 'react';
import Loading from '../components/Loading';
import { Space, Button, Layout, Switch, Modal, message } from 'antd';
import { compareStringDate, compareStringName } from '../utils/compareFunction';
import styles from '../styles/Admin.module.css';
import TableCustom from '../components/TableCustom';
import {
	nameTarget,
	nameDepartmentActivity,
	nameLevelActivity,
} from '../config';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import {
	addActivityApi,
	deleteActivityApi,
	getAllRegisterActivityApi,
	serializerDoc,
	updateActivityApi,
} from '../api/firestore';
import FormActivity from '../forms/FormActivity';
import { uid as genId } from 'uid';

const { Content } = Layout;
const { confirm } = Modal;

const initActivity = {
	image: '',
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
export default function AdminManageNews() {
	const [listActivity, setListActivity] = useState([]);
	const [showModel, setShowModel] = useState(false);
	const [loadingForm, setLoadingForm] = useState(false);
	const [chooseActivity, setChooseActivity] = useState(initChooseActivity);

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
						setListActivity((prevActivity) =>
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
		updateActivityApi(item.id, { ...item, ...data })
			.then(() => {
				message.success('Cập nhật thành công');
				setListActivity((prevActivity) =>
					prevActivity.map((a) =>
						a.id === item.id ? { ...a, ...data } : a
					)
				);
				setShowModel(false);
				setLoadingForm(false);
			})
			.catch((err) => {
				message.error('Cập nhật không thành công. Vui lòng thử lại');
			});
	};

	const handleSubmitModel = (data) => {
		if (chooseActivity.type === TYPE_ACTION.ADD) {
			const id = genId(20);
			addActivityApi(id, {...data, createAt: new Date().getTime()})
				.then(() => {
					message.success('Thêm thành công');
					setListActivity((prevActivity) => [
						...prevActivity,
						{ ...data, id },
					]);
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
	const columns = [
		{
			title: 'Trạng thái',
			dataIndex: 'active',
			key: 'active',
			width: 120,
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
			onFilter: (value, record) => record.active.toString() === value,
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
			filters: Object.entries(nameLevelActivity).map((c) => ({
				value: c[0],
				text: c[1],
			})),
			onFilter: (value, record) => record.level === value,
			render: (text) => nameLevelActivity[text],
		},
		{
			title: 'Khoa',
			dataIndex: 'department',
			key: 'department',
			width: 200,
			filters: Object.entries(nameDepartmentActivity).map((c) => ({
				value: c[0],
				text: c[1],
			})),
			onFilter: (value, record) => record.department === value,
			render: (text) => nameDepartmentActivity[text],
		},
		{
			title: 'Tên chương trình',
			dataIndex: 'name',
			key: 'name',
			searchFilter: true,
			sorter: (a, b) => compareStringName(a.name, b.name),
		},
		{
			title: 'Tiêu chí',
			dataIndex: 'target',
			key: 'target',
			filters: Object.entries(nameTarget).map((c) => ({
				value: c[0],
				text: c[1],
			})),
			onFilter: (value, record) => record.target.includes(value),
			render: (text) => text.map((c) => nameTarget[c]).join(', '),
		},
		{
			title: 'Thời gian',
			dataIndex: 'date',
			key: 'date',
			width: 150,
			dateBeweenFilter: true,
			defaultSortOrder: 'descend',
			sorter: (a, b) => compareStringDate(a, b),
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
					<Button onClick={() => handleShowModelToEdit(record)}>
						Sửa
					</Button>
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
			dataSource={listActivity}
			pagination={false}
			scroll={{ y: window.screen.height - 200 }}
			footer={() => (
				<Button type="primary" block onClick={handleShowModelToAddNew}>
					Thêm hoạt động
				</Button>
			)}
		/>
	);

	useEffect(() => {
		getAllRegisterActivityApi()
			.then(serializerDoc)
			.then((data) => {
				setListActivity(data);
			});
	}, []);

	return (
		<Content className={styles.content}>
			{listActivity?.length ? loadTable() : <Loading />}
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
