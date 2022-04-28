import { FilterOutlined, ReloadOutlined } from '@ant-design/icons';
import { Button, Form, Select } from 'antd';
import { Option } from 'antd/lib/mentions';
// import dayjs from 'dayjs';
import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
	nameDepartmentActivity,
	nameLevelActivity,
	nameOtherBy,
	nameTarget,
	nameTypeActivity,
	nameTypeSort,
} from '../config';
import { getFilter, saveFilter } from '../utils/common';
// import DatePicker from './DatePicker';

const formLayout = {
	labelCol: { span: 1 },
	wrapperCol: { span: 1 },
};

const FilterActivity = (props) => {
	const [form] = Form.useForm();
	const location = useLocation();
	const rules = [{ required: true, message: 'Bạn phải lọc theo trường này' }];

	const onFinish = (fieldsValue) => {
		let { date, target } = fieldsValue;
		date = date ? date.format('DD-MM-YYYY') : undefined;
		target = target?.length ? target : undefined;
		saveFilter({ ...fieldsValue, date, target }, location.pathname);
		props.getData &&
			props.getData({
				...fieldsValue,
				date,
				target,
				next: undefined,
				previous: undefined,
			});
	};

	const renderSelect = (object = {}) => {
		return Object.entries(object).map((c) => (
			<Option key={c[0]} value={c[0]}>
				{c[1]}
			</Option>
		));
	};

	useEffect(() => {
		const data = {
			orderBy: 'lastUpdate',
			sort: 'asc',
			active: undefined,
			typeActivity: undefined,
			// date: undefined,
			department: undefined,
			level: undefined,
			target: undefined,
		};
		// let date = null;
		if (!getFilter(data, location.pathname)) return;
		data.target = data.target ? data.target.split(',') : undefined;
		// if (data.date) date = dayjs(data.date, 'DD-MM-YYYY');
		form.setFieldsValue({ ...data });
		props.getData && props.getData(data);
	}, []);

	return (
		<Form {...formLayout} layout="inline" form={form} onFinish={onFinish}>
			<Form.Item name="active" rules={rules} initialValue={'true'}>
				<Select placeholder="Trạng thái hoạt động" style={{ minWidth: 170 }}>
					<Option key={'true'}>Hoạt động đang hiện</Option>
					<Option key={'false'}>Hoạt động đã ẩn</Option>
				</Select>
			</Form.Item>
			<Form.Item name="typeActivity" rules={rules} initialValue={'register'}>
				<Select placeholder="Loại hoạt động" style={{ minWidth: 160 }}>
					{renderSelect(nameTypeActivity)}
				</Select>
			</Form.Item>

			<Form.Item></Form.Item>
			<Form.Item
				noStyle
				shouldUpdate={(prev, curr) => prev.typeActivity !== curr.typeActivity}
			>
				{({ getFieldValue }) =>
					!['require', 'other'].includes(getFieldValue('typeActivity')) ? (
						<Form.Item name="level">
							<Select
								placeholder="Hoạt động cấp"
								style={{ minWidth: 140 }}
								allowClear
							>
								{renderSelect(nameLevelActivity)}
							</Select>
						</Form.Item>
					) : null
				}
			</Form.Item>
			<Form.Item
				noStyle
				shouldUpdate={(prev, curr) =>
					prev.typeActivity !== curr.typeActivity || prev.level !== curr.level
				}
			>
				{({ getFieldValue }) =>
					!['require', 'other'].includes(getFieldValue('typeActivity')) &&
					!['truong', 'tp', 'qg'].includes(getFieldValue('level')) ? (
						<Form.Item name="department">
							<Select
								placeholder="Lọc theo khoa"
								style={{ minWidth: 200 }}
								allowClear
							>
								{renderSelect(nameDepartmentActivity)}
							</Select>
						</Form.Item>
					) : null
				}
			</Form.Item>
			<Form.Item name="target">
				<Select
					maxTagCount="responsive"
					mode="tags"
					placeholder="Lọc tiêu chí hoạt động"
					style={{ minWidth: 200 }}
				>
					{renderSelect(nameTarget)}
				</Select>
			</Form.Item>
			{/* <Form.Item
				shouldUpdate={(prev, curr) => prev.typeActivity !== curr.typeActivity}
			>
				{({ getFieldValue }) =>
					!['require', 'other'].includes(getFieldValue('typeActivity')) ? (
						<Form.Item name="date">
							<DatePicker format="DD-MM-YYYY" />
						</Form.Item>
					) : null
				}
			</Form.Item> */}
			<Form.Item name="orderBy" initialValue={'lastUpdate'}>
				<Select placeholder="Xắp xếp theo" style={{ minWidth: 120 }}>
					{renderSelect(nameOtherBy)}
				</Select>
			</Form.Item>
			<Form.Item name="sort" initialValue={'desc'} noStyle>
				<Select placeholder="Loại sắp xếp" style={{ minWidth: 100 }}>
					{renderSelect(nameTypeSort)}
				</Select>
			</Form.Item>
			<Form.Item></Form.Item>
			<Form.Item wrapperCol={{ span: 14, offset: 4 }}>
				<Button icon={<FilterOutlined />} htmlType="submit">
					Lọc
				</Button>
			</Form.Item>
			<Form.Item>
				<Button
					type="primary"
					icon={<ReloadOutlined />}
					onClick={() => {
						form.resetFields();
					}}
				>
					Đặt lại
				</Button>
			</Form.Item>
		</Form>
	);
};

FilterActivity.propTypes = {
	getData: PropTypes.func,
};

export default FilterActivity;
