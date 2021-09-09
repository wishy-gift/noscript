import { configureStore } from '@reduxjs/toolkit';
import qs from 'qs';

import { getActionCreator } from './actionCreators';

type Data = {
	actionType?: string;
	actionCreatorName?: string;
	payloadType: 'string' | 'object' | 'json';
	state?: string;
	payload?: any;
};

type ServerActionsParams = {
	data: Data;
	bufferString: string;
	getReduxStore: (state: any) => ReturnType<typeof configureStore>;
};

const handleServerActions = async ({
	data: preParsedData, // if pre-parsed
	bufferString, // if not pre-parsed
	getReduxStore,
}: ServerActionsParams) => {
	if (typeof getReduxStore !== 'function') {
		console.error(`Missing getReduxStore`);
		throw new Error(`Missing getReduxStore`);
	}

	let data;
	if (preParsedData) {
		data = preParsedData;
	} else if (bufferString) {
		try {
			data = qs.parse(bufferString);
		} catch (error) {
			console.error(`Couldn't parse bufferString`, bufferString);
		}
	} else {
		throw new Error(
			`Pre-parsed data or bufferString is required for handleServerActions`
		);
	}

	const actionType = data.actionType;
	const actionCreatorName = data.actionCreatorName;
	const payloadType = data.payloadType;
	let payload, state;

	try {
		state = data.state ? JSON.parse(data.state) : {};

		switch (payloadType) {
			case 'string':
			case 'object':
				payload = data.payload;
				break;
			case 'json':
				payload = data.payload ? JSON.parse(data.payload) : {};
				break;

			default:
				break;
		}
	} catch (error) {
		console.error(`Couldn't parse state or payload`, error);
	}

	const reduxStore = getReduxStore(state);

	if (typeof actionCreatorName === 'string') {
		const actionCreator = getActionCreator(actionCreatorName);

		if (typeof actionCreator === 'function') {
			await reduxStore.dispatch(actionCreator(payload));
		}
	} else if (typeof actionType === 'string') {
		reduxStore.dispatch({
			type: actionType,
			payload,
		});
	}

	return {
		reduxStore,
		preloadedState: reduxStore.getState(),
	};
};

export default handleServerActions;
