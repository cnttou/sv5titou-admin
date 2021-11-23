import { useState } from 'react';
import dayjs from 'dayjs';
import { Modal, Form, Input, Button, message } from 'antd';
import DatePicker from '../components/DatePicker';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addSlideShowAction } from '../store/actions';
import InputUpload from '../components/InputUpload';

const layout = {
	labelCol: { span: 5 },
	wrapperCol: { span: 19 },
};
const tailLayout = {
	wrapperCol: { span: 24 },
};

const initActivity = {
    id: 0,
	deadline: null,
	url: '',
	image: null,
};

function useCreateEditSlideShowModel({ title, action }) {
	const [visible, setVisible] = useState(false);
	const [dataModel, setDataModel] = useState(initActivity);
	const [loading, setLoading] = useState(false);

	const dispatch = useDispatch();
	const [form] = Form.useForm();

	useEffect(() => {
		if (dataModel.deadline) {
			let deadline = dayjs.unix(dataModel.deadline);
			form.setFieldsValue({ ...dataModel, deadline });
		} else form.setFieldsValue({ ...dataModel });
	}, [dataModel]);

	const handleUpload = (url) => {
		form.setFieldsValue({
			image: url,
		});
		setDataModel((preState) => ({ ...preState, image: url }));
	};

	const onFinish = () => {
        setLoading(true)
		const data = Object.assign(form.getFieldsValue());

		if (form.getFieldsValue().deadline)
			data.deadline = dayjs(form.getFieldsValue().deadline).unix();
		else data.deadline = 2556032400; //2556032400 is a year 2050

		console.log(data);

		dispatch(addSlideShowAction({ data, docId: dataModel.id }))
			.then(() => {
				setVisible(false);
                setLoading(false)
			})
			.catch((err) => {
                setLoading(false);
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
					name="url"
					label="Link truy cập"
					rules={[{ required: false }]}
				>
					<Input placeholder="Nhập đường dẫn vd: https://ou.edu.vn/" />
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
								name={'imageUpload'}
								handleUpload={handleUpload}
								id={dataModel.id || ''}
							/>
						}
					/>
				</Form.Item>
				<Form.Item
					{...tailLayout}
					style={{
						display: 'flex',
						justifyContent: 'center',
						marginBottom: 0,
					}}
				>
					<Button
						type="primary"
						block
						htmlType="submit"
						loading={loading}
					>
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
