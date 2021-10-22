import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { nanoid } from '@reduxjs/toolkit';
import classNames from 'classnames';

import usePayloadProxy from '@wishy-gift/noscript/dist/hooks/usePayloadProxy';
import Form from '@wishy-gift/noscript/dist/components/Form';
import Button from '@wishy-gift/noscript/dist/components/Button';

import { todosSelector, todosSlice, VISIBILITY_FILTERS } from './todosSlice';

const todosActions = todosSlice.actions;

export default function Home() {
	const visibilityFilter = useSelector((state) => state.todos.visibilityFilter);
	const todos = useSelector(todosSelector.selectAll);
	const payloadProxy = usePayloadProxy();

	const completedTodos = todos.filter((todo) => todo.completed);
	const incompleteTodos = todos.filter((todo) => !todo.completed);
	const incompleteTodosCount = incompleteTodos.length;

	let filteredTodos;

	switch (visibilityFilter) {
		case VISIBILITY_FILTERS.SHOW_ACTIVE:
			filteredTodos = incompleteTodos;
			break;

		case VISIBILITY_FILTERS.SHOW_COMPLETED:
			filteredTodos = completedTodos;
			break;

		default:
			filteredTodos = todos;
			break;
	}

	const allTodosChecked = todos.length && !incompleteTodosCount;

	const resetOnSubmit = useCallback((event) => event.target.reset(), []);

	return (
		<section className="todoapp">
			<header className="header">
				<h1>todos</h1>
				<Form
					className="new-todo-wrapper"
					actionType={todosActions.add().type}
					onSubmit={resetOnSubmit}
				>
					<input
						className="new-todo"
						name={payloadProxy.text}
						placeholder="What needs to be done?"
						autoFocus
					/>
					<input type="hidden" name={payloadProxy.id} value={nanoid()} />
				</Form>
			</header>
			<section className="main">
				<Button
					wrapperClassName={classNames('toggle-all-wrapper', {
						checked: allTodosChecked,
					})}
					className="toggle-all"
					action={todosActions.toggleAll()}
				/>
				<ul className="todo-list">
					{filteredTodos.map(({ id, text, completed, editing }) => (
						<li
							className={classNames({
								completed,
								editing,
							})}
							key={id}
						>
							<div className="view">
								<Button
									wrapperClassName={classNames('toggleWrapper', {
										checked: completed,
									})}
									className="toggle"
									action={todosActions.toggle({ id })}
								/>
								<label>{text}</label>
								<Button
									wrapperClassName="destroy-wrapper"
									className="destroy"
									action={todosActions.remove({ id })}
								/>
							</div>
							<Form
								className="edit-wrapper"
								actionType={todosActions.save().type}
								onSubmit={resetOnSubmit}
							>
								<input
									className="edit"
									defaultValue={text}
									name={payloadProxy.text}
								/>
								<input type="hidden" name={payloadProxy.id} value={id} />
							</Form>
							<Button
								wrapperClassName="toggle-edit-wrapper"
								className="toggle-edit"
								action={todosActions.toggleEdit({ id })}
							/>
						</li>
					))}
				</ul>
			</section>
			<footer className="footer">
				<span className="todo-count">
					<strong>{incompleteTodosCount}</strong>
					{incompleteTodosCount === 1 ? ' item ' : ' items '}
					left
				</span>
				<ul className="filters">
					<li>
						<Button
							className={classNames('link', {
								selected: visibilityFilter === VISIBILITY_FILTERS.SHOW_ALL,
							})}
							action={todosActions.setVisibilityFilter(
								VISIBILITY_FILTERS.SHOW_ALL
							)}
						>
							All
						</Button>
					</li>
					<li>
						<Button
							className={classNames('link', {
								selected: visibilityFilter === VISIBILITY_FILTERS.SHOW_ACTIVE,
							})}
							action={todosActions.setVisibilityFilter(
								VISIBILITY_FILTERS.SHOW_ACTIVE
							)}
						>
							Active
						</Button>
					</li>
					<li>
						<Button
							className={classNames('link', {
								selected:
									visibilityFilter === VISIBILITY_FILTERS.SHOW_COMPLETED,
							})}
							action={todosActions.setVisibilityFilter(
								VISIBILITY_FILTERS.SHOW_COMPLETED
							)}
						>
							Completed
						</Button>
					</li>
				</ul>
				<Button
					wrapperClassName={classNames('clear-completed', {
						visible: Boolean(completedTodos.length),
					})}
					className="clear-completed-btn"
					action={todosActions.clearCompleted()}
				>
					Clear completed
				</Button>
			</footer>
		</section>
	);
}
