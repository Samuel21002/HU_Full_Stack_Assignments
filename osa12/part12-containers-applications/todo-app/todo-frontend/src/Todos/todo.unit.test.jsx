import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Todo from "./Todo";
import { describe, beforeEach, test, vi, expect } from "vitest";

describe("Testing Todo element", () => {
	const mockDeleteTodo = vi.fn();
	const mockCompleteTodo = vi.fn();

	const todo = {
		text: "Testing Element",
		done: false,
	};

	beforeEach(() => {
		render(
			<Todo
				todo={todo}
				deleteTodo={mockDeleteTodo}
				completeTodo={mockCompleteTodo}
			/>,
		);
	});

	test("check element contains name, not done text and Set as done button", () => {
		const nameElement = screen.getByText("Testing Element");
		expect(nameElement).toBeDefined();

		const notDoneText = screen.getByText("This todo is not done");
		expect(notDoneText).toBeInTheDocument();

		const setAsDoneButton = screen.getByText("Set as done");
		expect(setAsDoneButton).toBeInTheDocument();
	});

	test("check clicking Set as done displays This todo is done", async () => {
		const user = userEvent.setup();

		// Verify initial state
		expect(screen.getByText("This todo is not done")).toBeInTheDocument();

		const setAsDoneButton = screen.getByText("Set as done");
		await user.click(setAsDoneButton);

		// Verify completeTodo was called
		expect(mockCompleteTodo).toHaveBeenCalledTimes(1);
		expect(mockCompleteTodo).toHaveBeenCalledWith(todo);

		// Re-render with done: true to simulate the state change
		render(
			<Todo
				todo={{ ...todo, done: true }}
				deleteTodo={mockDeleteTodo}
				completeTodo={mockCompleteTodo}
			/>,
		);

		const doneText = screen.getByText("This todo is done");
		expect(doneText).toBeInTheDocument();
	});
});
