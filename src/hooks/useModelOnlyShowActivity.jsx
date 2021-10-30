import { useState } from 'react';
import { Modal } from 'antd';
import ActivityFeed from '../components/ActivityFeed';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { getImageProofAction } from '../store/actions';

function useModelOnlyShowActivity({ title, data, action }) {
	const [visible, setVisible] = useState(false);
	const [dataModel, setDataModel] = useState(data || null);

	const dispatch = useDispatch();
	const colorCard = (id, confirm) => {
		return 'white';
	};

	useEffect(() => {
		if (visible === true && dataModel.images === undefined) {
			console.log(dataModel);
			const { uid, id } = dataModel;
			dispatch(getImageProofAction({ uid, acId: id })).then((res) => {
				console.log('Image is: ', res);
				setDataModel((s) => ({ ...s, images: res.payload.images }));
			});
		}
	}, [visible]);

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
					colorCard={colorCard}
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
