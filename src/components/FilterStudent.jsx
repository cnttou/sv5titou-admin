import { FilterOutlined, ReloadOutlined } from '@ant-design/icons';
import { Button, Form, Input, Select, Space } from 'antd';
import Search from 'antd/lib/input/Search';
import { Option } from 'antd/lib/mentions';
import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
	nameLevelRegister,
	nameOtherBy,
	nameTypeSort,
	optionsTargetSuccess,
} from '../config';
import { getFilter, saveFilter } from '../utils/common';
import TagRender from './TagRender';

const FilterStudent = (props) => {
	const [form] = Form.useForm();
	const location = useLocation();

	const onFinish = (fieldsValue) => {
		let { targetSuccess } = fieldsValue;
		targetSuccess = targetSuccess?.length ? targetSuccess : undefined;
		saveFilter({ ...fieldsValue, targetSuccess }, location.pathname);
		props.getData && props.getData({ ...fieldsValue, targetSuccess, studentCode: undefined });
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
			classUser: undefined,
			orderBy: 'lastUpdate',
			sort: 'asc',
			levelReview: undefined,
			targetSuccess: undefined,
		};
		if (!getFilter(data, location.pathname)) return;
		data.targetSuccess = data.targetSuccess
			? data.targetSuccess.split(',')
			: undefined;
		form.setFieldsValue({ ...data });
		props.getData && props.getData(data);
	}, []);

	return (
		<Form form={form} onFinish={onFinish}>
			<Space wrap>
				<Form.Item noStyle name="studentCode">
					<Search
						placeholder="Tìm theo MSSV"
						onSearch={(value) => props.getData({ studentCode: value })}
						enterButton
					/>
				</Form.Item>
				<Form.Item noStyle name="classUser">
					<Input placeholder="Tên lớp" />
				</Form.Item>
				<Form.Item noStyle name="levelReview">
					<Select
						allowClear
						placeholder="Lọc theo cấp xét"
						style={{ minWidth: 200 }}
					>
						{renderSelect(nameLevelRegister)}
					</Select>
				</Form.Item>
				<Form.Item noStyle name="targetSuccess">
					<Select
						maxTagCount="responsive"
						mode="tags"
						placeholder="Tiêu chí đã hoàn thành"
						tagRender={TagRender}
						style={{ minWidth: 200 }}
						options={optionsTargetSuccess}
					/>
				</Form.Item>
				<Form.Item noStyle name="orderBy">
					<Select placeholder="Xắp xếp theo" style={{ minWidth: 100 }}>
						{renderSelect(nameOtherBy)}
					</Select>
				</Form.Item>
				<Form.Item noStyle name="sort">
					<Select placeholder="Loại sắp xếp" style={{ minWidth: 100 }}>
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

FilterStudent.propTypes = {
	getData: PropTypes.func,
};

export default FilterStudent;
