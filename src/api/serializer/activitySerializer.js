export function activitiesSerializer(querySnapshot) {
	let kq = [];
	querySnapshot.forEach((doc) => {
		kq.push({
			...doc.data(),
			id: doc.id,
		});
	});
	return kq;
}
export function activitySerializer(docSnap) {
	let kq = {};
	if (docSnap.exists()) {
		kq = { ...docSnap.data(), id: docSnap.id };
	} else {
		console.log('No such document!');
	}
	return kq;
}
