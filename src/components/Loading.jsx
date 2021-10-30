import { Spin } from 'antd';

export default function Loading({ size }) {
	return (
		<div className="wrapper-loading">
			<Spin size={size || 'large'} />
		</div>
	);
}
