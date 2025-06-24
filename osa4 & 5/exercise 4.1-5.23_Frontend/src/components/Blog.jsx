import { useState } from 'react';
import PropTypes from 'prop-types'

const Blog = ({ blog, incrementLike, removeBlog, loggedInUser }) => {
  const [showDetails, setExpansion] = useState(false)
  const loggedInUserOwned = loggedInUser === blog.user.id;

  const like = () => {
    incrementLike(blog.id)
  }

  const remove = () => {
    removeBlog(blog)
  }

  const toggleExpand = () => {
    setExpansion(!showDetails)
  }
  
  const visibility = { display: showDetails ? 'block' : 'none' }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: '1px solid grey',
    borderRadius: '3px',
    marginBottom: 5,
    maxWidth: '50%'
  }

  const detailStyle = {
    marginTop: 5,
    marginBottom: 5,
    paddingLeft: 10
  }

  return (
    <section style={blogStyle}>
      <div id={`container_${blog.id}_id`}>
        <strong className='blogTitle'>{blog.title}</strong>
        <div id={`details_${blog.id}_id`} style={visibility}>
          <div style={detailStyle}><strong>Title:</strong> {blog.title}</div>
          <div style={detailStyle}><strong>Author:</strong> {blog.author}</div>
          <div style={detailStyle}><strong>URL:</strong> {blog.url}</div>
          <div style={detailStyle}>
            <strong>Likes:</strong> {blog.likes}
            <button onClick={like} style={{ marginLeft: 10 }}>Like</button>
            {loggedInUserOwned && <button onClick={remove} style={{ marginLeft: 10 }}>Remove</button>}
          </div>
        </div>
      </div>
      <button onClick={toggleExpand}>{!showDetails ? 'Expand' : 'Collapse'}</button>
    </section>
  )
};

// Add proptypes for dev and prod environments
if (process.env.NODE_ENV !== 'test') {
  Blog.propTypes = {
    blog: PropTypes.object.isRequired,
    incrementLike: PropTypes.func.isRequired,
    removeBlog: PropTypes.func.isRequired,
  }

  Blog.displayName = 'Blog'
}

export default Blog