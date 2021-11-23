import { createSlice } from '@reduxjs/toolkit';
import {
	addUserDetailAction,
	cancelConfirmProofAction,
	confirmProofAction,
	fetchActivityByUserAction,
	fetchUserActivityAction,
	getImageProofAction,
	logoutAction,
} from '../actions';

export const userActivity = createSlice({
	name: 'userActivity',
	initialState: {
		value: [],
		loading: 0,
		loadingListData: 0,
	},
	reducers: {
		addActivityDetailByUid(state, action) {
			const data = action.payload;
			const findActivity = (acId) =>
				data.find((activity) => activity.id === acId);
			state.value = state.value.map((user) => ({
				...user,
				listData: user.listData.map((activity) => ({
					...activity,
					...findActivity(activity.id),
				})),
			}));
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchActivityByUserAction.fulfilled, (state, action) => {
				const { response, userId } = action.payload;
				state.value = state.value.map((c) =>
					c.userId === userId ? { ...c, listData: response } : c
				);
				state.loadingListData = state.loadingListData - 1;
			})
			.addCase(fetchActivityByUserAction.pending, (state) => {
				state.loadingListData = state.loadingListData + 1;
			})
			.addCase(fetchActivityByUserAction.rejected, (state) => {
				state.loadingListData = state.loadingListData - 1;
			});
		builder.addCase(addUserDetailAction, (state, action) => {
			const { uid, ...data } = action.payload;
			state.value = state.value.map((c) =>
				c.userId === uid ? { ...c, ...data } : c
			);
		});
		builder
			.addCase(getImageProofAction.fulfilled, (state, action) => {
				const { uid, acId, images } = action.payload;
				state.value = state.value.map((c) => {
					if (c.userId === uid) {
						c.listData = c.listData.map((d) =>
							d.id === acId ? { ...d, images } : d
						);
					}
					return c;
				});
				state.loading = state.loading - 1;
			})
			.addCase(getImageProofAction.pending, (state) => {
				state.loading = state.loading + 1;
			})
			.addCase(getImageProofAction.rejected, (state) => {
				state.loading = state.loading - 1;
			});
		builder
			.addCase(fetchUserActivityAction.fulfilled, (state, action) => {
				state.value = action.payload;
				state.loading = state.loading - 1;
			})
			.addCase(fetchUserActivityAction.pending, (state) => {
				state.loading = state.loading + 1;
			})
			.addCase(fetchUserActivityAction.rejected, (state) => {
				state.loading = state.loading - 1;
			});
		builder
			.addCase(confirmProofAction.fulfilled, (state, action) => {
				const { uid, acId, confirm } = action.payload;

				state.value = state.value.map((c) => {
					if (c.userId === uid) {
						c.listData = c.listData.map((d) =>
							d.id === acId ? { ...d, confirm } : d
						);
					}
					return c;
				});

				state.loading = state.loading - 1;
			})
			.addCase(confirmProofAction.pending, (state) => {
				state.loading = state.loading + 1;
			})
			.addCase(confirmProofAction.rejected, (state) => {
				state.loading = state.loading - 1;
			});
		builder
			.addCase(cancelConfirmProofAction.fulfilled, (state, action) => {
				const { uid, acId, confirm } = action.payload;

				state.value = state.value.map((c) => {
					if (c.userId === uid) {
						c.listData = c.listData.map((d) =>
							d.id === acId ? { ...d, confirm } : d
						);
					}
					return c;
				});
				state.loading = state.loading - 1;
			})

			.addCase(cancelConfirmProofAction.pending, (state) => {
				state.loading = state.loading + 1;
			})

			.addCase(cancelConfirmProofAction.rejected, (state) => {
				state.loading = state.loading - 1;
			});
		builder.addCase(logoutAction, (state) => {
			state.value = [];
		});
	},
});
export const { addActivityDetailByUid } = userActivity.actions;
export default userActivity.reducer;
