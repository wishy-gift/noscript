import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';

export const VISIBILITY_FILTERS = {
	SHOW_ALL: 'SHOW_ALL',
	SHOW_COMPLETED: 'SHOW_COMPLETED',
	SHOW_ACTIVE: 'SHOW_ACTIVE',
};

const todosAdapter = createEntityAdapter();

export const todosSelector = todosAdapter.getSelectors((state) => state.todos);

export const todosSlice = createSlice({
	name: 'todos',
	initialState: todosAdapter.getInitialState({
		visibilityFilter: VISIBILITY_FILTERS.SHOW_ALL,
	}),
	reducers: {
		add: (state, action) => {
			const { id, text } = action.payload;

			todosAdapter.addOne(state, {
				id,
				text,
				completed: false,
				editing: false,
			});
		},
		toggleAll: (state) => {
			const allCompleted = state.ids.every(
				(id) => state.entities[id].completed
			);

			const completed = allCompleted ? false : true;

			state.ids.forEach((id) => {
				state.entities[id].completed = completed;
			});
		},
		toggle: (state, action) => {
			const { id } = action.payload;

			const todo = state.entities[id];

			if (!todo) {
				return;
			}

			todosAdapter.updateOne(state, {
				id,
				changes: { completed: !todo.completed },
			});
		},
		toggleEdit: (state, action) => {
			const { id } = action.payload;

			const todo = state.entities[id];

			if (!todo) {
				return;
			}

			todosAdapter.updateOne(state, {
				id,
				changes: { editing: !todo.editing },
			});
		},
		remove: (state, action) => {
			todosAdapter.removeOne(state, action.payload.id);
		},
		save: (state, action) => {
			const { id, text } = action.payload;

			todosAdapter.updateOne(state, {
				id,
				changes: {
					text,
					editing: false,
				},
			});
		},
		clearCompleted: (state, action) => {
			const completedIds = state.ids.filter(
				(id) => state.entities[id].completed
			);

			todosAdapter.removeMany(state, completedIds);
		},
		setVisibilityFilter: (state, action) => {
			state.visibilityFilter = action.payload;
		},
	},
});

// Action creators are generated for each case reducer function
export const {
	add,
	toggleAll,
	toggle,
	toggleEdit,
	remove,
	save,
	clearCompleted,
} = todosSlice.actions;

export default todosSlice.reducer;
