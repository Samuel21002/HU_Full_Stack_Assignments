import { useState } from 'react'
import PropTypes from 'prop-types'

const BlogForm = ({ createBlog }) => {
  const [blogTitle, setBlogTitle] = useState('')
  const [blogAuthor, setBlogAuthor] = useState('')
  const [blogUrl, setBlogUrl] = useState('')
  
  // Post blog via the backend provided in App.jsx
  const submitBlog = (event) => {
    event.preventDefault()
    createBlog({
      'title':blogTitle,
      'author':blogAuthor,
      'url':blogUrl
    })
    setBlogTitle(''); setBlogAuthor(''); setBlogUrl('');
  }
  
  return (
    <div>
      <h2>Create blog</h2>
      <form onSubmit={submitBlog}>
        <label htmlFor="blogTitle">Title: </label>
        <input 
          id="blogTitle"
          value={blogTitle}
          onChange={event => setBlogTitle(event.target.value)}
        />
        <label htmlFor="blogAuthor">Author: </label>
        <input
          id="blogAuthor"
          value={blogAuthor}
          onChange={event => setBlogAuthor(event.target.value)}
        />
        <label htmlFor="blogUrl">URL: </label>
        <input
          type="url"
          id="blogUrl"
          value={blogUrl}
          onChange={event => setBlogUrl(event.target.value)}
        />
        <button type="submit">Submit Blog</button>
      </form>
    </div>
  )
}

BlogForm.propTypes = {
  createBlog: PropTypes.func.isRequired
}

BlogForm.displayName = 'BlogForm'

export default BlogForm