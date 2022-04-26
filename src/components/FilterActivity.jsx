import { FilterOutlined, ReloadOutlined } from '@ant-design/icons';
import { Button, Form, Select, Space } from 'antd';
import { Option } from 'antd/lib/mentions';
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
import DatePicker from './DatePicker';

const FilterActivity = (props) => {
	const [form] = Form.useForm();
	const location = useLocation();

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
			orderBy: undefined,
			sort: undefined,
			active: undefined,
			typeActivity: undefined,
			date: undefined,
			department: undefined,
			level: undefined,
			target: undefined,
		};
		if (!getFilter(data, location.pathname)) return;
		data.target = data.target ? data.target.split(',') : undefined;
		form.setFieldsValue({ ...data });
		props.getData && props.getData(data);
	}, []);

	return (
		<Form form={form} onFinish={onFinish}>
			<Space wrap>
				<Form.Item noStyle name="active">
					<Select
						placeholder="Trạng thái hoạt động"
						style={{ minWidth: 200 }}
						allowClear
					>
						<Option key={'true'}>Hoạt động đang hiện</Option>
						<Option key={'false'}>Hoạt động đã ẩn</Option>
					</Select>
				</Form.Item>
				<Form.Item noStyle name="typeActivity">
					<Select
						placeholder="Loại hoạt động"
						style={{ minWidth: 200 }}
						allowClear
					>
						{renderSelect(nameTypeActivity)}
					</Select>
				</Form.Item>
				<Form.Item noStyle name="level">
					<Select
						placeholder="Hoạt động cấp"
						style={{ minWidth: 200 }}
						allowClear
					>
						{renderSelect(nameLevelActivity)}
					</Select>
				</Form.Item>
				<Form.Item noStyle name="department">
					<Select
						placeholder="Lọc theo khoa"
						style={{ minWidth: 200 }}
						allowClear
					>
						{renderSelect(nameDepartmentActivity)}
					</Select>
				</Form.Item>
				<Form.Item noStyle name="target">
					<Select
						maxTagCount="responsive"
						mode="tags"
						placeholder="Lọc tiêu chí hoạt động"
						style={{ minWidth: 200 }}
					>
						{renderSelect(nameTarget)}
					</Select>
				</Form.Item>
				<Form.Item noStyle name="date">
					<DatePicker format="DD-MM-YYYY" />
				</Form.Item>
				<Form.Item noStyle name="orderBy">
					<Select
						placeholder="Xắp xếp theo"
						style={{ minWidth: 100 }}
						defaultValue="createAt"
					>
						{renderSelect(nameOtherBy)}
					</Select>
				</Form.Item>
				<Form.Item noStyle name="sort">
					<Select
						placeholder="Loại sắp xếp"
						style={{ minWidth: 100 }}
						defaultValue="desc"
					>
						{renderSelect(nameTypeSort)}
					</Select>
				</Form.Item>
				<Form.Item noStyle>
					<Button icon={<FilterOutlined />} htmlType="submit">
						Lọc
					</Button>
				</Form.Item>
				<Form.Item noStyle>
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
			</Space>
		</Form>
	);
};

FilterActivity.propTypes = {
	getData: PropTypes.func,
};

export default FilterActivity;
