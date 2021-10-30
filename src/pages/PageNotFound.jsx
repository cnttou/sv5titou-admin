import { Button, Result, Layout } from 'antd';
import { Link } from 'react-router-dom';
import styles from '../styles/PageNotFound.module.css';

const { Content } = Layout;

export default function PageNotFound() {
	return (
		<Content className={styles.content}>
			<Result
				status="404"
				title="404"
				subTitle="Trang bạn tìm không tồn tại."
				extra={
					<Button type="primary">
						<Link to="/">Trang chủ</Link>
					</Button>
				}
			/>
		</Content>
	);
}
