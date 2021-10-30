import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
	addActivityAction,
	deleteActivityAction,
	fetchAllActivityAction,
} from '../store/actions';
import Loading from '../components/Loading';
import { Space, Button, Layout, Switch } from 'antd';
import { compareStringDate, compareStringName } from '../utils/compareFunction';
import useCreateEditActivityModel from '../hooks/useCreateEditActivityModel';
import styles from '../styles/Admin.module.css';
import TableCustom from '../components/TableCustom';
import 'antd/lib/dropdown/style/index.css';
import { nameTarget } from '../config';

const { Content } = Layout;

const initActivity = {
	active: true,
	department: null,
	level: null,
	name: '',
	date: null,
	location: '',
	summary: '',
	numPeople: null,
	target: null,
};

export default function AdminManageNews() {
	const listNews = useSelector((state) => state.activity.value);

	const dispatch = useDispatch();

	useEffect(() => {
		if (listNews.length === 0) {
			dispatch(fetchAllActivityAction(50));
		}
	}, []);

	const handleShowModelToEdit = (item) => {
		console.log(item);
		setDataModel(item);
		setVisible(true);
	};

	const handleShowModelToAddNew = () => {
		setDataModel({ ...initActivity });
		setVisible(true);
	};

	const handleDelete = (item) => {
		console.log('clicked delete activity', item);
		dispatch(deleteActivityAction(item.id));
	};

	const { ui, visible, setVisible, setDataModel } =
		useCreateEditActivityModel({
			title: 'Tạo hoặc chỉnh sửa hoạt động',
		});

	const handleSwitchActive = (value, data, index) => {
        // console.log('log ', value, data, index);
		dispatch(addActivityAction({ data: {...data, active: value}, docId: data.id }))
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
					onChange={(value)=>handleSwitchActive(value, record, index)}
					size="small"
				/>
			),
		},
		{
			title: 'Tên',
			dataIndex: 'name',
			key: 'name',
			searchFilter: true,
			sorter: (a, b) => compareStringName(a.name, b.name),
			render: (text) => <a>{text}</a>,
		},
		{
			title: 'Tiêu chí',
			dataIndex: 'target',
			key: 'target',
			filters: [
				{
					text: 'Hội nhập tốt',
					value: 'hoi-nhap',
				},
				{
					text: 'Đạo đức tốt',
					value: 'dao-duc',
				},
				{
					text: 'Học tập tốt',
					value: 'hoc-tap',
				},
				{
					text: 'Tình nguyện tốt',
					value: 'tinh-nguyen',
				},
				{
					text: 'Thể lực tốt',
					value: 'suc-khoe',
				},
			],
			onFilter: (value, record) => record.target === value,
			render: (text) => nameTarget[text],
		},
		{
			title: 'Thời gian',
			dataIndex: 'date',
			key: 'date',
			dateBeweenFilter: true,
			defaultSortOrder: 'descend',
			sorter: (a, b) => compareStringDate(a, b),
		},
		{
			title: 'Địa điểm',
			dataIndex: 'location',
			key: 'location',
		},
		{
			title: 'Số người',
			dataIndex: 'numPeople',
			key: 'numPeople',
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
			{visible === true ? ui() : null}
		</Content>
	);
}