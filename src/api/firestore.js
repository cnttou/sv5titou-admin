import firebase from './firebase';
const { documentId } = firebase.firestore.FieldPath;
import { compareString } from '../utils/compareFunction';
import { deleteProofImage } from './firebaseStorage';
import { nonAccentVietnamese } from '../utils/common';
const { arrayRemove, arrayUnion } = firebase.firestore.FieldValue;
const { FieldValue } = firebase.firestore;

const db = firebase.firestore();

const ACTIVITY = 'activities';
const USER = 'users';
const USER_ACTIVITY = 'user_activity';

export const serializeDoc = (doc) =>
	doc.exists ? { ...doc.data(), id: doc.id } : {};

export const serializerDoc = (querySnapshot) => {
	let data = [];
	querySnapshot.forEach((doc) => {
		data.push({
			...doc.data(),
			id: doc.id,
		});
	});
	return data;
};

export const serializerDocToObject = (querySnapshot) => {
	let data = {};
	querySnapshot.forEach((doc) => {
		data[doc.id] = {
			...doc.data(),
			id: doc.id,
		};
	});
	return data;
};

export const getUserApi = ({
	classUser,
	levelReview,
	targetSuccess,
	studentCode,
	orderBy = 'lastUpdate',
	sort = 'asc',
	next,
	previous,
	limit,
	acid,
}) => {
	let ref = db.collection(USER);
	if (acid) ref = ref.where('activityId', 'array-contains', acid);
	if (studentCode) return ref.where('studentCode', '==', studentCode).get();
	if (levelReview) ref = ref.where('levelReview', '==', levelReview);
	if (classUser) ref = ref.where('classUser', '==', classUser);
	if (targetSuccess?.length) {
		if (targetSuccess.includes('none'))
			ref = ref.where('targetSuccess', 'in', [[]]);
		else ref = ref.where('targetSuccess', 'in', [targetSuccess]);
	}
	if (orderBy && sort)
		ref = ref.orderBy(orderBy || 'lastUpdate', sort || 'asc');
	if (previous) ref = ref.endBefore(previous[orderBy || 'lastUpdate']);
	if (next) ref = ref.startAfter(next[orderBy || 'lastUpdate']);
	return ref.limit(limit || 10).get();
};

export const getUserExportApi = (classUser, levelReview, targetSuccess) => {
	let ref = db.collection(USER);
	if (levelReview) ref = ref.where('levelReview', '==', levelReview);
	if (classUser) ref = ref.where('classUser', '==', classUser);
	if (targetSuccess && targetSuccess.length) {
		if (targetSuccess.includes('none'))
			ref = ref.where('targetSuccess', 'in', [[]]);
		else ref = ref.where('targetSuccess', 'in', [targetSuccess]);
	}
	return ref.get();
};

function getCombinations(valuesArray) {
	var combi = [];
	var temp = [];
	var slent = Math.pow(2, valuesArray.length);

	for (var i = 0; i < slent; i++) {
		temp = [];
		for (var j = 0; j < valuesArray.length; j++) {
			if (i & Math.pow(2, j)) {
				temp.push(valuesArray[j]);
			}
		}
		if (temp.length > 0) {
			combi.push(temp);
		}
	}

	combi.sort((a, b) => a.length - b.length);
	console.log(combi.join('\n'));
	return combi;
}

// export const testIndexApi = () => {
// 	const initTest = {
// 		active: 'true',
// 		typeActivity: 'register',
// 		date: '20-12-2022',
// 		department: 'cntt',
// 		level: 'lop',
// 		target: ['hoc-tap'],
// 	};
// 	const combination = getCombinations(['department', 'level', 'target']);
// 	combination.forEach((arr) => {
// 		const params = { ...initTest };
// 		Object.keys(params).forEach((key) => {
// 			if (!arr.includes(key)) params[key] = undefined;
// 		});
// 		console.info(params);
// 		getAllRegisterActivityApi({
// 			...params,
// 			limit: 1,
// 			orderBy: 'createAt',
// 			sort: 'asc',
// 		}).catch((error) => console.error(error));
// 	});
// };

