import PropTypes from "prop-types";

const UserDetail = ({ user }) => {
  const userStyle = {
    paddingTop: 10,
    padding: '10px',
    border: "1px solid grey",
    borderRadius: "3px",
    marginBottom: 5,
  };

  const detailStyle = {
    marginTop: 5,
    marginBottom: 5,
    paddingLeft: 10,
  };

  if (!user) {
    return null;
  }

  return (
    <section style={userStyle}>
      <h2>{user.name}</h2>
      <div style={detailStyle}>
        <strong>Username:</strong> {user.username}
      </div>
      <div style={detailStyle}>
        <strong>Added Blogs:</strong>
        <ul>
          {user.blogs.map((blog) => (
            <li key={blog.id || blog.title}>{blog.title || blog}</li>
          ))}
        </ul>
      </div>
    </section>
  );
};

// Add proptypes for dev and prod environments
if (process.env.NODE_ENV !== "test") {
  UserDetail.propTypes = {
    user: PropTypes.object,
  };

  UserDetail.displayName = "UserDetail";
}

export default UserDetail;
