import { useMemo } from 'react';
import { Provider } from 'react-redux';
import App, { AppContext } from 'next/app';

import handleServerActions from '@wishy-gift/noscript/dist/utils/handleServerActions';
import { addActionCreators } from '@wishy-gift/noscript/dist/utils/actionCreators';

import getStore from './getStore';

import { fetchBooks } from './gutenberg/gutenbergSlice';
import { incrementBySurprise } from './counter/counterSlice';

// these are action creators, and needs to be passed in to `addActionCreators`
// so that the correct action creator can be run server side
addActionCreators({ fetchBooks, incrementBySurprise });

function MyApp({ Component, pageProps, preloadedState, isServer }) {
	const reduxStore = useMemo(
		() => getStore(preloadedState, isServer),
		[isServer, preloadedState]
	);

	return (
		<Provider store={reduxStore}>
			<Component {...pageProps} />
		</Provider>
	);
}

/**
 * @type {Function}
 * @param {AppContext} appContext
 */
MyApp.getInitialProps = async (appContext) => {
	const appProps = await App.getInitialProps(appContext);

	const req = appContext.ctx.req;
	const isServer = Boolean(req);
	const isPost = req?.method.toLowerCase() === 'post';

	let preloadedState;

	// One of the basic assumptions we make, is that the only reason why someone would do a POST-request to a view route
	// is because they've disabled JS, and an action has been dispatched
	// this way we know when to update the client state for our users server-side, and re-render the page
	if (isPost) {
		const rawBody = req.read().toString();

		const result = await handleServerActions({
			rawBody,
			getReduxStore: (state) => {
				return getStore(state, isServer);
			},
		});

		preloadedState = result.state;
	}

	const pageProps = {
		isPost,
		...appProps.pageProps,
	};

	return {
		...appProps,
		pageProps,
		preloadedState,
		isServer,
	};
};

export default MyApp;
