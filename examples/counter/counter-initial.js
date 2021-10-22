import { useCallback, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import {
	decrement,
	decrementByAmount,
	increment,
	incrementByAmount,
} from './counterSlice';

export default function Counter() {
	const counter = useSelector((state) => state.counter.value);

	const dispatch = useDispatch();

	const [amount, setAmount] = useState(0);

	const handleDecrement = useCallback(() => dispatch(decrement()), [dispatch]);
	const handleIncrement = useCallback(() => dispatch(increment()), [dispatch]);

	const handleSetAmountBy = useCallback((event) => {
		const value = event.target.value;
		const newAmount = value ? parseInt(event.target.value, 10) : '';
		setAmount(newAmount);
	}, []);

	const handleDecrementByAmount = useCallback(
		() => Number.isFinite(amount) && dispatch(decrementByAmount(amount)),
		[dispatch, amount]
	);
	const handleIncrementByAmount = useCallback(
		() => Number.isFinite(amount) && dispatch(incrementByAmount(amount)),
		[dispatch, amount]
	);

	return (
		<div className="container">
			<main className="main">
				<h1 className="title">{`Counter: ${counter}`}</h1>
				<div className="grid">
					<button className="btn" type="button" onClick={handleDecrement}>
						-
					</button>
					<button className="btn" type="button" onClick={handleIncrement}>
						+
					</button>
				</div>

				<div className="grid">
					<div className="amountWrapper">
						<button
							className="btn"
							type="button"
							onClick={handleDecrementByAmount}
						>
							- by amount
						</button>
						<label className="label">
							<input
								className="input"
								type="number"
								onChange={handleSetAmountBy}
								value={amount}
								required
							/>
						</label>
						<button
							className="btn"
							type="button"
							onClick={handleIncrementByAmount}
						>
							+ by amount
						</button>
					</div>
				</div>
			</main>
		</div>
	);
}
