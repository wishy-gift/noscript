import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import * as gutenbergAPI from './gutenbergAPI';

const API_URL = `https://gutendex.com/books/`;

export const fetchBooks = createAsyncThunk(
	'gutenberg/fetchBooks',
	async (payload = {}) => {
		const { query, url } = payload;

		let resultUrl = '';

		if (url) {
			resultUrl = new URL(url);
		} else {
			resultUrl = new URL(API_URL);

			if (query) {
				resultUrl.searchParams.set('search', query);
			}
		}

		resultUrl.searchParams.set('languages', 'en');
		resultUrl.searchParams.set('topic', 'epic');

		const data = await gutenbergAPI.fetchBooks(resultUrl);

		return { data, url: resultUrl.href };
	}
);

export const gutenbergSlice = createSlice({
	name: 'gutenberg',
	initialState: {
		query: {},
		loading: 'idle',
	},
	extraReducers: (builder) => {
		builder.addCase(fetchBooks.pending, (state) => {
			state.loading = 'pending';
		});
		builder.addCase(fetchBooks.rejected, (state) => {
			state.loading = 'rejected';
		});
		builder.addCase(fetchBooks.fulfilled, (state, action) => {
			state.loading = 'idle';

			const { data, url } = action.payload;

			state.query = { url, data };
		});
	},
});

export default gutenbergSlice.reducer;
