import { Card, Form, List, Radio, Space } from 'antd';
import Search from 'antd/lib/input/Search';
import { useRef } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { nameDepartmentActivity } from '../config';
import Loading from './Loading';

const ChooceActivity = (props) => {
	const { activities, setActivityChoice, doSearch, hasMoreData } = props;
    const searchValue = useRef();

	const onChange = (e) => {
		setActivityChoice(activities.find((c) => c.id === e.target.value));
	};

	return (
		<Space direction="vertical" style={{ width: '100%' }}>
			<Search
				placeholder="Tìm tên hoạt động"
				onSearch={(value) => {
                    searchValue.current = value;
                    doSearch({ nameSearch: value });
                }}
				enterButton
			/>
			<Form>
				<InfiniteScroll
					height={350}
					dataLength={activities.length || 0}
					hasMore={hasMoreData}
					loader={<Loading />}
					next={() => doSearch({ nameSearch: searchValue.current}, true)}
				>
					<Radio.Group
						onChange={onChange}
						name="avtivity"
						style={{ width: '100%' }}
					>
						<List
							dataSource={activities}
							renderItem={(item) => (
								<List.Item key={item.id}>
									<List.Item.Meta
										title={<Radio value={item.id}>{item.name}</Radio>}
										description={nameDepartmentActivity[item.department]}
									/>
								</List.Item>
							)}
						/>
					</Radio.Group>
				</InfiniteScroll>
			</Form>
		</Space>
	);
};

export default ChooceActivity;
