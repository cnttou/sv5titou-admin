import { Button, Form, Input, InputNumber, Select, Switch } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import DatePicker from '../components/DatePicker';
import InputRichText from '../components/InputRichText';
import InputUpload from '../components/InputUpload';
import {
	nameDepartmentActivity,
	nameLevelActivity,
	nameTarget,
	nameTypeActivity,
} from '../config';

const { Option } = Select;

const layout = {
	labelCol: { span: 5 },
	wrapperCol: { span: 19 },
};
const tailLayout = {
	wrapperCol: { span: 24 },
};

const TYPE_ACTIVITY = {
	register: 'register',
	require: 'require',
	other: 'other',
};

const FormActivity = (props) => {
	const { item, handleSubmit, loading, setLoading } = props;
	const [form] = Form.useForm();
	const [active, setActive] = useState(true);
	const [typeActivity, setTypeActivity] = useState(TYPE_ACTIVITY.register);

	useEffect(() => {
		let date = null;
		if (item.date) date = dayjs(item.date, 'DD-MM-YYYY');
		setTypeActivity(item.typeActivity);
		form.setFieldsValue({ ...item, date });
		item.active && setActive(item.active);
		setLoading(false);
	}, [item]);

	const onFinish = () => {
		setLoading(true);
		const data = Object.assign(form.getFieldsValue());
		data.date = dayjs(form.getFieldsValue().date).format('DD-MM-YYYY');
		data.typeActivity = typeActivity;
		data.id = item.id;
		handleSubmit(data);
	};
	const handleUpload = (url) => {
		form.setFieldsValue({ image: url });
	};

	const renderSelect = (object = {}) => {
		return Object.entries(object).map((c) => (
			<Option key={c[0]} value={c[0]}>
				{c[1]}
			</Option>
		));
	};

	return (
		<>
			<Form
				{...layout}
				form={form}
				name="addActivity"
				onFinish={onFinish}
				validateMessages={{ required: 'Vui lòng điền thông tin' }}
			>
				<Form.Item name="active" label="Kích hoạt" rules={[{ required: true }]}>
					<Switch checked={active} onChange={setActive} />
				</Form.Item>
				<Form.Item
					name="typeActivity"
					label="Loại hoạt động"
					rules={[{ required: true }]}
				>
					<Select
						disabled={!!item.name}
						placeholder="Loại của hoạt động"
						onChange={(value) => setTypeActivity(value)}
					>
						{renderSelect(nameTypeActivity)}
					</Select>
				</Form.Item>

				{typeActivity === TYPE_ACTIVITY.register && (
					<>
						<Form.Item
							name="level"
							label="Hoạt động cấp"
							rules={[{ required: true }]}
						>
							<Select placeholder="Cấp của hoạt động">
								{renderSelect(nameLevelActivity)}
							</Select>
						</Form.Item>
						<Form.Item
							noStyle
							shouldUpdate={(prevValues, currentValues) =>
								prevValues.level !== currentValues.level
							}
						>
							{({ getFieldValue }) =>
								['lop', 'khoa'].includes(getFieldValue('level')) ? (
									<Form.Item
										name="department"
										label="Khoa"
										rules={[{ required: true }]}
									>
										<Select placeholder="Chọn khoa">
											{renderSelect(nameDepartmentActivity)}
										</Select>
									</Form.Item>
								) : null
							}
						</Form.Item>
					</>
				)}
				<Form.Item
					name="name"
					label="Tên chương trình"
					rules={[{ required: true }]}
				>
					<Input placeholder="Nhập tên chương trình" />
				</Form.Item>
				<Form.Item name="target" label="Tiêu chí" rules={[{ required: true }]}>
					<Select
						placeholder="Nhập tiêu chí xét SV5T"
						mode="multiple"
						disabled={!!item.name}
					>
						{renderSelect(nameTarget)}
					</Select>
				</Form.Item>
				{typeActivity === TYPE_ACTIVITY.register && (
					<>
						<Form.Item
							label="Hình ảnh"
							name="image"
							rules={[{ required: false }]}
						>
							<Input
								name="image"
								placeholder="URL hình ảnh"
								addonAfter={
									<InputUpload
										id={item.id}
										name={'imageUpload'}
										handleUpload={handleUpload}
									/>
								}
							/>
						</Form.Item>
						<Form.Item
							name="date"
							label="Thời gian bắt đầu"
							rules={[{ required: true }]}
						>
							<DatePicker
								format="DD-MM-YYYY"
								style={{ width: '100%' }}
								onChange={(value, dateStr) => {
									form.setFieldsValue({
										date: dayjs(dateStr, 'DD-MM-YYYY'),
									});
								}}
							/>
						</Form.Item>
						<Form.Item
							name="location"
							label="Địa điểm"
							rules={[{ required: true }]}
						>
							<Input placeholder="Nhập địa điểm tổ chức" />
						</Form.Item>
						<Form.Item
							name="numPeople"
							label="Số người tối đa"
							rules={[{ required: false }]}
						>
							<InputNumber
								placeholder="Số người tham gia tối đa"
								style={{ width: '100%' }}
							/>
						</Form.Item>
					</>
				)}
				<Form.Item name="summary" label="Nội dung" rules={[{ required: true }]}>
					<InputRichText />
				</Form.Item>
				<Form.Item
					{...tailLayout}
					style={{
						display: 'flex',
						justifyContent: 'center',
						marginBottom: 0,
					}}
				>
					<Button type="primary" block htmlType="submit" loading={loading}>
						GỬI
					</Button>
				</Form.Item>
			</Form>
		</>
	);
};

export default FormActivity;
