export const nameLevelActivity = {
	lop: 'Cấp chi',
	khoa: 'Cấp khoa',
	truong: 'Cấp trường',
	tp: 'Cấp thành phố',
	qg: 'Cấp quốc gia',
};

export const nameFilterProof = [
	{
		text: 'Đã xác nhận',
		value: 'true',
	},
	{
		text: 'Chưa xác nhận',
		value: 'false',
	},
	{
		text: 'MC không hợp lệ',
		value: 'cancel',
	},
	{
		text: 'Chưa thêm minh chứng',
		value: 'notproof',
	},
];

export const nameFilterActive = [
	{
		text: 'Chưa kích hoạt',
		value: 'false',
	},
	{
		text: 'Đã kích hoạt',
		value: 'true',
	},
];

export const typeFileimage = ['jpeg', 'jpg', 'png'];

export const nameLevelRegister = {
	'xet-cap-khoa': 'Xét cấp khoa',
	'xet-cap-truong': 'Xét cấp trường',
};

export const optionsTargetSuccess = [
	{ value: 'hoc-tap', label: 'Học tập', color: '#ff9c6e' },
	{ value: 'tinh-nguyen', label: 'Tình nguyện', color: '#ffc53d' },
	{ value: 'the-luc', label: 'Thể lực', color: '#bae637' },
	{ value: 'dao-duc', label: 'Đạo đức', color: '#f759ab' },
	{ value: 'hoi-nhap', label: 'Hội nhập', color: '#40a9ff' },
	{ value: 'none', label: 'Chưa hoàn thành cái nào', color: '#722ed1' },
];

export const optionProof = [
	{
		key: 'false',
		label: 'Chưa xác nhận',
		style: {
			backgroundColor: 'white',
		},
	},
	{
		key: 'true',
		label: 'Đã xác nhận',
		style: {
			backgroundColor: '#95de64',
		},
	},
	{
		key: 'Minh chứng không hợp lệ',
		label: 'Minh chứng không hợp lệ',
		style: {
			backgroundColor: '#ff7875',
		},
	},
];

export const nameSex = {
	male: 'Nam',
	female: 'Nữ',
};
export const nameTypeActivity = {
	register: 'Tiêu chuẩn đăng ký',
	require: 'Tiêu chuẩn bắt buộc',
	other: 'Tiêu chuẩn khác',
};

export const fieldPersonal = {
	classUser: { label: 'Lớp' },
	majors: { label: 'Chuyên ngành', parse: (value) => nameMajors[value] },
	fullName: { label: 'Họ và tên' },
	birthday: { label: 'Ngày sinh' },
	sex: { label: 'Giới tính', parse: (value) => nameSex[value] },
	studentCode: { label: 'Mssv' },
	department: {
		label: 'Khoa',
		parse: (value) => nameDepartmentActivity[value],
	},
	phoneNumber: { label: 'Số điện thoại' },
	email: { label: 'Email' },
	idCard: { label: 'Số CMND' },
	bankNumber: { label: 'Số tài khoản' },
	levelReview: {
		label: 'Cấp xét SV5T',
		parse: (value) => nameLevelRegister[value],
	},
	pointTraining: { label: 'Điểm rèn luyện' },
	requireDaoDuc: {
		label:
			'Các Tiêu chuẩn đạo đức bắt buộc (Bảng điểm rèn luyện, 6 bài lý luận chính trị)',
	},
	otherDaoDuc: {
		label: 'Các Tiêu chuẩn đạo đức khác',
	},
	gpa: { label: 'Điềm trung bình' },
	requireHocTap: {
		label: 'Các Tiêu chuẩn học tập bắt buộc (Bảng điểm học kỳ)',
	},
	otherHocTap: {
		label: 'Các Tiêu chuẩn học tập khác',
	},
	targetTheLuc: {
		label: 'Thể lực tốt',
	},
	targetTinhNguyen: {
		label: 'Tình nguyện tốt',
	},
	targetNgoaiNgu: {
		label: 'Về ngoại ngữ',
	},
	targetKyNang: {
		label: 'Về kỹ năng',
	},
	targetHoiNhap: {
		label: 'Về hội nhập',
	},
	targetOtherSuccess: {
		label: 'Các thành tích tiêu biểu khác',
	},
	targetSuccess: {
		label: 'Tiêu chí đã đạt',
		parse: (value) => nameTarget[value],
	},
};

