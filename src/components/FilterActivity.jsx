import { FilterOutlined, ReloadOutlined } from '@ant-design/icons';
import { Button, Card, Select, Space } from 'antd';
import { Option } from 'antd/lib/mentions';
import PropTypes from 'prop-types';
import { useState } from 'react';
import {
    nameDepartmentActivity,
    nameLevelRegister,
    optionsTagTarget
} from '../config';
import { tagRender } from '../pages/AdminManageUser';
import { compareString } from '../utils/compareFunction';
import DatePicker from './DatePicker';

const FilterActivity = (props) => {
	const [level, setLevel] = useState(null);
	const [target, setTarget] = useState(null);
	const [department, setDepartment] = useState(null);
	const [date, setDate] = useState(null);

	const doResetFilter = () => {
		setDate(null);
		setDepartment(null);
		setLevel(null);
		setTarget(null);
	};

	const getDataWithFilter = () => {
		props.getData && props.getData(date, department, level, target);
	};

	return (
		<Card style={{ width: '100vw' }} size="small">
			<Space>
				<Select
					onChange={(value) => setLevel(value)}
					placeholder="Lọc theo cấp xét"
					style={{ minWidth: 200 }}
					value={level}
				>
					{Object.entries(nameLevelRegister).map((c) => (
						<Option key={c[0]} value={c[0]}>
							{c[1]}
						</Option>
					))}
				</Select>
				<Select
					onChange={(value) => setDepartment(value)}
					placeholder="Lọc theo khoa"
					style={{ minWidth: 200 }}
					value={department}
				>
					{Object.entries(nameDepartmentActivity).map((c) => (
						<Option key={c[0]} value={c[0]}>
							{c[1]}
						</Option>
					))}
				</Select>
				<Select
					maxTagCount="responsive"
					mode="tags"
					placeholder="Lọc tiêu chí hoàn thành"
					tagRender={tagRender}
					style={{ minWidth: 200 }}
					options={optionsTagTarget}
					value={target}
					onChange={(value) => {
						if (value.includes('none')) setTarget(['none']);
						else
							setTarget(
								value.sort((a, b) => compareString(b, a))
							);
					}}
				/>
				<DatePicker
					onChange={(date, dateString) => setDate(dateString)}
				/>
				<Button
					icon={<FilterOutlined />}
					onClick={() => getDataWithFilter()}
				>
					Lọc
				</Button>
				<Button
					type="primary"
					icon={<ReloadOutlined />}
					onClick={() => {
						doResetFilter();
					}}
				>
					Đặt lại
				</Button>
			</Space>
		</Card>
	);
};

FilterActivity.propTypes = {
	getData: PropTypes.func,
};

export default FilterActivity;
