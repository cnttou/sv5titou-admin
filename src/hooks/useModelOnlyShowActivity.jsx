import { useState } from 'react';
import { Modal } from 'antd';
import ActivityFeed from '../components/ActivityFeed';


function useModelOnlyShowActivity({ title, data, action }) {
	const [visible, setVisible] = useState(false);
	const [dataModel, setDataModel] = useState(data || null);


	const ui = () => (
		<Modal
			bodyStyle={{ padding: 0 }}
			visible={visible}
			title={title || 'Chi tiết'}
			footer={action || null}
			centered={true}
			onCancel={() => setVisible(false)}
		>
			{dataModel !== null && (
				<ActivityFeed
					{...dataModel}
					canRemoveProof={true}
					showFull={true}
					btnDetail={false}
					loading={false}
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

export default useModelOnlyShowActivity;
