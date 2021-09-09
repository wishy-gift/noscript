import React from 'react';
import { node, string, shape, func, any, oneOfType } from 'prop-types';

import Form from './Form';

const Button = ({
	wrapperClassName,
	action,
	actionCreator,
	payload,
	children,
	onSubmit,
	wrapperParams = {},
	...params
}) => {
	const resultPayload = payload ?? action?.payload;

	return (
		<Form
			className={wrapperClassName}
			actionType={action?.type}
			actionCreator={actionCreator}
			payloadType="json"
			onSubmit={onSubmit}
			{...wrapperParams}
		>
			{typeof resultPayload !== 'undefined' && (
				<input
					type="hidden"
					name="payload"
					value={JSON.stringify(resultPayload)}
				/>
			)}
			<button {...params}>{children}</button>
		</Form>
	);
};

Button.propTypes = {
	wrapperClassName: string,
	className: string,
	action: shape({
		type: string.isRequired,
	}),
	actionCreator: oneOfType([string, func]),
	payload: any,
	children: node,
	onSubmit: func,
};

export default Button;
