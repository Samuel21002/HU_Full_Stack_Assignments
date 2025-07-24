import useField from "../customHook";
import PropTypes from "prop-types";

import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

const BlogForm = ({ createBlog }) => {
  const blogTitle = useField("text");
  const blogAuthor = useField("text");
  const blogUrl = useField("url");

  const resetForm = () => {
    blogTitle.resetfield();
    blogAuthor.resetfield();
    blogUrl.resetfield();
  };

  // Post blog via the backend provided in App.jsx
  const submitBlog = (event) => {
    event.preventDefault();
    createBlog({
      title: blogTitle.attributes.value,
      author: blogAuthor.attributes.value,
      url: blogUrl.attributes.value,
    });
    resetForm();
  };

  return (
    <div>
      <Typography sx={{ mb: 2 }} variant="h3" component="h3">
        Create Blog:
      </Typography>
      <form onSubmit={submitBlog}>
        <TextField
        size="small"
          sx={{ mx: 0.5 }}
          id="blogTitle"
          label="Title"
          variant="outlined"
          {...blogTitle.attributes}
        />
        <TextField
        size="small"
          sx={{ mx: 0.5 }}
          id="blogAuthor"
          label="Author"
          variant="outlined"
          {...blogAuthor.attributes}
        />
        <TextField
        size="small"
          sx={{ mx: 0.5 }}
          id="blogUrl"
          label="URL"
          variant="outlined"
          {...blogUrl.attributes}
        />
        <Button size="large" type="submit" variant="outlined">
          Submit Blog
        </Button>
      </form>
    </div>
  );
};

BlogForm.propTypes = {
  createBlog: PropTypes.func.isRequired,
};

BlogForm.displayName = "BlogForm";

export default BlogForm;
