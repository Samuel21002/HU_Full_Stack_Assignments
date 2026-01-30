import PropTypes from 'prop-types';
import Todo from "./Todo";

const TodoList = ({ todos, deleteTodo, completeTodo }) => {
	return (
		<>
			{todos
				.map((todo) => (
					<Todo
						key={todo.id || todo.text}
						todo={todo}
						deleteTodo={deleteTodo}
						completeTodo={completeTodo}
					/>
				))
				.reduce((acc, cur, index) => [...acc, <hr key={index} />, cur], [])}
		</>
	);
};

TodoList.propTypes = {
	todos: PropTypes.arrayOf(PropTypes.object).isRequired,
	deleteTodo: PropTypes.func.isRequired,
	completeTodo: PropTypes.func.isRequired,
};

export default TodoList;
