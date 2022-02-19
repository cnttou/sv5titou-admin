import React from 'react';
import { Select, Divider, Input } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const { Option } = Select;

let index = 0;

export default class InputSelectWithAddItem extends React.Component {
	state = {
		items: this.props.option || [''],
		name: '',
	};

	onNameChange = (event) => {
		this.setState({
			name: event.target.value,
		});
	};

	addItem = () => {
		const { items, name } = this.state;
		this.setState({
			items: [
				...items,
				{
					key: name,
					label: name,
					style: {
						backgroundColor: '#ff7875',
					},
				} || `Thêm ghi chú ${index++}`,
			],
			name: '',
		});
	};

	render() {
		const { items, name } = this.state;
		const { option, setValue, ...rest } = this.props;
		return (
			<Select
				{...rest}
				onChange={setValue}
				dropdownRender={(menu) => (
					<div>
						{menu}
						<Divider style={{ margin: '4px 0' }} />
						<div
							style={{
								display: 'flex',
								flexWrap: 'nowrap',
								padding: 8,
							}}
						>
							<Input
								style={{ flex: 'auto' }}
								value={name}
								onChange={this.onNameChange}
							/>
							<a
								style={{
									flex: 'none',
									padding: '8px',
									display: 'block',
									cursor: 'pointer',
								}}
								onClick={this.addItem}
							>
								<PlusOutlined /> Thêm lý do
							</a>
						</div>
					</div>
				)}
			>
				{items.map((item) => (
					<Option key={item.key} style={item.style}>
						{item.label}
					</Option>
				))}
			</Select>
		);
	}
}
