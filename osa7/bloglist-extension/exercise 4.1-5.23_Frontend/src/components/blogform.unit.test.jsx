import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import BlogForm from "./BlogForm";
import { describe, beforeEach, test, vi } from "vitest";

describe("Testing Blog element", () => {
  let container;
  const mockBlog = vi.fn();

  beforeEach(() => {
    container = render(<BlogForm createBlog={mockBlog} />).container;
  });

  test("check addBlog callback function", async () => {
    const user = userEvent.setup();

    const inputTitle = container.querySelector("#blogTitle");
    await user.type(inputTitle, "Testing Blogs");

    const inputAuthor = container.querySelector("#blogAuthor");
    await user.type(inputAuthor, "Testauthor");

    const inputURL = container.querySelector("#blogUrl");
    await user.type(inputURL, "https://www.test.fi");

    const sendButton = screen.getByText("Submit Blog");
    await user.click(sendButton);

    screen.debug();
    // Log the actual calls to see what's happening
    console.log("Mock was called with:", mockBlog.mock.calls);

    expect(mockBlog).toHaveBeenCalledWith({
      title: "Testing Blogs",
      author: "Testauthor",
      url: "https://www.test.fi",
    });
  });
});
