import { createAsyncThunk } from '@reduxjs/toolkit';
import { addDataApi, deleteDataApi, getSlideShowApi, getAllDataApi } from '../../api/firestore';


export * from './userAction';
export * from './activityAction';

export const getAllDataAction = createAsyncThunk(
	'activity_users/getAll',
	async () => {
		let respone = await getAllDataApi();
		return respone;
	}
);
export const addSlideShowAction = createAsyncThunk(
	'slideShow/addSlideShow',
	async ({data, docId}) => {
		let respone = await addDataApi('slide_show', data, docId);
		return respone;
	}
);
export const fetchSlideShowAction = createAsyncThunk(
	'slideShow/fetchSlideShow',
	async () => {
		let respone = await getSlideShowApi();
		return respone;
	}
);
export const deleteSlideShowAction = createAsyncThunk(
	'slideShow/deleteSlideShow',
	async (docId) => {
		let respone = await deleteDataApi("slide_show", docId);
		return respone;
	}
);