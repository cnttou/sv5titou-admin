import React from 'react';
import { Table, Input, Button, Space, DatePicker } from 'antd';
import Highlighter from 'react-highlight-words';
import { FilterOutlined, SearchOutlined } from '@ant-design/icons';
import moment from 'moment';

class TableCustom extends React.Component {
	state = {
		searchText: '',
		searchedColumn: '',
		dateFilter: [null, null],
		dateFilterColumn: '',
	};

	getColumnSearchProps = (dataIndex) => ({
		filterDropdown: ({
			setSelectedKeys,
			selectedKeys,
			confirm,
			clearFilters,
		}) => (
			<div style={{ padding: 8 }}>
				<Input
					ref={(node) => {
						this.searchInput = node;
					}}
					placeholder={`Search ${dataIndex}`}
					value={selectedKeys[0]}
					onChange={(e) =>
						setSelectedKeys(e.target.value ? [e.target.value] : [])
					}
					onPressEnter={() =>
						this.handleSearch(selectedKeys, confirm, dataIndex)
					}
					style={{ marginBottom: 8, display: 'block' }}
				/>
				<Space>
					<Button
						type="primary"
						onClick={() =>
							this.handleSearch(selectedKeys, confirm, dataIndex)
						}
						icon={<SearchOutlined />}
						size="small"
						style={{ width: 90 }}
					>
						Search
					</Button>
					<Button
						onClick={() => this.handleReset(clearFilters)}
						size="small"
						style={{ width: 90 }}
					>
						Reset
					</Button>
					<Button
						type="link"
						size="small"
						onClick={() => {
							confirm({ closeDropdown: false });
							this.setState({
								searchText: selectedKeys[0],
								searchedColumn: dataIndex,
							});
						}}
					>
						Filter
					</Button>
				</Space>
			</div>
		),
		filterIcon: (filtered) => (
			<SearchOutlined
				style={{ color: filtered ? '#1890ff' : undefined }}
			/>
		),
		onFilter: (value, record) =>
			record[dataIndex]
				? record[dataIndex]
						.toString()
						.toLowerCase()
						.includes(value.toLowerCase())
				: '',
		onFilterDropdownVisibleChange: (visible) => {
			if (visible) {
				setTimeout(() => this.searchInput.select(), 100);
			}
		},
		render: (text) =>
			this.state.searchedColumn === dataIndex ? (
				<Highlighter
					highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
					searchWords={[this.state.searchText]}
					autoEscape
					textToHighlight={text ? text.toString() : ''}
				/>
			) : (
				text
			),
	});

	getColumnDateBeweenProps = (dataIndex) => ({
		filterDropdown: ({
			setSelectedKeys,
			selectedKeys,
			confirm,
			clearFilters,
		}) => (
			<div style={{ padding: 8, maxWidth: 300 }}>
				<DatePicker.RangePicker
					// ref={(node) => {
					// 	this.dateRangeInput = node;
					// }}
					style={{ width: '100%', marginBottom: 8 }}
					format="DD-MM-YYYY"
					onChange={(value, valueString) =>
						setSelectedKeys([value, valueString])
					}
					value={selectedKeys[0]}
				/>
				<Space>
					<Button
						type="primary"
						onClick={() => {
							confirm();
							this.setState({
								dateFilter: selectedKeys[1],
								dateFilterColumn: dataIndex,
							});
						}}
						icon={<FilterOutlined />}
						size="small"
						style={{ width: 90 }}
					>
						Lọc
					</Button>
					<Button
						onClick={() => {
							clearFilters();
							this.setState({ dateFilter: [null, null] });
						}}
						size="small"
						style={{ width: 90 }}
					>
						Đặt lại
					</Button>
				</Space>
			</div>
		),
		filterIcon: (filtered) => (
			<FilterOutlined
				style={{ color: filtered ? '#1890ff' : undefined }}
			/>
		),
		onFilter: (value, record) => {
			var compareDate = moment(record[dataIndex], 'DD-MM-YYYY');
			var startDate = moment(this.state.dateFilter[0], 'DD-MM-YYYY');
			var endDate = moment(this.state.dateFilter[1], 'DD-MM-YYYY');
			return compareDate.isBetween(startDate, endDate);
		},
		onFilterDropdownVisibleChange: (visible) => {
			if (visible) {
				// setTimeout(() => this.dateRangeInput.select(), 100);
			}
		},
		render: (text) => text,
	});

	handleSearch = (selectedKeys, confirm, dataIndex) => {
		confirm();
		this.setState({
			searchText: selectedKeys[0],
			searchedColumn: dataIndex,
		});

		confirm({ closeDropdown: false });
		this.setState({
			searchText: selectedKeys[0],
			searchedColumn: dataIndex,
		});
	};

	handleReset = (clearFilters) => {
		clearFilters();
		this.setState({ searchText: '' });
	};

	render() {
		const { columns, dataSource, ...rest } = this.props;
		const columnsCus = columns.map((c, key) => {
			let obj = {...c};
            if (c.searchFilter) {
				obj = { ...obj, ...this.getColumnSearchProps(c.key) };
			}
            if (c.dateBeweenFilter) {
				obj = { ...obj, ...this.getColumnDateBeweenProps(c.key) };
			}
			return obj;
		});
		return (
			<Table
				columns={columnsCus}
				dataSource={dataSource.map((c, key) => ({ ...c, key }))}
				{...rest}
			/>
		);
	}
}

export default TableCustom;
