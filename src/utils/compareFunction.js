export const compareString = (a, b) => {
	var nameA = a.toUpperCase(); // ignore upper and lowercase
	var nameB = b.toUpperCase(); // ignore upper and lowercase
	if (nameA < nameB) {
		return -1;
	}
	if (nameA > nameB) {
		return 1;
	}
	return 0;
};

const pointSort = {
	typeActivity: {
		require: 3000,
		other: 2000,
		register: 1000,
	},
	target: {
		'dao-duc': 100,
		'hoc-tap': 90,
		'the-luc': 80,
		'tinh-nguyen': 70,
		've-ngoai-ngu': 60,
		've-ky-nang': 50,
		'hoi-nhap': 40,
		'tieu-bieu-khac': 30,
	},
};
export const handleSortActivity = (activity1, activity2) => {
	let point1 =
		pointSort.typeActivity[activity1.typeActivity] +
		pointSort.target[activity1.target[0]];
	let point2 =
		pointSort.typeActivity[activity2.typeActivity] +
		pointSort.target[activity2.target[0]];
	return point2 - point1;
};
