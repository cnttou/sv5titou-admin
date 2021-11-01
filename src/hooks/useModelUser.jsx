import { useState } from 'react';
import { Modal } from 'antd';
import UserDetail from '../components/UserDetail';

function useModelUser({ title, data }) {
	const [visible, setVisible] = useState(false);
	const [dataModel, setDataModel] = useState(data || null);

	const ui = () => (
		<Modal
			bodyStyle={{ padding: 0 }}
			visible={visible}
			title={title || 'Chi tiết'}
			centered={true}
            footer={null}
			onCancel={() => setVisible(false)}
		>
			{dataModel !== null && (
				<UserDetail
					{...dataModel}
				/>
			)}
		</Modal>
	);
	return {
		ui,
		visible,
		setVisible,
		dataModel,
		setDataModel,
	};
}

export default useModelUser;
