import { useState, useEffect, useRef } from 'react';
import Blog from './components/Blog';
import Notification from './components/Notification';
import LoginForm from './components/LoginForm';
import BlogForm from './components/BlogForm';
import Togglable from './components/ToggleElement';
import blogService from './services/blogs';
import loginService from './services/login';

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, changeMessage] = useState({message:null, isError:false})
  const [user, setUser] = useState(null);

  const blogFormRef = useRef();

  // For displaying messages
  const setMessage = (message, isError) => {
    changeMessage({message, isError})
    setTimeout(() => {
      changeMessage({message: null, isError: false})
    }, 3000)
  }

  // Auth functions
  const handleLogin = async (event) => {
    event.preventDefault();
    console.log('logging in with', username, password);
    try {
      const user = await loginService.login({
        username,
        password,
      });
      window.localStorage.setItem('loggedInUser', JSON.stringify(user));
      blogService.setToken(user.token);
      setUser(user);
      setUsername('');
      setPassword('');
    } catch (exception) {
      setMessage('wrong credentials', true)
    }
  };

  const handleLogout = () => {
    window.localStorage.clear();
    document.location.reload();
    setUser(null);
  };

  // Helper function for sorting blogs
  const sortBlogs = (blogs) => {
    return [...blogs].sort((a, b) => b.likes - a.likes);
  };

  // For handling API requests
  const updateLike = async (id) => {
    try {
      const returnedBlog = await blogService.updateBlogLikes(id);
      setBlogs((prevBlogs) =>
        sortBlogs(
          prevBlogs.map((blog) => (blog.id === id ? returnedBlog : blog))
        )
      );
    } catch (error) {
      console.error('Error updating like:', error);
    }
  };

  const addBlog = async (blog) => {
    try {
      const returnedBlog = await blogService.postBlog(blog);
      blogFormRef.current.toggleVisibility();
      setBlogs(sortBlogs(blogs.concat(returnedBlog)));
      setMessage(`New blog ${blog.title} by ${blog.author} added`);
    } catch (error) {
      setMessage(`Error adding new blog: ${error}`, true);
      console.error('Error adding new blog:', error);
    }
  };

  const removeBlog = async (blog) => {
    if (user.id === String(blog.user.id) && window.confirm(`Do you really want to remove the blog "${blog.title}"?`)) {
      try {
        await blogService.deleteBlog(blog.id);
        setBlogs(sortBlogs(blogs.filter(b => b.id !== blog.id)));
      } catch (error) {
        console.error('Error deleting blog:', error);
      }
    }
  };

  // Renders all Blogs
  const displayAllBlogs = () => (
    <div>
      <h2>Blogs: </h2>
      <div id="allBlogs">
        {blogs.map((blog) => {
          return (
            <Blog
              key={blog.id}
              blog={blog}
              incrementLike={updateLike}
              removeBlog={removeBlog}
              loggedInUser={user.id}
            />
          );
        })}
      </div>
    </div>
  );

  // UseEffects
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedInUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  useEffect(() => {
    if (user) {
      blogService.getAll().then((blogs) => setBlogs(sortBlogs(blogs)));
    }
  }, [user]);

  return (
    <>
      {/* Check if user is logged in and display the correct form accordingly */}
      <Notification notificationBody={errorMessage}/>
      {!user && (
        <LoginForm
          handleLogin={handleLogin}
          setUsername={setUsername}
          setPassword={setPassword}
          username={username}
          password={password}
        />
      )}
      {user && (
        <div>
          <p id="loggedInAs">
            Logged in as: <strong>{user.username}</strong>
          </p>
          <button type="submit" id="logoutButton" onClick={handleLogout}>
            Log Out
          </button>
          <Togglable buttonLabel="Create new blog" ref={blogFormRef}>
            <BlogForm createBlog={addBlog} />
          </Togglable>
          {displayAllBlogs()}
        </div>
      )}
    </>
  );
};

export default App;
