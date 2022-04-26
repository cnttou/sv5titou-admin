import { Tag } from 'antd';

const colorOption = {
	'hoc-tap': '#ff9c6e',
	'tinh-nguyen': '#ffc53d',
	'the-luc': '#bae637',
	'dao-duc': '#f759ab',
	'hoi-nhap': '#40a9ff',
	none: '#722ed1',
};

const TagRender = (props) => {
	const { label, value, closable, onClose } = props;

	const onPreventMouseDown = (event) => {
		event.preventDefault();
		event.stopPropagation();
	};

	return (
		<Tag
			color={colorOption[value]}
			onMouseDown={onPreventMouseDown}
			closable={closable}
			onClose={onClose}
			style={{ marginRight: 3 }}
		>
			{label}
		</Tag>
	);
};

export default TagRender;
