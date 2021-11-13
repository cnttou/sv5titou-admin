import { createAction, createAsyncThunk } from '@reduxjs/toolkit';
import {
	addUserDetailApi,
	cancelConfirmMyProofApi,
	cancelConfirmProofApi,
	confirmProofApi,
	getUserActivityApi,
} from '../../api/firestore';

export const loginAction = createAction('LOGIN');

export const logoutAction = createAction('LOGOUT');

export const addUserDetailAction = createAsyncThunk(
	'user/addUserDetail',
	async ({uid, data}) => {
		let response = await addUserDetailApi(uid, data);
		return response;
	}
);

export const fetchUserActivityAction = createAsyncThunk(
	'user/fetchUserActivity',
	async () => {
		let response = await getUserActivityApi();
		return response;
	}
);
export const confirmProofAction = createAsyncThunk(
	'user/confirmProof',
	async ({ uid, acId }) => {
		return await confirmProofApi(uid, acId);
	}
);
export const cancelConfirmProofAction = createAsyncThunk(
	'user/cancelConfirmProof',
	async ({ uid, acId, confirm }) => {
		return await cancelConfirmProofApi(uid, acId, confirm);
	}
);
export const cancelMyConfirmProofAction = createAsyncThunk(
	'user/cancelMyConfirmProof',
	async (acId) => {
		return await cancelConfirmMyProofApi(acId);
	}
);
