import { createSlice } from '@reduxjs/toolkit';
import {
	addSlideShowAction,
	deleteSlideShowAction,
	fetchSlideShowAction,
} from '../actions';

const slideShow = createSlice({
	name: 'slideShow',
	initialState: {
		value: [],
		loading: 0,
		deleting: 0,
		uploading: 0,
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchSlideShowAction.fulfilled, (state, action) => {
				state.value = action.payload;
				state.loading = state.loading - 1;
			})
			.addCase(fetchSlideShowAction.rejected, (state, action) => {
				state.loading = state.loading - 1;
			})
			.addCase(fetchSlideShowAction.pending, (state, action) => {
				state.loading = state.loading + 1;
			});
		builder
			.addCase(addSlideShowAction.fulfilled, (state, action) => {
				const { docId, ...slideShow } = action.payload;

				const newState = state.value.filter((c) => c.id !== docId);
				newState.push(slideShow);

				state.value = newState;
				state.uploading = state.uploading - 1;
			})
			.addCase(addSlideShowAction.rejected, (state, action) => {
				state.uploading = state.uploading - 1;
			})
			.addCase(addSlideShowAction.pending, (state, action) => {
				state.uploading = state.uploading + 1;
			});
		builder
			.addCase(deleteSlideShowAction.fulfilled, (state, action) => {
				const docId = action.payload;

				state.value = state.value.filter((c) => c.id !== docId);

				state.deleting = state.deleting - 1;
			})
			.addCase(deleteSlideShowAction.rejected, (state, action) => {
				state.deleting = state.deleting - 1;
			})
			.addCase(deleteSlideShowAction.pending, (state, action) => {
				state.deleting = state.deleting + 1;
			});
	},
});

export default slideShow.reducer;
