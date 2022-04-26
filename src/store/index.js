import { configureStore } from '@reduxjs/toolkit';
import slideShow from './reducers/slideShowSlide';

const store = configureStore({
	reducer: {
		slideShow,
	},
});

export default store;
