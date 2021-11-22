import {
	deleteFileByFullPathApi,
	getFileApi,
	getFileFromAActivityApi,
} from '../../api/firebaseStorage';
import { createAsyncThunk } from '@reduxjs/toolkit';
import {
	deleteDataApi,
	addDataApi,
	removeRegisterActivityApi,
	getAllActivitiesApi,
	getUserDetailApi,
	getAllRegisterUserApi,
	confirmProofByListStudentCodeApi,
} from '../../api/firestore';

export const fetchAllActivityAction = createAsyncThunk(
	'news/fetchAllNews',
	async () => {
		let respone = await getAllActivitiesApi();
		return respone;
	}
);

export const fetchUserByActivityAction = createAsyncThunk(
	'news/fetchUserByActivity',
	async (acId) => {
		let respone = await getAllRegisterUserApi(acId);
		return { respone, acId };
	}
);
export const comfirmActivityBuListStudentCodeAction = createAsyncThunk(
	'news/comfirmByListStudentCode',
	async ({ acId, listUserId }) => {
		let respone = await confirmProofByListStudentCodeApi(acId, listUserId);
		return respone;
	}
);

export const addUserToActivityAction = createAsyncThunk(
	'news/addUserToNews',
	async ({ uid, acId }) => {
		let response = await getUserDetailApi(uid);
		return { acId, uid, ...response };
	}
);

export const addActivityAction = createAsyncThunk(
	'news/addNews',
	async ({ data, docId }) => {
		let response = await addDataApi('news', data, docId);
		console.log('response add activity: ', response);
		return response;
	}
);

export const deleteActivityAction = createAsyncThunk(
	'news/deleteNews',
	async (docId) => {
		let response = await deleteDataApi('news', docId);
		return response;
	}
);

export const removeRegisteredActivityAction = createAsyncThunk(
	'registerActivity/removeRegisterActivity',
	async (acId) => {
		return await removeRegisterActivityApi(acId);
	}
);

export const getImageProofByActivityAction = createAsyncThunk(
	'registerActivity/getImageProofByActivityAction',
	async (acId, thunkAPI) => {
		let response = await getFileFromAActivityApi(acId);
		return { images: response, acId };
	}
);
export const getImageProofAction = createAsyncThunk(
	'registerActivity/getImageProofAction',
	async ({ uid, acId }, thunkAPI) => {
		let response = await getFileApi(uid, acId);
		console.log('typeof response', typeof response);
		return { images: response, uid, acId };
	}
);

export const deleteImageByFullPathAction = createAsyncThunk(
	'registerActivity/deleteImageByFullPath',
	async ({ path, acId }, thunkAPI) => {
		await deleteFileByFullPathApi(path);
		return { path, acId };
	}
);
