import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
	createOrUpdateActivityAction,
	deleteActivityAction,
	getAllDataAction,
} from '../store/actions';
import Loading from '../components/Loading';
import { Space, Button, Layout, Switch, Modal } from 'antd';
import { compareStringName } from '../utils/compareFunction';
import styles from '../styles/Admin.module.css';
import TableCustom from '../components/TableCustom';
import { nameTarget, nameTypeActivity } from '../config';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import useCreateEditOtherActivityModel from '../hooks/useCreateEditOtherActivityModel';

const { Content } = Layout;
const { confirm } = Modal;

const initActivity = {
	active: true,
	name: '',
	typeActivity: null,
	summary: '',
	target: [],
};

export default function AdminManageOtherActivity() {
	const listNews = useSelector((state) =>
		state.activity.value.filter((c) => c.typeActivity !== 'register')
	);

	const dispatch = useDispatch();

	useEffect(() => {
		if (listNews.length === 0) {
			dispatch(getAllDataAction());
		}
	}, []);

	const handleShowModelToEdit = (item) => {
		setDataModel(item);
		setVisible(true);
	};

	const handleShowModelToAddNew = () => {
		setDataModel({ ...initActivity });
		setVisible(true);
	};

	const handleDelete = (item) => {
		console.log('clicked delete activity', item);
		confirm({
			title: 'Bạn có chắc muốn xóa hoạt động?',
			icon: <ExclamationCircleOutlined />,
			content: item.name,
			onOk() {
				return dispatch(deleteActivityAction(item.id));
			},
			onCancel() {},
		});
	};

	const { ui, setVisible, setDataModel } = useCreateEditOtherActivityModel({
		title: 'Tạo hoặc chỉnh sửa hoạt động',
	});

	const handleSwitchActive = (value, data, index) => {
		// console.log('log ', value, data, index);
		dispatch(
			createOrUpdateActivityAction({
				data: { ...data, active: value },
				docId: data.id,
			})
		)
			.then(() => {
				setVisible(false);
			})
			.catch((err) => {
				message.error('Hành động không thành công. Vui lòng thử lại');
				console.log(err.message);
			});
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
			onFilter: (value, record) => record.active.toString() === value,
			render: (text, record, index) => (
				<Switch
					checked={text}
					onChange={(value) =>
						handleSwitchActive(value, record, index)
					}
					size="small"
				/>
			),
		},
		{
			title: 'Loại tiêu chuẩn',
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
			title: 'Thao tác',
			key: 'action',
			render: (text, record) => (
				<Space size="middle">
					<Button onClick={() => handleShowModelToEdit(record)}>
						Sửa
					</Button>
					<Button danger onClick={() => handleDelete(record)}>
						Xóa
					</Button>
				</Space>
			),
		},
	];

	const loadTable = () => (
		<TableCustom
			columns={columns}
			dataSource={listNews}
			pagination={false}
			scroll={{ y: 'calc(100vh - 200px)' }}
			footer={() => (
				<Button type="primary" block onClick={handleShowModelToAddNew}>
					Thêm hoạt động
				</Button>
			)}
		/>
	);
	return (
		<Content className={styles.content}>
			{listNews?.length ? loadTable() : <Loading />}
			{ui()}
		</Content>
	);
}