export const getAllRegisterActivityApi = ({
	active,
	typeActivity,
	date,
	department,
	level,
	nameSearch,
	target,
	orderBy = 'lastUpdate',
	sort = 'asc',
	previous,
	next,
	limit,
}) => {
	let ref = db.collection(ACTIVITY);
	if (nameSearch)
		return ref.where(
			'nameSearch',
			'array-contains-any',
			nonAccentVietnamese(nameSearch).split(/\s+/)
		).limit(7).get();
	if (typeActivity) ref = ref.where('typeActivity', '==', typeActivity);
	if (active) ref = ref.where('active', '==', active === 'true');
	if (date) ref = ref.where('date', '==', date);
	if (department) ref = ref.where('department', '==', department);
	if (level) ref = ref.where('level', '==', level);
	if (target?.length)
		ref = ref.where(
			'target',
			'array-contains-any',
			target.sort((a, b) => compareString(b, a))
		);
	if (orderBy && sort) ref = ref.orderBy(orderBy || 'lastUpdate', sort || 'asc');
	if (previous) ref = ref.endBefore(previous[orderBy||'lastUpdate']);
	if (next) ref = ref.startAfter(next[orderBy||'lastUpdate']);

	return ref.limit(limit || 10).get();
};
export const getAllUserActivityApi = () => db.collection(USER_ACTIVITY).get();

export const addActivityApi = (id, data) =>
	db.collection(ACTIVITY).doc(id).set(data);

export const updateActivityApi = (id, data) =>
	db.collection(ACTIVITY).doc(id).update(data);
export const updateUserApi = (id, data) =>
	db.collection(USER).doc(id).update(data);

export const updateUserActivityApi = (id, uid, data) => {
	const { confirm, reason } = data;
	return db.doc(`${USER}/${uid}`).update({
		confirm: confirm ? arrayUnion(id) : arrayRemove(id),
		[`activities.${id}.reason`]: reason ? reason : '',
	});
};

export const deleteActivityApi = (id) => {
	return db.collection(ACTIVITY).doc(id).delete();
};
export const getActivitiesById = (listId) => {
	const sliceIds = [];
	for (let i = 0; i < listId.length; i = i + 10) {
		sliceIds.push(listId.slice(i, i + 10));
	}
	return Promise.all(
		sliceIds.map((ids) =>
			db.collection(ACTIVITY).where(documentId(), 'in', ids).get()
		)
	).then((responses) => {
		const kq = {};
		responses.forEach((res) => {
			res.forEach((doc) => {
				if (doc.exists) {
					kq[doc.id] = serializeDoc(doc);
				}
			});
		});
		return kq;
	});
};

export const deleteRegisterActivity = (uid, id) => {
	return db
		.doc(`${USER}/${uid}`)
		.update({
			activityId: arrayRemove(id),
			[`activities.${id}`]: FieldValue.delete(),
		})
		.then(() => ({ id }));
};

export const getSlideShowApi = () => {
	return db
		.collection('slide_show')
		.get()
		.then((querySnapshot) => {
			let data = [];
			querySnapshot.forEach((doc) => {
				data.push({
					...doc.data(),
					id: doc.id,
				});
			});

			return data;
		});
};
export const deleteDataApi = (collection, docId) => {
	return db
		.collection(collection || 'news')
		.doc(docId)
		.delete()
		.then(() => docId);
};
export const addDataApi = (collection = 'news', data, docId) => {
	if (docId === null) {
		return db
			.collection(collection)
			.add(data)
			.then((doc) => ({ ...data, id: doc.id }));
	} else {
		return db
			.collection(collection)
			.doc(docId)
			.set(data)
			.then(() => ({ ...data, id: docId, docId }));
	}
};
export const addUserDetailApi = (uid, targetSuccess) => {
	return db
		.collection('register_activity')
		.doc(uid)
		.set({ targetSuccess }, { merge: true })
		.then(() => ({ targetSuccess, uid }))
		.catch((err) => console.log(err.message));
};
export const confirmProofApi = (uid, acId, confirm) => {
	return db
		.collection('register_activity')
		.doc(uid)
		.update({
			[`activities.${acId}.confirm`]: confirm,
		})
		.then(() => {
			return { uid, acId, confirm };
		})
		.catch((error) => {
			console.log(error.message);
		});
};
export const cancelConfirmProofApi = (uid, acId, confirm) => {
	return db
		.collection('register_activity')
		.doc(uid)
		.update({
			[`activities.${acId}.confirm`]: confirm,
		})
		.then(() => {
			return { uid, acId, confirm };
		})
		.catch((error) => {
			console.log(error.message);
		});
};
export const deleteActivityOfUserByIdApi = (acId = '') => {
	return db
		.collection('register_activity')
		.where('activityId', 'array-contains', acId)
		.get()
		.then((querySnapshot) => {
			const promises = [];
			querySnapshot.forEach((user) => {
				console.log('userid will delete', user.id);
				deleteProofImage(user.id, acId);
				promises.push(
					user.ref.update({
						[`activities.${acId}`]: FieldValue.delete(),
						activityId: arrayRemove(acId),
					})
				);
			});
			return Promise.all(promises);
		})
		.then(() => {
			console.log('DONE delete activity by Id');
		})
		.catch((error) => console.log(error.message));
};
