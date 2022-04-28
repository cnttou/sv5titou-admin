import { Button, Card, Form, Input, message, Select } from 'antd';
import { Option } from 'antd/lib/mentions';
import { useState } from 'react';
import { CSVLink } from 'react-csv';
import { getUserExportApi, serializerDoc } from '../api/firestore';
import {
	fieldPersonal,
	nameDepartmentActivity,
	nameLevelRegister,
	nameMajors,
	nameSex,
	nameTarget,
	optionsTargetSuccess,
} from '../config';
import { compareString } from '../utils/compareFunction';

const initRestExportData = {
	targetOtherSuccess: [],
	targetHoiNhap: [],
	targetKyNang: [],
	targetNgoaiNgu: [],
	targetTinhNguyen: [],
	targetTheLuc: [],
	otherHocTap: [],
	requireHocTap: [],
	otherDaoDuc: [],
	requireDaoDuc: [],
};

const headerCsv = Object.entries(fieldPersonal).map(([k, v]) => ({
	label: v.label,
	key: k,
}));

const layout = {
	labelCol: { span: 5 },
	wrapperCol: { span: 19 },
};
const tailLayout = {
	wrapperCol: { span: 24 },
};

const ExportStudent = () => {
	const [csvData, setCsvData] = useState([]);
	const [loadingExport, setLoadingExport] = useState(false);
	const [form] = Form.useForm();

	const getProofActivity = (activities = [], confirmed) => {
		const result = { ...initRestExportData };
		for (var activity of activities) {
			if (!confirmed.includes(activity.id)) continue;
			Object.values(activity.proof).forEach(({ typeActivity, ...image }) => {
				if (typeActivity === 'require') {
					if (image.target === 'hoc-tap') {
						result.requireHocTap.push(image.url);
					} else if (image.target === 'dao-duc') {
						result.requireDaoDuc.push(image.url);
					}
				} else {
					if (image.target === 'hoc-tap') {
						result.otherHocTap.push(image.url);
					} else if (image.target === 'dao-duc') {
						result.otherDaoDuc.push(image.url);
					} else if (image.target === 'tieu-bieu-khac') {
						result.targetOtherSuccess.push(image.url);
					} else if (image.target === 'hoi-nhap') {
						result.targetHoiNhap.push(image.url);
					} else if (image.target === 've-ky-nang') {
						result.targetKyNang.push(image.url);
					} else if (image.target === 've-ngoai-ngu') {
						result.targetNgoaiNgu.push(image.url);
					} else if (image.target === 'tinh-nguyen') {
						result.targetTinhNguyen.push(image.url);
					} else if (image.target === 'the-luc') {
						result.targetTheLuc.push(image.url);
					}
				}
			});
		}
		return result;
	};

	const onFinfishExportForm = async (values) => {
		const { classUser, levelReview, targetSuccess } = values;
		setLoadingExport(true);
		const users = await getUserExportApi(
			classUser,
			levelReview,
			targetSuccess?.sort((a, b) => compareString(a, b))
		)
			.then(serializerDoc)
			.catch((error) => console.error(error));
		if (!users.length) {
			message.warn('Không có sinh viên nào thỏa điều kiện.');
			setLoadingExport(false);
			return;
		}
		const dataExport = users.map((user) => ({
			...user,
			sex: nameSex[user.sex],
			targetSuccess: user?.targetSuccess?.length
				? user.targetSuccess.map((c) => nameTarget[c]).join(', ')
				: '',
			majors: nameMajors[user.majors],
			department: nameDepartmentActivity[user.department],
			levelReview: nameLevelRegister[user.levelReview],
			...getProofActivity(
				Object.entries(user.activities).map(([id, value]) => ({
					id,
					...value,
				})),
				user.confirm
			),
		}));

		setCsvData(dataExport);
		setLoadingExport(false);
	};
	const rules = [{ required: true, message: 'Bạn phải lọc theo trường này' }];
	const doReset = () => {
		form.resetFields();
		setLoadingExport(false);
		setCsvData([]);
	};
	return (
		<Card>
			<Form {...layout} onFinish={onFinfishExportForm} form={form}>
				<Form.Item label="Chọn lớp" name="classUser">
					<Input placeholder="Lọc theo lớp" />
				</Form.Item>
				<Form.Item
					label="Cấp xét"
					name="levelReview"
					initialValues="xet-cap-khoa"
					rules={rules}
				>
					<Select placeholder="Lọc theo cấp xét">
						{Object.entries(nameLevelRegister).map((c) => (
							<Option key={c[0]} value={c[0]}>
								{c[1]}
							</Option>
						))}
					</Select>
				</Form.Item>
				<Form.Item label="Tiêu chí" name="targetSuccess">
					<Select
						mode="tags"
						maxTagCount="responsive"
						placeholder="Tiêu chí hoàn thành"
						options={optionsTargetSuccess}
					/>
				</Form.Item>
				<Form.Item {...tailLayout}>
					{csvData?.length && !loadingExport ? (
						<CSVLink
							filename={'Export-SV5T.csv'}
							data={csvData}
							target="_blank"
							headers={headerCsv}
						>
							Tải dữ liệu
						</CSVLink>
					) : (
						<Button type="primary" htmlType="submit" loading={loadingExport}>
							Xuất dữ liệu
						</Button>
					)}
					<Button
						htmlType="button"
						onClick={doReset}
						disabled={!csvData.length && !loadingExport}
					>
						Hủy
					</Button>
				</Form.Item>
			</Form>
		</Card>
	);
};

export default ExportStudent;
