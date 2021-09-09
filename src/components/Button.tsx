import React, { ReactNode } from 'react';

import Form from './Form';

interface ButtonProps {
	wrapperClassName?: string;
	wrapperParams?: object;
	className?: string;
	action: {
		type: string;
		payload?: any;
	};
	actionCreator: string | Function;
	payload: any;
	children: ReactNode;
	onSubmit: Function;
}

const Button = ({
	wrapperClassName,
	action,
	actionCreator,
	payload,
	children,
	onSubmit,
	wrapperParams = {},
	...params
}: ButtonProps) => {
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

export default Button;
