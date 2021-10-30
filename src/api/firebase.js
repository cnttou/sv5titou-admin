import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

const firebaseConfig = {
	apiKey: 'AIzaSyCEVtGYAdr8N1LpJfV-L5RQ0rYrmN8kC1o',
	authDomain: 'sv5titou.firebaseapp.com',
	projectId: 'sv5titou',
	storageBucket: 'sv5titou.appspot.com',
	messagingSenderId: '489533321856',
	appId: '1:489533321856:web:2089d0e23f563d9d7eac65',
	measurementId: 'G-LMZ2C8H7ED',
};

firebase.initializeApp(firebaseConfig);

export default firebase;