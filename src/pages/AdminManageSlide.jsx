import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { deleteSlideShowAction, fetchSlideShowAction } from '../store/actions';
import Loading from '../components/Loading';
import { Space, Button, Layout, Modal } from 'antd';
import styles from '../styles/Admin.module.css';
import TableCustom from '../components/TableCustom';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import useCreateEditSlideShowModel from '../hooks/useCreateEditSlideShowModel';
import dayjs from 'dayjs';
import { uid as genId } from 'uid';

const { Content } = Layout;
const { confirm } = Modal;

const initActivity = {
	id: genId(20),
	title: '',
	deadline: null,
	link: '',
	image: null,
	description: '',
};

export default function AdminManageSlide() {
	const { value: listSlideShow, loading } = useSelector(
		(state) => state.slideShow
	);

	const dispatch = useDispatch();

	useEffect(() => {
		if (listSlideShow.length === 0) {
			dispatch(fetchSlideShowAction());
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
				return dispatch(deleteSlideShowAction(item.id));
			},
			onCancel() {},
		});
	};

	const { ui, setVisible, setDataModel } = useCreateEditSlideShowModel({
		title: 'Tạo hoặc chỉnh sửa hoạt động',
	});
	const columns = [
		{
			title: 'Tiêu đề',
			dataIndex: 'title',
			key: 'title',
			searchFilter: true,
		},
		{
			title: 'Thời hạn',
			dataIndex: 'deadline',
			key: 'deadline',
			render: (text) => dayjs.unix(text).format('DD-MM-YYYY'),
		},
		{
			title: 'Hình ảnh',
			dataIndex: 'image',
			key: 'image',
			render: (text) => <img width={50} src={text} alt={text} />,
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
			dataSource={listSlideShow}
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
			{loading === 0 ? loadTable() : <Loading />}
			{ui()}
		</Content>
	);
}
