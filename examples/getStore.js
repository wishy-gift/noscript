import { configureStore } from '@reduxjs/toolkit';

import counterReducer from './counter/counterSlice';
import gutenbergReducer from './gutenberg/gutenbergSlice';
import todosReducer from './todos/todosSlice';

let store;

export default function getStore(preloadedState = {}, isServer) {
	if (isServer) {
		return configureStore({
			reducer: {
				counter: counterReducer,
				todos: todosReducer,
				gutenberg: gutenbergReducer,
			},
			preloadedState,
		});
	}

	store ??= configureStore({
		reducer: {
			counter: counterReducer,
			todos: todosReducer,
			gutenberg: gutenbergReducer,
		},
		preloadedState,
	});

	return store;
}
