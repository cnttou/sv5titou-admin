import { currentUser } from './authentication';
import firebase from './firebase';

let storage = firebase.storage();
var storageRef = storage.ref();

var imagesRef = storageRef.child('images');
var imagesSlideRef = storageRef.child('images').child('slide');

export const taskEvent = firebase.storage.TaskEvent.STATE_CHANGED;

export const upFileApi = (id, file) => {
	let fileProofRef = imagesSlideRef.child(id);
	console.log('file upload', file);
	return fileProofRef.child(`/${file.name}`).put(file);
};

export const deleteFileByFullPathApi = (fullPath = '') => {
	let fileProofRef = storageRef.child(fullPath);

	return fileProofRef.delete();
};
export const deleteFolderImageActivityApi = (acId = '') => {
	let uid = currentUser().uid;
	let folderProofRef = imagesRef.child(uid).child(acId);
	return folderProofRef.listAll().then((res) => {
		let kq = [];
		res.items.forEach((itemRef) => {
			kq.push(itemRef.delete());
		});
		return Promise.all(kq);
	});
};

export const getFileFromAActivityApi = (acId) => {
	let uid = currentUser().uid;
	let fileProofRef = imagesRef.child(uid).child(acId);
	return fileProofRef.listAll().then(async (res) => {
		let kq = [];
		let extraRs = [];
		res.items.forEach((itemRef) => {
			extraRs.push({ name: itemRef.name, fullPath: itemRef.fullPath });
			kq.push(itemRef.getDownloadURL());
		});
		let images = await Promise.all(kq);
		return extraRs.map((c, index) => ({ ...c, url: images[index] }));
	});
};

export const getFileApi = (uid, acId) => {
	let fileProofRef = imagesRef.child(uid).child(acId);
	return fileProofRef
		.listAll()
		.then(async (res) => {
			let kq = [];
			let extraRs = [];
			res.items.forEach((itemRef) => {
				extraRs.push({
					name: itemRef.name,
					fullPath: itemRef.fullPath,
				});
				kq.push(itemRef.getDownloadURL());
			});
			let images = await Promise.all(kq);
			return extraRs.map((c, index) => ({ ...c, url: images[index] }));
		})
		.catch((error) => console.log(error.message));
};
