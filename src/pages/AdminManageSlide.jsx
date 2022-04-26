import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { deleteSlideShowAction, fetchSlideShowAction } from '../store/actions';
import Loading from '../components/Loading';
import { Space, Button, Layout, Modal, Typography, Image, Alert, Table } from 'antd';
import styles from '../styles/Admin.module.css';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import useCreateEditSlideShowModel from '../hooks/useCreateEditSlideShowModel';
import dayjs from 'dayjs';
import { uid as genId } from 'uid';

const { Content } = Layout;
const { confirm } = Modal;

const initActivity = {
	id: genId(20),
	deadline: null,
	url: '',
	image: null,
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
		confirm({
			title: 'Bạn có chắc muốn xóa thông báo?',
			icon: <ExclamationCircleOutlined />,
			content: item.name,
			onOk() {
				return dispatch(deleteSlideShowAction(item.id));
			},
			onCancel() {},
		});
	};

	const { ui, setVisible, setDataModel } = useCreateEditSlideShowModel({
		title: 'Tạo hoặc chỉnh sửa thông báo',
	});
	const columns = [
		{
			title: 'Link truy cập',
			dataIndex: 'url',
			key: 'url',
			render: (text) => (
				<Typography.Paragraph ellipsis={{ rows: 2, expandable: false }}>
					{text}
				</Typography.Paragraph>
			),
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
			render: (text) => (
				<Image
					height={80}
					width={130}
					style={{ objectFit: 'cover' }}
					alt={text}
					src={text}
				/>
			),
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
		<Table
			columns={columns}
			dataSource={listSlideShow}
			pagination={false}
			scroll={{ y: 'calc(100vh - 200px)' }}
			footer={() => (
				<Button type="primary" block onClick={handleShowModelToAddNew}>
					Thêm thông báo
				</Button>
			)}
		/>
	);
	return (
		<Content className={styles.content}>
			<Alert message="Vui lòng tải ảnh lên theo tỉ lệ 4:3 và không copy link ảnh từ Facebook" type="warning" />
			{loading === 0 ? loadTable() : <Loading />}
			{ui()}
		</Content>
	);
}
