import {
	deleteFileByFullPathApi,
	getFileApi,
	getFileFromAActivityApi,
} from '../../api/firebaseStorage';
import { createAsyncThunk } from '@reduxjs/toolkit';
import {
	getActivitiesApi,
	deleteDataApi,
	addDataApi,
	getRegisterActivityApi,
	registerActivityApi,
	removeRegisterActivityApi,
    getAllActivitiesApi,
} from '../../api/firestore';

export const fetchActivityAction = createAsyncThunk(
	'news/fetchNews',
	async (limit) => {
		let respone = await getActivitiesApi(limit);
		return respone;
	}
);
export const fetchAllActivityAction = createAsyncThunk(
	'news/fetchAllNews',
	async (limit) => {
		let respone = await getAllActivitiesApi(limit);
		return respone;
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

export const fetchRegisteredActivityAction = createAsyncThunk(
	'registerActivity/fetchRegisterActivity',
	async () => {
		let response = await getRegisterActivityApi();
		return response;
	}
);

export const registerActivityAction = createAsyncThunk(
	'registerActivity/registerActivity',
	async (data) => {
		let response = await registerActivityApi(data);
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
