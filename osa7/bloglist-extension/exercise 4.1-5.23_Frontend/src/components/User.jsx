import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const User = ({ user }) => {
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
      <div id="container">
        <strong>User details</strong>
        <div style={detailStyle}>
          <strong>Username:</strong>
          <Link
            style={{
              paddingRight: 5,
            }}
            to={`/users/${user.username}`}
          >
            {user.username}
          </Link>
        </div>
        <div style={detailStyle}>
          <strong>Name:</strong> {user.name}
        </div>
        <div style={detailStyle}>
          <strong>Blogs:</strong> {user.blogs.length}
        </div>
      </div>
    </section>
  );
};

// Add proptypes for dev and prod environments
if (process.env.NODE_ENV !== "test") {
  User.propTypes = {
    user: PropTypes.object.isRequired,
  };

  User.displayName = "User";
}

export default User;
