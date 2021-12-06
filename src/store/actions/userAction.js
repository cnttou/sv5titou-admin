import { createAction, createAsyncThunk } from '@reduxjs/toolkit';
import {
	addUserDetailApi,
	cancelConfirmProofApi,
	confirmProofApi,
} from '../../api/firestore';

export const loginAction = createAction('LOGIN');

export const logoutAction = createAction('LOGOUT');

export const addUserDetailAction = createAsyncThunk(
	'user/addUserDetail',
	async ({uid, targetSuccess}) => {
		let response = await addUserDetailApi(uid, targetSuccess);
		return response;
	}
);
export const updateConfirmProofAction = createAsyncThunk(
	'user/confirmProof',
	async ({ uid, acId, confirm }) => {
		return await confirmProofApi(uid, acId, confirm);
	}
);
