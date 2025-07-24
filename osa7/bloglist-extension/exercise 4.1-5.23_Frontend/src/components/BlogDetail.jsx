import { useUserValue } from "../reducers/userContext";
import useField from "../customHook";
import { Link, useNavigate } from "react-router-dom";

import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

const BlogDetail = ({ blog, incrementLike, addComment, removeBlog }) => {
  const comment = useField("text");
  const navigateTo = useNavigate();
  const userValue = useUserValue();
  const loggedInUser = userValue ? userValue.id : null;

  const loggedInUserOwned =
    blog && blog.user && loggedInUser === String(blog.user.id);

  const like = () => {
    incrementLike(blog.id);
  };

  const remove = () => {
    removeBlog(blog);
    navigateTo("/");
  };

  const submitComment = (event) => {
    event.preventDefault();
    addComment(blog.id, comment.attributes.value);
    comment.resetfield();
  };

  const visibility = { display: "block" };

  const blogStyle = {
    paddingTop: 10,
    padding: "20px",
    border: "1px solid grey",
    borderRadius: "10px",
    marginBottom: 5,
  };

  const detailStyle = {
    marginTop: 5,
    marginBottom: 5,
    paddingLeft: 10,
  };

  if (!blog) {
    return null;
  }

  return (
    <section style={blogStyle}>
      <div id={`container_${blog.id}_id`}>
        <h3 className="blogTitle">Details</h3>
        <div id={`details_${blog.id}_id`} style={visibility}>
          <div style={detailStyle}>
            <strong>Title:</strong> {blog.title}
          </div>
          <div style={detailStyle}>
            <strong>Author:</strong> {blog.author}
          </div>
          <div style={detailStyle}>
            <strong>URL:</strong> <Link to={blog.url}>{blog.url}</Link>
          </div>
          <div style={detailStyle}>
            <strong>Likes:</strong> {blog.likes}
            {loggedInUserOwned && (
              <Button
                size="small"
                onClick={like}
                sx={{ mx: 0.5 }}
                variant="outlined"
              >
                Like
              </Button>
            )}
            {loggedInUserOwned && (
              <Button
                size="small"
                onClick={remove}
                sx={{ mx: 0.5 }}
                variant="outlined"
              >
                Remove
              </Button>
            )}
          </div>
        </div>
        <h3>Comments</h3>
        <form onSubmit={submitComment}>
          <TextField
            size="small"
            sx={{ mx: 0.5 }}
            id="commentBlog"
            label="Comment"
            variant="outlined"
            {...comment.attributes}
          />
          <Button size="large" type="submit" variant="outlined">
            Comment
          </Button>
        </form>
        <div id={`comments_${blog.id}_id`}>
          {!blog.comments || blog.comments.length === 0 ? (
            <p>No comments yet</p>
          ) : (
            <ul>
              {blog.comments.map((c, index) => (
                <li key={index}>{c}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
};

BlogDetail.displayName = "Blog";

export default BlogDetail;
