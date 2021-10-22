import { useSelector } from 'react-redux';

import Form from '@wishy-gift/noscript/dist/components/Form';
import Button from '@wishy-gift/noscript/dist/components/Button';

import {
	decrement,
	decrementByAmount,
	increment,
	incrementByAmount,
	incrementBySurprise,
} from './counterSlice';

export default function Counter() {
	const counter = useSelector((state) => state.counter.value);

	return (
		<div className="container">
			<main className="main">
				<h1 className="title">{`Counter: ${counter}`}</h1>
				<div className="grid">
					<Button className="btn" action={decrement()}>
						-
					</Button>
					<Button className="btn" action={increment()}>
						+
					</Button>
				</div>

				<div className="grid">
					<Form className="form" payloadType="json">
						<button
							className="btn"
							name="actionType"
							value={decrementByAmount().type}
						>
							- by amount
						</button>
						<label className="label">
							<input className="input" name="payload" type="number" required />
						</label>
						<button
							className="btn"
							name="actionType"
							value={incrementByAmount().type}
						>
							+ by amount
						</button>
					</Form>
				</div>
				<div className="grid">
					<Button className="btn" actionCreator={incrementBySurprise}>
						Surprise
					</Button>
				</div>
			</main>
		</div>
	);
}
