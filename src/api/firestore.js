import { currentUser } from './authentication';
import firebase from './firebase';

const db = firebase.firestore();

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
const getUserByListId = (listUid) => {
	return db
		.collection('register_activity')
		.where(firebase.firestore.FieldPath.documentId(), 'in', listUid)
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
const getAllRegisterUserApi = (acId) => {
	return db
		.collection('news')
		.doc(acId)
		.collection('users')
		.get()
		.then(async (querySnapshot) => {
			if (querySnapshot.empty) return [];
			let dataUser = [];
			querySnapshot.forEach((doc) => {
				dataUser.push({
					...doc.data(),
					id: doc.id,
				});
			});
			//dataUser = [{ id, confirm, proof, studentCode, displayName}]
			if (dataUser.length === 0) return dataUser;

			// let activities = await getUserByListId(dataUser.map((c) => c.id));

			// return activities.map((c) => ({
			// 	...dataUser.find((d) => d.id === c.id),
			// 	...c,
			// }));
			return dataUser;
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
export const getAllActivitiesApi = () => {
	return db
		.collection('news')
		.get()
		.then((querySnapshot) => {
			let data = [];
			querySnapshot.forEach((doc) => {
				data.push({
					...doc.data(),
					id: doc.id,
				});
			});

			return Promise.all(
				data.map((c) => getAllRegisterUserApi(c.id))
			).then((res) => {
				return data.map((c, index) => ({ ...c, users: res[index] }));
			});
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
export const getUserDetailApi = (uid) => {
	return db
		.collection('register_activity')
		.doc(uid)
		.get()
		.then((res) => ({ ...res.data(), id: uid }))
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
	db.collection('news')
		.doc(acId)
		.collection('users')
		.doc(uid)
		.update({ confirm: true });
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
	console.log('confirm is', confirm);
	db.collection('news')
		.doc(acId)
		.collection('users')
		.doc(uid)
		.update({ confirm });
	return db
		.collection('register_activity')
		.doc(uid)
		.collection('activities')
		.doc(acId)
		.update({ confirm })
		.then(() => {
			return { uid, acId, confirm };
		})
		.catch((error) => {
			console.log(error.message);
		});
};
export const cancelConfirmMyProofApi = (acId) => {
	let uid = currentUser().uid;
	db.collection('news')
		.doc(acId)
		.collection('users')
		.doc(uid)
		.update({ confirm: false });
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
