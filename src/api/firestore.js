import firebase from './firebase';
const { documentId } = firebase.firestore.FieldPath;
import { compareString } from '../utils/compareFunction';
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
			ref = ref.where('targetSuccess', '==', []);
		else ref = ref.where('targetSuccess', '==', targetSuccess);
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
	if (!targetSuccess?.length) ref = ref.where('targetSuccess', '==', []);
	else ref = ref.where('targetSuccess', '==', targetSuccess);

	return ref.get();
};

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
		return ref
			.where(
				'nameSearch',
				'array-contains-any',
				nonAccentVietnamese(nameSearch).split(/\s+/)
			)
			.limit(7)
			.get();
	if (typeActivity) ref = ref.where('typeActivity', '==', typeActivity);
	if (active) ref = ref.where('active', '==', active === 'true');
	if (date) ref = ref.where('date', '==', date);
	if (department) ref = ref.where('department', '==', department);
	if (level) ref = ref.where('level', '==', level);
	if (target?.length)
		ref = ref.where(
			'target',
			'array-contains-any',
			target.sort((a, b) => compareString(a, b))
		);
	if (orderBy && sort)
		ref = ref.orderBy(orderBy || 'lastUpdate', sort || 'asc');
	if (previous) ref = ref.endBefore(previous[orderBy || 'lastUpdate']);
	if (next) ref = ref.startAfter(next[orderBy || 'lastUpdate']);

	return ref.limit(limit || 10).get();
};
export const getAllUserActivityApi = () => db.collection(USER_ACTIVITY).get();

export const addActivityApi = (id, data) =>
	db.collection(ACTIVITY).doc(id).set(data);

export const updateActivityApi = (id, data) =>
	db.collection(ACTIVITY).doc(id).update(data);
export const updateUserApi = (id, data) => {
	if (data.targetSuccess)
		data.targetSuccess.sort((a, b) => compareString(a, b));
	return db.collection(USER).doc(id).update(data);
};

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