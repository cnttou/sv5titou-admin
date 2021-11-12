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
import { addActivityAction } from '../store/actions';
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

const initActivity = {
	active: true,
	name: '',
    typeActivity: null,
	summary: '',
	target: [],
};

export const optionLevel = Object.entries(nameLevelActivity).map((c) => (
	<Option key={c[0]}>{c[1]}</Option>
));

export const optionTarget = Object.entries(nameTarget).map((c, index) => (
	<Option key={index} value={c[0]}>
		{c[1]}
	</Option>
));
export const optionTypeActivity = Object.entries(nameTypeActivity).map((c, index) => (
	<Option key={index} value={c[0]} disabled={c[0] === 'register'}>
		{c[1]}
	</Option>
));

export const optionDepartment = Object.entries(nameDepartmentActivity).map(
	(c, index) => (
		<Option key={index} value={c[0]}>
			{c[1]}
		</Option>
	)
);

function useCreateEditOtherActivityModel({ title, action }) {
	const [visible, setVisible] = useState(false);
	const [dataModel, setDataModel] = useState(initActivity);
	const [active, setActive] = useState(true);

	const dispatch = useDispatch();

	const [form] = Form.useForm();

	useEffect(() => {
		let date = null;
		if (dataModel.date) date = dayjs(dataModel.date, 'DD-MM-YYYY');

		form.setFieldsValue({ ...dataModel, date });
		setActive(dataModel.active);
	}, [dataModel]);

	const onFinish = () => {
		const data = Object.assign(form.getFieldsValue());
		let date = dayjs(form.getFieldsValue().date).format('DD-MM-YYYY');
		data.date = date;
		let docId = dataModel.id || null;
		console.log(data);

		dispatch(addActivityAction({ data, docId }))
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
					name="level"
					label="Hoạt động cấp"
					rules={[{ required: true }]}
				>
					<Select placeholder="Cấp của hoạt động">
						{optionLevel}
					</Select>
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

export default useCreateEditOtherActivityModel;
