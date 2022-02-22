import {
	Form,
	Input,
	Button,
	Select,
	Switch,
} from 'antd';
import { useState } from 'react';
import dayjs from 'dayjs';
import { useEffect } from 'react';
import InputRichText from '../components/InputRichText';
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

export const optionLevel = Object.entries(nameLevelActivity).map((c) => (
	<Option key={c[0]}>{c[1]}</Option>
));

export const optionTarget = Object.entries(nameTarget).map((c, index) => (
	<Option key={index} value={c[0]}>
		{c[1]}
	</Option>
));

export const optionTypeActivity = Object.entries(nameTypeActivity).map(
	(c, index) => (
		<Option key={index} value={c[0]} disabled={c[0] === 'register'}>
			{c[1]}
		</Option>
	)
);

export const optionDepartment = Object.entries(nameDepartmentActivity).map(
	(c, index) => (
		<Option key={index} value={c[0]}>
			{c[1]}
		</Option>
	)
);

const FormOtherActivity = (props) => {
    const { item, handleSubmit, loading, setLoading } = props;
	const [form] = Form.useForm();
    const [active, setActive] = useState(true);

    const onFinish = () => {
        setLoading(true);
		const data = Object.assign(form.getFieldsValue());
		let docId = item.id || null;
		handleSubmit(data);
	};

    useEffect(() => {
		let date = null;
		if (item.date) date = dayjs(item.date, 'DD-MM-YYYY');

		form.setFieldsValue({ ...item, date });
		setActive(item.active);
        setLoading(false);
	}, [item]);

	return (
		<>
			<Form
				{...layout}
				form={form}
				name="addOtherActivity"
				onFinish={onFinish}
				validateMessages={{ required: 'Vui lòng điền thông tin' }}
			>
				<Form.Item
					name="active"
					label="Kích hoạt"
					rules={[{ required: true }]}
				>
					<Switch checked={active} onChange={setActive} />
				</Form.Item>
				<Form.Item
					name="name"
					label="Tên chương trình"
					rules={[{ required: true }]}
				>
					<Input placeholder="Nhập tên chương trình" />
				</Form.Item>
				<Form.Item
					name="typeActivity"
					label="Loại tiêu chuẩn"
					rules={[{ required: true }]}
				>
					<Select placeholder="Chọn loại tiêu chí">
						{optionTypeActivity}
					</Select>
				</Form.Item>
				<Form.Item
					name="target"
					label="Tiêu chí"
					rules={[{ required: true }]}
				>
					<Select
						placeholder="Nhập tiêu chí xét SV5T"
						mode="multiple"
					>
						{optionTarget}
					</Select>
				</Form.Item>
				<Form.Item
					name="summary"
					label="Nội dung"
					rules={[{ required: true }]}
				>
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
		</>
	);
};

export default FormOtherActivity;