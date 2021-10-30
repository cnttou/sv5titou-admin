import { createSlice } from '@reduxjs/toolkit';

import {
	addActivityAction,
	deleteActivityAction,
	fetchActivityAction,
	fetchAllActivityAction,
	logoutAction,
} from '../actions';

export const activity = createSlice({
	name: 'myActivity',
	initialState: {
		value: [],
		loading: 0,
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchActivityAction.fulfilled, (state, action) => {
				state.value = action.payload;
				state.loading = state.loading - 1;
			})
			.addCase(fetchActivityAction.pending, (state) => {
				state.loading = state.loading + 1;
			})
			.addCase(fetchActivityAction.rejected, (state) => {
				state.loading = state.loading - 1;
			})
			.addCase(fetchAllActivityAction.pending, (state) => {
				state.loading = state.loading + 1;
			})
			.addCase(fetchAllActivityAction.rejected, (state) => {
				state.loading = state.loading - 1;
			})
			.addCase(fetchAllActivityAction.fulfilled, (state, action) => {
				state.value = action.payload;
				state.loading = state.loading - 1;
			})
			.addCase(deleteActivityAction.fulfilled, (state, action) => {
				state.value = state.value.filter((c) => c.id != action.payload);
			})
			.addCase(addActivityAction.fulfilled, (state, action) => {
				let newValue = state.value.filter(
					(c) => c.id !== action.payload.id
				);
				newValue.push(action.payload);

				state.value = newValue;
			})
			.addCase(logoutAction, (state) => {
				state.value = [];
			});
	},
});

export default activity.reducer;
