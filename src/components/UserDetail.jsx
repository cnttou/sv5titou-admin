import { Typography, Card } from 'antd';
import styles from '../styles/ActivityFeed.module.css';
import { fieldPesonal } from '../config';

const { Text, Title } = Typography;

export const typeFileimage = ['.jpeg', '.jpg', '.png'];

function UserDetail(props) {
	const { fullName, studentCode, listData, ...rest } = props;
	return (
		<>
			<Card
				hoverable={false}
				bordered={true}
				className={styles.card}
				style={{ maxHeight: '75vh', overflow: 'scroll' }}
				title={
					<>
						<Title level={5}>{fullName}</Title>
						<Text type="secondary">{studentCode}</Text>
					</>
				}
			>
				{Object.entries(fieldPesonal).map(([k, v], i) =>
					rest[k] ? (
						<p key={i}>
							<strong>{v.label}: </strong>
							{null}
							{v.parse
								? typeof rest[k] !== "string"
									? rest[k].map((c) => v.parse(c)).join(', ')
									: v.parse(rest[k])
								: rest[k]}
						</p>
					) : null
				)}
			</Card>
		</>
	);
}

export default UserDetail;
