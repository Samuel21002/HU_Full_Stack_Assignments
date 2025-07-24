import { Link } from "react-router-dom";

const Blog = ({ blog }) => {
  const blogStyle = {
    paddingTop: 10,
    padding: '4px',
    border: "1px solid grey",
    borderRadius: "5px",
    marginBottom: 5,
    maxWidth: "50%",
  };

  return (
    <section style={blogStyle}>
      <div id={`container_${blog.id}_id`}>
        <Link to={`blog/${blog.id}`}><strong className="blogTitle">{blog.title}</strong> <small>   {blog.likes} likes</small></Link>
      </div>
    </section>
  );
};

Blog.displayName = "Blog";

export default Blog;
