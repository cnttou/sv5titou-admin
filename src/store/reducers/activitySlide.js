import { createSlice } from '@reduxjs/toolkit';

import {
	createOrUpdateActivityAction,
	updateConfirmProofAction,
	deleteActivityAction,
	getAllDataAction,
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
			.addCase(getAllDataAction.pending, (state) => {
				state.loading = state.loading + 1;
			})
			.addCase(getAllDataAction.rejected, (state) => {
				state.loading = state.loading - 1;
			})
			.addCase(getAllDataAction.fulfilled, (state, action) => {
				const { activities } = action.payload;
				state.value = Object.values(activities);
				state.loading = state.loading - 1;
			});
		builder
			.addCase(updateConfirmProofAction.fulfilled, (state, action) => {
				const { uid, acId, confirm } = action.payload;

				state.value = state.value.map((activity) => {
					if (activity.id === acId)
						activity.users = activity.users.map((user) => {
							if (user.uid === uid)
								user.activities[acId].confirm = confirm;
							return user;
						});

					return activity;
				});

				state.loading = state.loading - 1;
			})
			.addCase(updateConfirmProofAction.pending, (state) => {
				state.loading = state.loading + 1;
			})
			.addCase(updateConfirmProofAction.rejected, (state) => {
				state.loading = state.loading - 1;
			});
		builder.addCase(deleteActivityAction.fulfilled, (state, action) => {
			state.value = state.value.filter((c) => c.id != action.payload);
		});
		builder.addCase(
			createOrUpdateActivityAction.fulfilled,
			(state, action) => {
				let isExist = false;
				state.value.forEach((activity, index) => {
					if (activity.id === action.payload.id) {
						state.value[index] = {
							...state.value[index],
							...action.payload,
						};
						isExist = true;
					}
				});
				if (isExist === false) state.value.push({...action.payload, users: []});
			}
		);
		builder.addCase(logoutAction, (state) => {
			state.value = [];
		});
	},
});

export default activity.reducer;
