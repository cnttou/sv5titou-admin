import { currentUser } from './authentication';
import firebase from './firebase';

const db = firebase.firestore();

export const addUrlImageApi = (fileName, acId = '') => {
	let uId = firebase.auth().currentUser.uid;
	return db
		.collection('register_activity')
		.doc(uId)
		.collection('activities')
		.doc(acId)
		.update({
			images: firebase.firestore.FieldValue.arrayUnion(fileName),
		});
};
export const removeUrlImageApi = (fileName, acId = '') => {
	let uId = firebase.auth().currentUser.uid;
	return db
		.collection('register_activity')
		.doc(uId)
		.collection('activities')
		.doc(acId)
		.update({
			images: firebase.firestore.FieldValue.arrayRemove(fileName),
		});
};
const getActivityByListId = (listId) => {
	return db
		.collection('news')
		.where(firebase.firestore.FieldPath.documentId(), 'in', listId)
		.get()
		.then((querySnapshot) => {
			let listData = [];
			querySnapshot.forEach(async (doc) => {
				listData.push({
					...doc.data(),
					id: doc.id,
				});
			});
			return listData;
		});
};
export const getAllRegisterActivityApi = (userId) => {
	let uId = userId || currentUser().uid;

	return db
		.collection('register_activity')
		.doc(uId)
		.collection('activities')
		.get()
		.then(async (querySnapshot) => {
			let dataUser = [];
			querySnapshot.forEach((doc) => {
				dataUser.push({
					...doc.data(),
					id: doc.id,
				});
			});

			if (dataUser.length === 0) return dataUser;

			let activities = await getActivityByListId(
				dataUser.map((c) => c.id)
			);

			return activities.map((c) => ({
				...dataUser.find((d) => d.id === c.id),
				...c,
			}));
		})
		.catch((error) => console.log(error.message));
};
export const removeRegisterActivityApi = (acId) => {
	let uId = firebase.auth().currentUser.uid;
	return db
		.collection('register_activity')
		.doc(uId)
		.collection('activities')
		.doc(acId)
		.delete()
		.then(() => acId);
};
export const registerActivityApi = (dataActivity) => {
	let uId = currentUser().uid;
	let acId = dataActivity.id;
	let activityRef = db.collection('news').doc(uId);

	let data = {
		confirm: false,
		proof: false,
		...dataActivity,
		activityRef,
	};
	return db
		.collection('register_activity')
		.doc(uId)
		.collection('activities')
		.doc(acId)
		.set(data)
		.then((res) => {
			console.log('res of register: ', res);
			return { ...data, activityRef: activityRef.path || '' };
		});
};
export const getDetailActivityApi = (docId = '') => {
	return db
		.collection('news')
		.doc(docId)
		.get()
		.then((doc) => {
			let data = {
				...doc.data(),
				id: doc.id,
			};
			return data;
		});
};
export const getAllActivitiesApi = (limit = 25) => {
	return db
		.collection('news')
		.limit(limit)
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
export const getActivitiesApi = (limit = 25) => {
	return db
		.collection('news')
		.where('active', '==', true)
		.limit(limit)
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
			.then(() => ({ ...data, id: docId }));
	}
};
export const addUserDetailApi = (uid, data) => {
	console.log('data add :', {
		email: currentUser().email,
		userId: currentUser().uid,
		...data,
	});
	return db
		.collection('register_activity')
		.doc(uid)
		.set(data, { merge: true })
		.then(() => ({ ...data, uid }))
		.catch((err) => console.log(err.message));
};
export const getUserDetailApi = () => {
	return db
		.collection('register_activity')
		.doc(currentUser().uid)
		.get()
		.then((res) => res.data())
		.catch((err) => console.log(err.message));
};
export const getUserActivityApi = () => {
	return db
		.collection('register_activity')
		.get()
		.then((querySnapshot) => {
			let list = [];
			querySnapshot.forEach((doc) => {
				list.push(doc.data());
			});
			return list;
		})
		.then((rs) => {
			return Promise.all(
				rs.map((c) => getAllRegisterActivityApi(c.userId))
			).then((res) => {
				return rs.map((c, index) => ({ ...c, listData: res[index] }));
			});
		});
};
export const confirmProofApi = (uid, acId) => {
	return db
		.collection('register_activity')
		.doc(uid)
		.collection('activities')
		.doc(acId)
		.update({ confirm: true })
		.then(() => {
			return { uid, acId, confirm: true };
		})
		.catch((error) => {
			console.log(error.message);
		});
};
export const cancelConfirmProofApi = (uid, acId, confirm) => {
	return db
		.collection('register_activity')
		.doc(uid)
		.collection('activities')
		.doc(acId)
		.update({ confirm })
		.then(() => {
			return { uid, acId, confirm: false };
		})
		.catch((error) => {
			console.log(error.message);
		});
};
export const cancelConfirmMyProofApi = (acId) => {
	let uid = currentUser().uid;
	return db
		.collection('register_activity')
		.doc(uid)
		.collection('activities')
		.doc(acId)
		.update({ confirm: false })
		.then(() => {
			return { acId, confirm: false };
		})
		.catch((error) => {
			console.log(error.message);
		});
};
