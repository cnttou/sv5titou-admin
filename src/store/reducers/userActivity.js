import { createSlice } from '@reduxjs/toolkit';
import {
	addUserDetailAction,
	updateConfirmProofAction,
	getAllDataAction,
	getImageProofAction,
	logoutAction,
	createOrUpdateActivityAction,
	deleteActivityAction,
} from '../actions';

export const userActivity = createSlice({
	name: 'userActivity',
	initialState: {
		value: [],
		loading: 0,
		loadingListData: 0,
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
				const { users } = action.payload;
				state.value = Object.values(users);
				state.loading = state.loading - 1;
			});
		builder.addCase(addUserDetailAction.fulfilled, (state, action) => {
			const { uid, targetSuccess } = action.payload;
			state.value = state.value.map((user) =>
				user.userId === uid ? { ...user, targetSuccess } : user
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
			.addCase(updateConfirmProofAction.fulfilled, (state, action) => {
				const { uid, acId, confirm } = action.payload;

				state.value = state.value.map((user) => {
					if (user.userId === uid)
						user.activities[acId].confirm = confirm;
					return user;
				});

				state.loading = state.loading - 1;
			})
			.addCase(updateConfirmProofAction.pending, (state) => {
				state.loading = state.loading + 1;
			})
			.addCase(updateConfirmProofAction.rejected, (state) => {
				state.loading = state.loading - 1;
			});
		builder.addCase(
			createOrUpdateActivityAction.fulfilled,
			(state, action) => {
				const { acId } = action.payload;
				state.value = state.value.map((user) => {
					if (user.userId === uid && user.activities[acId])
						user.activities[acId] = {
							...user.activities[acId],
							...action.payload,
						};
					return user;
				});
			}
		);
		builder.addCase(deleteActivityAction.fulfilled, (state, action) => {
			const acId = action.payload;
			state.value = state.value.map((user) => {
				if (user.activities[acId]) delete user.activities[acId];
				return user;
			});
			state.value = state.value.filter((c) => c.id != action.payload);
		});
		builder.addCase(logoutAction, (state) => {
			state.value = [];
		});
	},
});
export default userActivity.reducer;
