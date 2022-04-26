import { FilterOutlined, ReloadOutlined } from '@ant-design/icons';
import { Button, Form, Input, Select, Space } from 'antd';
import { Option } from 'antd/lib/mentions';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { nameLevelRegister, nameOtherBy, nameTypeSort } from '../config';
import { getFilter, saveFilter } from '../utils/common';

const SeatchListActivity = (props) => {
	const [form] = Form.useForm();
	const location = useLocation();

	const onFinish = (fieldsValue) => {
		let { classUser, levelReview, targetSuccess } = fieldsValue;
		targetSuccess = targetSuccess?.length ? targetSuccess : undefined;
		saveFilter({ classUser, levelReview, targetSuccess }, location.pathname);
		props.getData && props.getData({ classUser, levelReview, targetSuccess });
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
			<Space>
				<Form.Item noStyle name="classUser">
					<Input placeholder="Tên hoạt động" />
				</Form.Item>
				<Form.Item noStyle name="levelReview">
					<Select placeholder="Lọc theo cấp xét" style={{ minWidth: 200 }}>
						{renderSelect(nameLevelRegister)}
					</Select>
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
						Tìm
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
export default SeatchListActivity;