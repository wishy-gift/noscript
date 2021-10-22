import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
	value: 0,
};

const surpriseFactor = 50;

export const incrementBySurprise = createAsyncThunk(
	'counter/incrementBySurprise',
	async () => {
		const rand =
			Math.round(Math.random() * surpriseFactor) - surpriseFactor * 0.5;

		return rand;
	}
);

export const counterSlice = createSlice({
	name: 'counter',
	initialState,
	reducers: {
		increment: (state) => {
			state.value += 1;
		},
		decrement: (state) => {
			state.value -= 1;
		},
		incrementByAmount: (state, action) => {
			state.value += action.payload;
		},
		decrementByAmount: (state, action) => {
			state.value -= action.payload;
		},
	},
	extraReducers: (builder) => {
		builder.addCase(incrementBySurprise.fulfilled, (state, action) => {
			state.value += action.payload;
		});
	},
});

export const { increment, decrement, incrementByAmount, decrementByAmount } =
	counterSlice.actions;

export default counterSlice.reducer;