export const optionsTagTarget = [
	{ value: 'hoc-tap', label: 'Học tập', color: '#ff9c6e' },
	{ value: 'tinh-nguyen', label: 'Tình nguyện', color: '#ffc53d' },
	{ value: 'the-luc', label: 'Thể lực', color: '#bae637' },
	{ value: 'dao-duc', label: 'Đạo đức', color: '#f759ab' },
	{ value: 'hoi-nhap', label: 'Hội nhập', color: '#40a9ff' },
	{ value: 'none', label: 'Chưa hoàn thành cái nào', color: '#722ed1' },
];

export const nameDepartmentActivity = {
	cntt: 'Công Nghệ Thông Tin',
	cnsh: 'Công Nghệ Sinh Học',
	dtdb: 'Đào Tạo Đặc Biệt',
	kk: 'Kế Toán - Kiểm Toán',
	kc: 'Kinh Tế và Quản Lý Công',
	l: 'Luật',
	nn: 'Ngoại Ngữ',
	kd: 'Quản Trị Kinh Doanh',
	tcnh: 'Tài Chính - Ngân Hàng',
	xcd: 'Xã Hội Học - Công Tác Xã Hội - Đông Nam Á',
	xd: 'Xây Dựng.',
};

export const nameOtherBy = {
	createAt: 'Ngày tạo',
	lastUpdate: 'Mới cập nhật',
};

export const nameTypeSort = {
	desc: 'Gần nhất',
	asc: 'Xa nhất',
};

export const nameTarget = {
	'hoi-nhap': 'Hội nhập tốt',
	'hoc-tap': 'Học tập tốt',
	'dao-duc': 'Đạo đức tốt',
	'tinh-nguyen': 'Tình nguyện tốt',
	'the-luc': 'Thể lực tốt',
	've-ngoai-ngu': 'Về ngoại ngữ',
	've-ky-nang': 'Về kỹ năng',
	'tieu-bieu-khac': 'Các thành tích tiêu biểu khác',
};
export const nameMajors = {
	7220201: 'Ngôn ngữ Anh',
	'7220201C': 'Ngôn ngữ Anh – Chất lượng cao',
	7220204: 'Ngôn ngữ Trung Quốc',
	'7220204C': 'Ngôn ngữ Trung Quốc - Chất lượng cao',
	7220209: 'Ngôn ngữ Nhật',
	'7220209C': 'Ngôn ngữ Nhật - Chất lượng cao',
	7220210: 'Ngôn ngữ Hàn Quốc',
	7310101: 'Kinh tế',
	7310301: 'Xã hội học',
	7310620: 'Đông Nam Á học',
	7340101: 'Quản trị kinh doanh',
	'7340101C': 'Quản trị kinh doanh - Chất lượng cao',
	7340115: 'Marketing',
	7340120: 'Kinh doanh quốc tế',
	7340201: 'Tài chính Ngân hàng',
	'7340201C': 'Tài chính ngân hàng - Chất lượng cao',
	7340301: 'Kế toán',
	'7340301C': 'Kế toán - Chất lượng cao',
	7340302: 'Kiểm toán',
	7340404: 'Quản trị nhân lực',
	7340405: 'Hệ thống thông tin quản lý',
	7380101: 'Luật',
	7380107: 'Luật kinh tế',
	'7380107C': 'Luật kinh tế - Chất lượng cao',
	7420201: 'Công nghệ sinh học',
	'7420201C': 'Công nghệ sinh học - Chất lượng cao',
	7480101: 'Khoa học máy tính',
	'7480101C': 'Khoa học máy tính - Chất lượng cao',
	7480201: 'Công nghệ thông tin',
	7510102: 'Công nghệ kỹ thuật công trình xây dựng',
	'7510102C': 'Công nghệ kỹ thuật công trình xây dựng - Chất lượng cao',
	7510605: 'Logistics và Quản lý chuỗi cung ứng',
	7540101: 'Công nghệ thực phẩm',
	7580302: 'Quản lý xây dựng',
	7760101: 'Công tác xã hội',
	7810101: 'Du lịch',
};
