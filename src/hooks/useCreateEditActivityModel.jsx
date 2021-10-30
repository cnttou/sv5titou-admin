import { useState } from 'react';
import moment from 'moment';
import {
	Modal,
	Form,
	Input,
	Button,
	Select,
	InputNumber,
	DatePicker,
	message,
	Switch,
} from 'antd';
import { useEffect } from 'react';
import InputRichText from '../components/InputRichText';
import { useDispatch } from 'react-redux';
import { addActivityAction } from '../store/actions';
import { nameDepartmentActivity, nameLevelActivity, nameTarget } from '../config';

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
	department: null,
	level: null,
	name: '',
	date: null,
	location: '',
	summary: '',
	numPeople: null,
	target: null,
};

export const optionLevel = Object.entries(nameLevelActivity).map((c) => (
	<Option key={c[0]}>{c[1]}</Option>
));

export const optionTarget = Object.entries(nameTarget).map((c, index) => (
	<Option key={index} value={c[0]}>
		{c[1]}
	</Option>
));

export const optionDepartment = Object.entries(nameDepartmentActivity).map((c, index) => (
	<Option key={index} value={c[0]}>
		{c[1]}
	</Option>
));

function useCreateEditActivityModel({ title, action }) {
	const [visible, setVisible] = useState(false);
	const [dataModel, setDataModel] = useState(initActivity);
	const [active, setActive] = useState(true);

	const dispatch = useDispatch();

	const [form] = Form.useForm();

	useEffect(() => {
		let date = null;
		if (dataModel.date) date = moment(dataModel.date, 'DD-MM-YYYY');

		form.setFieldsValue({ ...dataModel, date });
		setActive(dataModel.active);
	}, [dataModel]);

	const onFinish = () => {
		const data = Object.assign(form.getFieldsValue());
		let date = moment(form.getFieldsValue().date).format('DD-MM-YYYY');
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
				// initialValues={initActivity}
				{...layout}
				form={form}
				name="addActivity"
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
					name="department"
					label="Khoa"
					rules={[{ required: true }]}
				>
					<Select
						placeholder="Chọn khoa"
						// onChange={(value) =>
						// 	form.setFieldsValue({ department: value })
						// }
						allowClear
					>
						{optionDepartment}
					</Select>
				</Form.Item>
				<Form.Item
					name="level"
					label="Hoạt động cấp"
					rules={[{ required: true }]}
				>
					<Select
						placeholder="Cấp của hoạt động"
						// style={{ width: '100%' }}
					>
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
					name="target"
					label="Tiêu chí"
					rules={[{ required: true }]}
				>
					<Select
						placeholder="Nhập tiêu chí xét SV5T"
						// onChange={(value) =>
						// 	form.setFieldsValue({ target: value })
						// }
					>
						{optionTarget}
					</Select>
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
								date: moment(dateStr, 'DD-MM-YYYY'),
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

export default useCreateEditActivityModel;
