import firebase from './firebase';
import { deleteProofImage } from './firebaseStorage';
const db = firebase.firestore();
const { documentId } = firebase.firestore.FieldPath;
const ACTIVITY = 'news';
const USER = 'user';
const USER_ACTIVITY = 'user_activity';

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
export const getAllActivityApi = () => db.collection(ACTIVITY).get();
export const getActivityApi = () => db.collection(ACTIVITY).where("active", "==", true).get();
export const getAllOtherActivityApi = () =>
	db.collection(ACTIVITY).where('typeActivity', '!=', 'register').get();
export const getAllRegisterActivityApi = () =>
	db.collection(ACTIVITY).where('typeActivity', '==', 'register').get();
export const getAllUserActivityApi = () => db.collection(USER_ACTIVITY).get();

//GET WITH WHERE
export const getUserByIds = (ids = []) =>
	db.collection(USER).where(documentId(), 'in', ids).get();
export const getActivityByIds = (ids = []) =>
	db.collection(ACTIVITY).where(documentId(), 'in', ids).get();
export const getUserActivityByUids = (uids = []) =>
	db.collection(USER_ACTIVITY).where('uid', 'in', uids).get();
export const getUserActivityByAcIds = (acIds = []) =>
	db.collection(USER_ACTIVITY).where('acId', 'in', acIds).get();
//ADD
export const addActivityApi = (id, data) =>
	db.collection(ACTIVITY).doc(id).set(data);

//UPDATE
export const updateActivityApi = (id, data) =>
	db.collection(ACTIVITY).doc(id).update(data);
export const updateUserApi = (id, data) =>
	db.collection(USER).doc(id).update(data);
export const updateUserActivityApi = (id, data) =>
	db.collection(USER_ACTIVITY).doc(id).update(data);

//DELETE
export const deleteActivityApi = (id) =>
	db.collection(ACTIVITY).doc(id).delete();
export const deleteUserApi = (id) =>
	db.collection(USER).doc(id).delete();





export const getSlideShowApi = () => {
	return db
		.collection('slide_show')
		.get()
		.then((querySnapshot) => {
			let data = [];
			querySnapshot.forEach((doc) => {
				const { seconds, nanoseconds } = doc.data().deadline;
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
	console.log('data add :', {
		uid,
		targetSuccess,
	});
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
						[`activities.${acId}`]:
							firebase.firestore.FieldValue.delete(),
						activityId:
							firebase.firestore.FieldValue.arrayRemove(acId),
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
					doc.ref
						.delete()
						.then(() => console.log('deleted id: ', doc.id));
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
