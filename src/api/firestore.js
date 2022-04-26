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
	doc.exists
		? {
				...doc.data(),
				id: doc.id,
		  }
		: {};

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
//GET ALL
export const getAllUserApi = () => db.collection(USER).get();
export const getUserApi = ({
	classUser,
	levelReview,
	targetSuccess,
	studentCode,
	orderBy = 'createAt',
	sort = 'asc',
	next,
	previous,
	limit,
}) => {
	let ref = db.collection(USER);
	if (studentCode) ref = ref.where('studentCode', '==', studentCode);
	if (levelReview) ref = ref.where('levelReview', '==', levelReview);
	if (classUser) ref = ref.where('classUser', '==', classUser);
	if (targetSuccess?.length) {
		if (targetSuccess.includes('none'))
			ref = ref.where('targetSuccess', 'in', [[]]);
		else ref = ref.where('targetSuccess', 'in', [targetSuccess]);
	}
	if (orderBy && sort) ref = ref.orderBy(orderBy, sort);
	if (previous) ref = ref.endBefore(previous[orderBy]);
	if (next) ref = ref.startAfter(next[orderBy]);
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

export const getAllActivityApi = () => db.collection(ACTIVITY).get();
export const getActivityApi = () =>
	db.collection(ACTIVITY).where('active', '==', true).get();
export const getAllOtherActivityApi = () =>
	db.collection(ACTIVITY).where('typeActivity', '!=', 'register').get();
export const getAllRegisterActivityApi = ({
	active,
	typeActivity,
	date,
	department,
	level,
	nameSearch,
	target,
	orderBy = 'createAt',
	sort = 'asc',
	previous,
	next,
	limit,
}) => {
	let ref = db.collection(ACTIVITY);
	if (nameSearch)
		ref = ref.where(
			'nameSearch',
			'array-contains-any',
			nonAccentVietnamese(nameSearch).split(/\s+/)
		);
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
	if (orderBy && sort) ref = ref.orderBy(orderBy, sort);
	if (previous) ref = ref.endBefore(previous[orderBy]);
	if (next) ref = ref.startAfter(next[orderBy]);

	return ref.limit(limit || 10).get();
};
export const getAllUserActivityApi = () => db.collection(USER_ACTIVITY).get();

//GET WITH WHERE
export const getUserByIds = (ids = []) =>
	db.collection(USER).where(documentId(), 'in', ids).get();

export const getActivityByIds = (ids = []) =>
	db.collection(ACTIVITY).where(documentId(), 'in', ids).get();
// export const getUserActivityByUids = (uids = []) =>
// 	db.collection(USER_ACTIVITY).where('uid', 'in', uids).get();
// export const getUserActivityByAcIds = (acIds = []) =>
// 	db.collection(USER_ACTIVITY).where('acId', 'in', acIds).get();
//ADD
export const addActivityApi = (id, data) =>
	db.collection(ACTIVITY).doc(id).set(data);

//UPDATE
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

//DELETE
export const deleteActivityApi = (id) => {
	return db.collection(ACTIVITY).doc(id).delete();
};
export const deleteUserApi = (id) => db.collection(USER).doc(id).delete();

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
				kq[doc.id] = serializeDoc(doc);
			});
		});
		return kq;
	});
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
						[`activities.${acId}`]: firebase.firestore.FieldValue.delete(),
						activityId: firebase.firestore.FieldValue.arrayRemove(acId),
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
export const cleanRegisterAcitiviyExpectMe = () => {
	return db
		.collection('register_activity')
		.get()
		.then((querySnapshot) => {
			querySnapshot.forEach((doc) => {
				if (doc.id !== 'oVO9xn7se5b7AHr8lurFIHWpsg83')
					doc.ref.delete().then(() => console.log('deleted id: ', doc.id));
			});
		});
};
export const getAllDataApi = async () => {
	const users = await db
		.collection('register_activity')
		.get()
		.then((querySnapshot) => {
			const kq = {};
			querySnapshot.forEach((doc) => {
				kq[doc.id] = { ...doc.data(), id: doc.id };
			});
			return kq;
		});
	const activities = await db
		.collection('news')
		.get()
		.then((querySnapshot) => {
			const kq = {};
			querySnapshot.forEach((doc) => {
				kq[doc.id] = { ...doc.data(), id: doc.id };
			});
			return kq;
		});

	Object.entries(users).forEach(([uid, user]) => {
		Object.entries(user.activities).forEach(([acid, activity]) => {
			users[uid].activities[acid] = { ...activity, ...activities[acid] };
		});
	});
	Object.keys(activities).forEach((acid) => {
		activities[acid].users = Object.values(users).filter((user) =>
			user.activityId.includes(acid)
		);
	});

	return { users, activities };
};
