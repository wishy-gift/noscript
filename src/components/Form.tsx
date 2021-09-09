import React, { useEffect, useMemo } from 'react';
import { string, oneOf, node, func, oneOfType } from 'prop-types';
import { useSelector } from 'react-redux';

import useSubmit from '../hooks/useSubmit';
import { getActionCreatorName } from '../utils/actionCreators';

const Form = ({
	actionType,
	actionCreator,
	children,
	className,
	onSubmit,
	payloadType = 'object',
	...rest
}) => {
	// TODO: Consider accepting another slice somewhere in the lib
	const state = useSelector((state) => state);
	const handleSubmit = useSubmit(onSubmit);

	useEffect(() => {
		if (actionType && actionCreator) {
			throw new Error(`Can't have both actionType and actionCreator`);
		}
	}, [actionCreator, actionType]);

	const actionCreatorName = useMemo(() => {
		if (typeof actionCreator === 'function') {
			return getActionCreatorName(actionCreator);
		}

		return actionCreator;
	}, [actionCreator]);

	return (
		<form
			className={className}
			// encType="multipart/form-data"
			action=""
			method="post"
			onSubmit={handleSubmit}
			{...rest}
		>
			{actionType && (
				<input type="hidden" name="actionType" value={actionType} readOnly />
			)}
			{actionCreatorName && (
				<input
					type="hidden"
					name="actionCreatorName"
					value={actionCreatorName}
					readOnly
				/>
			)}
			<input type="hidden" name="payloadType" value={payloadType} readOnly />
			<input
				type="hidden"
				name="state"
				value={JSON.stringify(state)}
				readOnly
			/>
			{children}
		</form>
	);
};

Form.propTypes = {
	actionType: string,
	actionCreator: oneOfType([string, func]),
	children: node,
	className: string,
	onSubmit: func, // for potential side-effects client side
	payloadType: oneOf(['string', 'object', 'json']), // so we know how to treat the payload server-side
};

export default Form;
