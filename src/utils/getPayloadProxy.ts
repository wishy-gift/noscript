const getPayloadProxy = (prev = '') =>
	new Proxy(
		{},
		{
			get: function (_obj, prop, _value) {
				const isToPrimitive = prop === Symbol.toPrimitive;

				if (typeof prop !== 'string' && !isToPrimitive) {
					throw new Error('Only strings can be used with proxy');
				}

				if (
					prop === 'toString' ||
					prop === 'toJSON' ||
					prop === Symbol.toPrimitive
				) {
					return () => prev;
				}

				return getPayloadProxy(`${prev}[${String(prop)}]`);
			},
		}
	);

export default getPayloadProxy;
