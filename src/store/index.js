import { configureStore } from '@reduxjs/toolkit';
import activitySlide from './reducers/activitySlide';
import userActivity from './reducers/userActivity';

const store = configureStore({
	reducer: {
		activity: activitySlide,
		userActivity: userActivity,
	},
});

export default store;
