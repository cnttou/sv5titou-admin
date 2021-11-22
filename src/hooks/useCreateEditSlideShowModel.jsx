import { useState } from 'react';
import dayjs from 'dayjs';
import {
	Modal,
	Form,
	Input,
	Button,
	Select,
	InputNumber,
	message,
	Switch,
} from 'antd';
import DatePicker from '../components/DatePicker';
import { useEffect } from 'react';
import InputRichText from '../components/InputRichText';
import { useDispatch } from 'react-redux';
import { addActivityAction, addSlideShowAction } from '../store/actions';
import InputUpload from '../components/InputUpload';
import { taskEvent, upFileApi } from '../api/firebaseStorage';

const layout = {
	labelCol: { span: 5 },
	wrapperCol: { span: 19 },
};
const tailLayout = {
	wrapperCol: { span: 24 },
};

const initActivity = {
	title: '',
	deadline: null,
	link: '',
	image: null,
	description: '',
};

const initInputUpload = {
	onUploadSuccess: true,
	onUploadStart: false,
	onUploadError: null,
	uploadProgress: 0,
};

function useCreateEditSlideShowModel({ title, action }) {
	const [visible, setVisible] = useState(false);
	const [dataModel, setDataModel] = useState(initActivity);
	const [inputUpload, setInputUpload] = useState(initInputUpload);

	const dispatch = useDispatch();
	const [form] = Form.useForm();

	useEffect(() => {
		if (dataModel.deadline) {
			let deadline = dayjs.unix(dataModel.deadline);
			form.setFieldsValue({ ...dataModel, deadline });
		} else form.setFieldsValue({ ...dataModel });
	}, [dataModel]);

	const setState = (name, value) => {
		setInputUpload((s) => ({ ...s, [name]: value }));
	};

	const handleBeforeUpload = (file) => {
		const isLt5M = file.size / 1024 / 1024 < 4;
		if (!isLt5M) {
			message.error('Ảnh phải nhỏ hơn 4MB!');
		}
		return isLt5M;
	};
	const handleUpload = (data) => {
		const task = upFileApi(dataModel.id, data.file);
		task.on(
			taskEvent,
			(snapshot) => {
				const progress = Math.round(
					(100 * snapshot.bytesTransferred) / snapshot.totalBytes
				);
				data.file.percent = progress;
				setState('onUploadStart', true);
				setState('uploadProgress', progress);
			},
			(error) => {
				data.file.status = 'error';
				message.error('Có lỗi xảy ra vui lòng thử lại');
				setState('onUploadError', error);
				setState('onUploadSuccess', false);
			},
			() => {
				data.file.status = 'success';
				setState('onUploadSuccess', true);
				setState('onUploadStart', false);
			}
		);
		task.then((snapshot) => {
			message.success('Tải lên hoàn tất!!');
			data.file.status = 'done';
			snapshot.ref.getDownloadURL().then((url) => {
				form.setFieldsValue({
					image: url,
				});
				setDataModel((preState) => ({ ...preState, image: url }));
			});
		});
	};

	const onFinish = () => {
		const data = Object.assign(form.getFieldsValue());

		if (form.getFieldsValue().deadline)
			data.deadline = dayjs(form.getFieldsValue().deadline).unix();
		else data.deadline = 2556032400; //2556032400 is a year 2050

		console.log(data);

		dispatch(addSlideShowAction({ data, docId: dataModel.id }))
			.then(() => {
				setVisible(false);
			})
			.catch((err) => {
				message.error('Thêm thất bại, vui lòng thử lại.');
				console.log(err.message);
			});
	};

	const ui = () => (
		<Modal
			width={770}
			visible={visible}
			title={title || 'Chi tiết'}
			footer={action || null}
			centered={true}
			onCancel={() => setVisible(false)}
		>
			<Form
				{...layout}
				form={form}
				name="addSlideShow"
				onFinish={onFinish}
				validateMessages={{ required: 'Vui lòng điền thông tin' }}
			>
				<Form.Item
					name="title"
					label="Tên tiêu đề"
					rules={[{ required: false }]}
				>
					<Input placeholder="Nhập tên tiêu đề" />
				</Form.Item>
				<Form.Item
					name="deadline"
					label="Thời gian kết thúc"
					rules={[{ required: false }]}
				>
					<DatePicker
						format="DD-MM-YYYY"
						style={{ width: '100%' }}
						onChange={(value, dateStr) => {
							form.setFieldsValue({
								deadline: dayjs(dateStr, 'DD-MM-YYYY'),
							});
						}}
					/>
				</Form.Item>
				<Form.Item
					label="Hình ảnh"
					name="image"
					rules={[{ required: true }]}
				>
					<Input
						name="image"
						placeholder="URL hình ảnh"
						addonAfter={
							<InputUpload
								inputUpload={inputUpload}
								name={'imageUpload'}
								handleUpload={handleUpload}
								handleBeforeUpload={handleBeforeUpload}
							/>
						}
					/>
				</Form.Item>
				<Form.Item
					label="Nội dung"
					name="description"
					rules={[{ required: false }]}
				>
					<Input placeholder="Nhập nội dung" />
				</Form.Item>
				<Form.Item
					{...tailLayout}
					style={{
						display: 'flex',
						justifyContent: 'center',
						marginBottom: 0,
					}}
				>
					<Button type="primary" block htmlType="submit">
						GỬI
					</Button>
				</Form.Item>
			</Form>
		</Modal>
	);
	return {
		ui,
		visible,
		setVisible,
		dataModel,
		setDataModel,
	};
}

export default useCreateEditSlideShowModel;
