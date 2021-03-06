import {
	CloseCircleOutlined,
	DeleteOutlined,
	LinkOutlined,
	PaperClipOutlined,
} from '@ant-design/icons';
import { Typography, Button, Card, Image, List } from 'antd';
import { lazy } from 'react';
const ReactQuill = lazy(() => import('react-quill'));
import styles from '../styles/ActivityFeed.module.css';
import Loading from './Loading';
import { nameLevelActivity, nameTarget } from '../config';

const { Text, Title } = Typography;

export const typeFileimage = ['.jpeg', '.jpg', '.png'];

function ActivityFeed(props) {
	const {
		loading,
		showFull,
		handleClickDetail,
		handleRemoveImage,
		hoverable,
		bordered,
		btnDetail,
		colorCard,
		...data
	} = props;
	const {
		location,
		numPeople,
		target,
		date,
		summary,
		name,
		id,
		proof,
		images,
		confirm,
		level,
	} = data;
	const handleClick = () => {
		if (handleClickDetail) handleClickDetail(props.index, data);
	};
	return (
		<>
			<Card
				hoverable={hoverable || false}
				bordered={bordered || false}
				className={styles.card}
				style={
					showFull ? { maxHeight: '75vh', overflow: 'scroll' } : null
				}
				headStyle={{ background: colorCard(id, confirm) }}
				title={
					<>
						<Title level={5}>{name}</Title>
						<Text type="secondary">{nameLevelActivity[level]}</Text>
					</>
				}
				extra={
					showFull && (
						<Text
							copyable={{
								text: `https://sv5titou.web.app/news/${id}`,
							}}
						>
							<LinkOutlined />
						</Text>
					)
				}
				onClick={handleClick}
			>
				<p>
					<strong>Thời gian:</strong> {date}
				</p>
				<p>
					<strong>Địa điểm:</strong> {location}
				</p>
				{numPeople && (
					<p>
						<strong>Số lượng tối đa:</strong> {numPeople}
					</p>
				)}
				<p>
					<strong>Tiêu chí xét SV5T:</strong> {nameTarget[target]}
				</p>
				<div style={{ marginBottom: 0 }}>
					<strong>Thông tin chi tiết:</strong>
					<ReactQuill
						theme={null}
						defaultValue={summary}
						readOnly={true}
						className={showFull ? '' : styles.editer}
						style={{ height: '100%' }}
					/>
				</div>
				{images && (
					<div>
						<strong>Minh chứng đã thêm:</strong>
						<br />
						<List
							itemLayout="horizontal"
							size="small"
							bordered
							dataSource={images}
							renderItem={(item) =>
								typeFileimage.includes(
									item.name.slice(item.name.lastIndexOf('.'))
								) ? null : (
									<List.Item>
										<List.Item.Meta
											icon={<PaperClipOutlined />}
											title={
												<a
													target="_blank"
													href={item.url}
												>
													{item.name}
												</a>
											}
										/>

										{handleRemoveImage && (
											<DeleteOutlined
												style={{ color: 'red' }}
												onClick={() => {
													handleRemoveImage(item);
												}}
											/>
										)}
									</List.Item>
								)
							}
						/>
					</div>
				)}
				<Image.PreviewGroup>
					{images &&
						images.map((c, index) =>
							typeFileimage.includes(
								c.name.slice(c.name.lastIndexOf('.'))
							) ? (
								<div
									key={index}
									style={{
										width: '50%',
										display: 'inline-block',
										marginTop: 5,
										position: 'relative',
									}}
								>
									<Image width={'100%'} src={c.url} />
									{handleRemoveImage && (
										<Button
											style={{
												position: 'absolute',
												right: 0,
												top: 0,
											}}
											type="ghost"
											shape="circle"
											size="large"
											icon={<CloseCircleOutlined />}
											onClick={() => {
												handleRemoveImage(c);
											}}
										/>
									)}
								</div>
							) : null
						)}
				</Image.PreviewGroup>
				{loading === true && images === undefined ? (
					<Loading size="default" />
				) : null}
			</Card>
		</>
	);
}

export default ActivityFeed;
