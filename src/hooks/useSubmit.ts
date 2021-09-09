import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { serialize } from 'form-serialization';

import { getActionCreator } from '../utils/actionCreators';

export default function useSubmit<FormElement = HTMLFormElement>(
	onSubmit: Function
) {
	const dispatch = useDispatch();

	const handleSubmit = useCallback(
		(event: React.SyntheticEvent<FormElement, SubmitEvent>) => {
			// If this runs, we're client side and want to update things there instead of doing the POST request
			event.preventDefault();

			// This is done by `body-parser` on the server, `form-serialization` gives us an easy way to do it client side
			// so that we can keep the API the same
			const formData = serialize(event.target, {
				hash: true,
			});
			const { payload: rawPayload, payloadType } = formData;

			// This allows the `type` to be dependent on the button clicked
			// NOTE: `submitter` is not supported in IE or Safari
			let actionType = formData.actionType;

			const submitter = event.nativeEvent.submitter as
				| HTMLButtonElement
				| HTMLInputElement;

			if (!actionType && submitter) {
				actionType = submitter.value;
			}
			const actionCreatorName = formData.actionCreatorName;

			let payload;

			switch (payloadType) {
				case 'string':
				case 'object':
					payload = rawPayload;
					break;
				case 'json':
					payload = rawPayload ? JSON.parse(rawPayload) : {};
					break;

				default:
					break;
			}

			if (actionCreatorName) {
				const actionCreator = getActionCreator(actionCreatorName);

				if (!actionCreator) {
					throw new Error(
						`Couldn't find actionCreator with name ${actionCreatorName}`
					);
				}

				dispatch(actionCreator(payload));
			} else if (actionType) {
				dispatch({
					type: actionType,
					payload,
				});
			} else {
				throw new Error(`Missing action type`);
			}

			onSubmit?.(event);
		},
		[dispatch, onSubmit]
	);

	return handleSubmit;
}
