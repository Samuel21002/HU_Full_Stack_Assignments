import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Blog from "./Blog";
import { describe, beforeEach, test, vi } from "vitest";

describe("Testing Blog element", () => {
  let container;
  const mockIncrementLike = vi.fn();

  const blog = {
    id: "1234",
    title: "Testing Blogs",
    author: "Test Author",
    url: "http://www.test.fi",
    user: {
      id: "testuser",
    },
    likes: 10,
  };

  beforeEach(() => {
    container = render(
      <Blog
        blog={blog}
        incrementLike={mockIncrementLike}
        loggedInUser={"testuser"}
      />,
    ).container;
  });

  test("check title", () => {
    const element = screen.getAllByText("Testing Blogs");
    expect(element).toBeDefined();
  });

  test("check author, URL and likes in expanded details", async () => {
    const user = userEvent.setup();

    const detailsDiv = container.querySelector("#details_1234_id");
    expect(detailsDiv).toHaveStyle("display: none");

    const expandButton = screen.getByText("Expand");
    await user.click(expandButton);

    expect(screen.getByText("Test Author", { exact: false })).toBeVisible();
    expect(screen.getByText("www.test.fi", { exact: false })).toBeVisible();

    const likesText = screen.getByText("Likes:");
    expect(likesText.parentElement).toHaveTextContent("10");
    expect(screen.getByText("Collapse", { exact: false })).toBeInTheDocument();
  });

  test("check userclicks", async () => {
    const user = userEvent.setup();

    const likeButton = screen.getByText("Like");

    await user.click(likeButton);
    await user.click(likeButton);

    expect(mockIncrementLike.mock.calls).toHaveLength(2);
    expect(mockIncrementLike).toHaveBeenCalledTimes(2);
  });
});
