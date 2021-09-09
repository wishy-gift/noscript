import { useMemo } from 'react';

import getPayloadProxy from '../utils/getPayloadProxy';

export default function usePayloadProxy(varName = 'payload') {
	const proxy = useMemo(() => getPayloadProxy(varName), [varName]);

	return proxy;
}
