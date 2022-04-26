import dayjs from 'dayjs';

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
export const compareStringName = (a, b) => {
	if (a.name > b.name) return 1;
	else return -1;
};
export const compareStringTarget = (a, b) => {
	if (a.target >= b.target) return 1;
	else return -1;
};
export const compareStringDate = (a, b) => {
	let aDate = dayjs(a.date, 'DD-MM-YYYY');
	let bDate = dayjs(b.date, 'DD-MM-YYYY');
	// console.log(aDate.isAfter(bDate));
	if (aDate > bDate) return 1;
	else return -1;
};
export const compareNumber = (a, b) => {
	a = parseInt(a.numPeople);
	b = parseInt(b.numPeople);

	return a - b;
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
