import { configureStore } from '@reduxjs/toolkit';
import activity from './reducers/activitySlide';
import slideShow from './reducers/slideShowSlide';
import userActivity from './reducers/userActivity';

const store = configureStore({
	reducer: {
		activity,
		userActivity,
		slideShow,
	},
});

export default store;
