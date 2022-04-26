import { PaperClipOutlined } from '@ant-design/icons';
import { Button, Image, Space } from 'antd';
import { nameTarget } from '../config';
import { checkFileImage } from '../utils/common';

const ShowProofImage = ({ proof }) => {
	return (
		<Space align="center" direction="horizontal">
			{Object.values(proof).map((file) => (
				<div key={file.name}>
					{checkFileImage(file.typeFile) ? (
						<Image
							height={80}
							width={130}
							style={{ objectFit: 'cover' }}
							alt={file.name}
							src={file.url}
						/>
					) : (
						<div key={file.name}>
							<Button icon={<PaperClipOutlined />} type="link" block>
								<a target="_blank" href={file.url} rel="noreferrer">
									{`${file.name}`}
								</a>
							</Button>
						</div>
					)}
					<p
						style={{
							textAlign: 'center',
							margin: 0,
						}}
					>
						{nameTarget[file.target]}
					</p>
				</div>
			))}
		</Space>
	);
};

export default ShowProofImage;
