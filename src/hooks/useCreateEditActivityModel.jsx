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
import { createOrUpdateActivityAction } from '../store/actions';
import {
	nameDepartmentActivity,
	nameLevelActivity,
	nameTarget,
} from '../config';
import InputUpload from '../components/InputUpload';
import { uid as uuid } from 'uid';

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
	image: '',
	date: null,
	location: '',
	summary: '',
	numPeople: null,
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

export const optionDepartment = Object.entries(nameDepartmentActivity).map(
	(c, index) => (
		<Option key={index} value={c[0]}>
			{c[1]}
		</Option>
	)
);

function useCreateEditActivityModel({ title, action }) {
	const [visible, setVisible] = useState(false);
	const [dataModel, setDataModel] = useState(initActivity);
	const [active, setActive] = useState(true);
	const [loading, setLoading] = useState(false);

	const dispatch = useDispatch();

	const [form] = Form.useForm();

	useEffect(() => {
		let date = null;
		if (dataModel.date) date = dayjs(dataModel.date, 'DD-MM-YYYY');

		form.setFieldsValue({ ...dataModel, date });
		setActive(dataModel.active);
	}, [dataModel]);

	const onFinish = () => {
		setLoading(true);
		const data = Object.assign(form.getFieldsValue());
		let date = dayjs(form.getFieldsValue().date).format('DD-MM-YYYY');
		data.date = date;
		data.typeActivity = 'register';
		let docId = dataModel.id || null;
		console.log(data);

		dispatch(createOrUpdateActivityAction({ data, docId }))
			.then(() => {
				setVisible(false);
				setLoading(false);
			})
			.catch((err) => {
				setLoading(false);
				message.error('Thêm thất bại, vui lòng thử lại.');
				console.log(err.message);
			});
	};
	const handleUpload = (url) => {
		form.setFieldsValue({ image: url });
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
