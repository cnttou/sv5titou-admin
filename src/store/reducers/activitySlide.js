import { createSlice } from '@reduxjs/toolkit';

import {
	addActivityAction,
	addUserToActivityAction,
	deleteActivityAction,
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
			.addCase(fetchAllActivityAction.pending, (state) => {
				state.loading = state.loading + 1;
			})
			.addCase(fetchAllActivityAction.rejected, (state) => {
				state.loading = state.loading - 1;
			})
			.addCase(fetchAllActivityAction.fulfilled, (state, action) => {
				state.value = action.payload;
				state.loading = state.loading - 1;
			});
		builder.addCase(deleteActivityAction.fulfilled, (state, action) => {
			state.value = state.value.filter((c) => c.id != action.payload);
		});
		builder.addCase(addActivityAction.fulfilled, (state, action) => {
			let newValue = state.value.filter(
				(c) => c.id !== action.payload.id
			);
			newValue.push(action.payload);

			state.value = newValue;
		});
		builder.addCase(addUserToActivityAction.fulfilled, (state, action) => {
			const { acId, uid, ...rest } = action.payload;

			state.value = state.value.map((c) =>
				c.id === acId
					? {
							...c,
							users: c.users.map((d) =>
								d.id === uid ? { ...d, ...rest } : d
							),
					  }
					: c
			);
		});
		builder.addCase(logoutAction, (state) => {
			state.value = [];
		});
	},
});

export default activity.reducer;
