import { Upload, Button, Progress } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

function InputUpload({ text, inputUpload, handleUpload, handleBeforeUpload }) {
	const { onUploadStart, uploadProgress } = inputUpload;

	return (
		<>
			<Upload
				style={{ display: 'inline-block' }}
				customRequest={handleUpload}
				beforeUpload={handleBeforeUpload}
				listType="picture"
				multiple={true}
				showUploadList={false}
			>
				<Button icon={<UploadOutlined />}>{text || 'Thêm file'}</Button>
			</Upload>
			{onUploadStart && <Progress type="line" percent={uploadProgress} />}
		</>
	);
}

export default InputUpload;
