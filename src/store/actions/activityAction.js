import {
	deleteFileByFullPathApi,
	getFileApi,
	getFileFromAActivityApi,
} from '../../api/firebaseStorage';
import { createAsyncThunk } from '@reduxjs/toolkit';
import {
	deleteDataApi,
	addDataApi,
    deleteActivityOfUserByIdApi,
} from '../../api/firestore';


export const createOrUpdateActivityAction = createAsyncThunk(
	'news/addNews',
	async ({ data, docId }) => {
		let response = await addDataApi('news', data, docId);
		console.log('response add activity: ', response);
		return response;
	}
);

export const deleteActivityAction = createAsyncThunk(
	'news/deleteNews',
	async (acid) => {
        deleteActivityOfUserByIdApi(acid);
		let response = await deleteDataApi('news', acid);
		return response;
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
