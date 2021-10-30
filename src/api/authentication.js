import firebase from './firebase';


export const checkLogin = () => {
	if (firebase.auth()?.currentUser?.email) return true;
	else return false;
};

export const auth = () => firebase.auth();

export const currentUser = () => firebase.auth()?.currentUser;

export const logoutApi = () => {
	return firebase.auth().signOut();
};

export const loginByGoogle = async () => {
	var provider = new firebase.auth.GoogleAuthProvider();
	provider.setCustomParameters({
		login_hint: '1234567890abc@ou.edu.vn',
	});

	return firebase.auth().signInWithPopup(provider);
};

export const loginWithEmailPasswordApi = (email, password) => {
	return firebase.auth().signInWithEmailAndPassword(email, password);
};
