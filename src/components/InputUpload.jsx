import { Upload, Button, Progress } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { taskEvent, upFileApi } from '../api/firebaseStorage';
import { useState } from 'react';

const initInputUpload = {
	onUploadSuccess: true,
	onUploadStart: false,
	onUploadError: null,
	uploadProgress: 0,
};

function InputUpload({ text, id, ...props }) {
	const [inputUpload, setInputUpload] = useState(initInputUpload);

	const setState = (name, value) => {
		setInputUpload((s) => ({ ...s, [name]: value }));
	};

	const handleBeforeUpload = (file) => {
		if (props.handleBeforeUpload) props.handleBeforeUpload(file);

		const isLt5M = file.size / 1024 / 1024 < 4;
		if (!isLt5M) {
			message.error('Ảnh phải nhỏ hơn 4MB!');
		}
		return isLt5M;
	};
	const handleUpload = (data) => {
		const task = upFileApi(id, data.file);
		task.on(
			taskEvent,
			(snapshot) => {
				const progress = Math.round(
					(100 * snapshot.bytesTransferred) / snapshot.totalBytes
				);
				data.file.percent = progress;
				setState('onUploadStart', true);
				setState('uploadProgress', progress);
			},
			(error) => {
				data.file.status = 'error';
				message.error('Có lỗi xảy ra vui lòng thử lại');
				setState('onUploadError', error);
				setState('onUploadSuccess', false);
			},
			() => {
				data.file.status = 'success';
				setState('onUploadSuccess', true);
				setState('onUploadStart', false);
			}
		);
		task.then((snapshot) => {
			data.file.status = 'done';
			snapshot.ref.getDownloadURL().then((url) => {
				props.handleUpload(url);
			});
		});
	};
	return (
		<>
			<Upload
				name={props.name ? props.name : 'upload-image'}
				style={{ display: 'inline-block' }}
				customRequest={handleUpload}
				beforeUpload={handleBeforeUpload}
				listType="picture"
				multiple={true}
				showUploadList={false}
			>
				<Button type="link" icon={<UploadOutlined />}>
					{text || 'Thêm file'}
				</Button>
			</Upload>
			{inputUpload.onUploadStart && (
				<Progress
					steps={5}
					size="small"
					strokeColor="#66ee22"
					percent={inputUpload.uploadProgress}
				/>
			)}
		</>
	);
}

export default InputUpload;
