import { Routes, Route, useMatch } from "react-router-dom";
import { useEffect, useRef } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";

import Blog from "./components/Blog";
import BlogDetail from "./components/BlogDetail";
import User from "./components/User";
import UserDetail from "./components/UserDetail";
import BlogForm from "./components/BlogForm";
import LoginForm from "./components/LoginForm";
import Notification from "./components/Notification";
import Togglable from "./components/ToggleElement";
import Nav from "./components/Menu";

import "@fontsource/roboto/300.css";
import Typography from "@mui/material/Typography";

import {
  useNotificationDispatch,
  setNotification as setMessage,
} from "./reducers/notificationContext";
import {
  useUserValue,
  useUserDispatch,
  logoutUser,
} from "./reducers/userContext";

import blogService from "./services/blogs";
import userService from "./services/users";

const App = () => {
  const dispatch = useNotificationDispatch();
  const userDispatch = useUserDispatch();
  const user = useUserValue();

  const queryClient = useQueryClient();
  const blogFormRef = useRef();

  useEffect(() => {
    const stored = window.localStorage.getItem("loggedInUser");

    if (stored) {
      const session = JSON.parse(stored);
      const now = Date.now();

      if (now < session.expiresAt) {
        blogService.setToken(session.token);
        userDispatch({ type: "LOGIN", payload: session });
        const timeout = session.expiresAt - now;
        setTimeout(() => {
          logoutUser(userDispatch);
          setMessage(
            dispatch,
            "Session expired. Please log in again.",
            5,
            true,
          );
        }, timeout);
      } else {
        logoutUser(userDispatch);
        setMessage(dispatch, "Session expired. Please log in again.", 5, true);
      }
    }
  }, [userDispatch, dispatch]);

  // Mutations
  const newBlogMutation = useMutation({
    mutationFn: blogService.postBlog,
    onSuccess: (newBlog) => {
      const blogs = queryClient.getQueryData(["blogs"]);
      queryClient.setQueryData(["blogs"], blogs.concat(newBlog));
      setMessage(dispatch, "Blog Added Successfully", 5);
    },
    onError: (error) => {
      setMessage(dispatch, error.response.data.error, 5, true);
    },
  });
  const updateBlogMutation = useMutation({
    mutationFn: blogService.updateBlogLikes,
    onSuccess: (updatedBlog) => {
      const blogs = queryClient.getQueryData(["blogs"]);
      if (blogs) {
        const updatedBlogs = blogs.map((blog) =>
          blog.id === updatedBlog.id ? updatedBlog : blog,
        );
        queryClient.setQueryData(["blogs"], updatedBlogs);
      }
      setMessage(dispatch, "Vote added", 3);
    },
    onError: (error) => {
      setMessage(dispatch, error.response.data.error, 5, true);
    },
  });
  const addCommentMutation = useMutation({
    mutationFn: blogService.putComment,
    onSuccess: (updatedBlog) => {
      const blogs = queryClient.getQueryData(["blogs"]);
      if (blogs) {
        const updatedBlogs = blogs.map((b) =>
          b.id === updatedBlog.id ? updatedBlog : b,
        );
        queryClient.setQueryData(["blogs"], updatedBlogs);
      }
      setMessage(dispatch, "Comment added", 3);
    },
    onError: (error) => {
      setMessage(
        dispatch,
        error.response?.data?.error || "Error adding comment",
        5,
        true,
      );
    },
  });
  const deleteBlogMutation = useMutation({
    mutationFn: blogService.deleteBlog, // Expects an ID
    onSuccess: (deletedId) => {
      const blogs = queryClient.getQueryData(["blogs"]);
      if (blogs) {
        const updatedBlogs = blogs.filter((b) => b.id !== deletedId);
        queryClient.setQueryData(["blogs"], updatedBlogs);
      }
      setMessage(dispatch, "Blog deleted", 3);
    },
    onError: (error) => {
      setMessage(
        dispatch,
        error.response?.data?.error || "Error deleting blog",
        5,
        true,
      );
    },
  });

  // For handling blog API requests
  const addBlog = (blog) => newBlogMutation.mutate(blog);
  const updateLike = async (id) => updateBlogMutation.mutate(id);
  const addComment = (id, comment) =>
    addCommentMutation.mutate({ id, comment });
  const removeBlog = async (blog) => {
    if (
      user.id === String(blog.user.id) &&
      window.confirm(`Do you really want to remove the blog "${blog.title}"?`)
    ) {
      deleteBlogMutation.mutate(blog.id);
    }
  };

  // Renders all Blogs
  const DisplayBlogs = () => (
    <div>
      <Togglable buttonLabel="Create new blog" ref={blogFormRef}>
        <BlogForm createBlog={addBlog} />
      </Togglable>
      <Typography sx={{ mb: 2 }} variant="h2" component="h2">
        Blogs:
      </Typography>
      <div id="allBlogs">
        {blogs.data?.map((blog) => {
          return <Blog key={blog.id} blog={blog} />;
        })}
      </div>
    </div>
  );

  // Renders all Blogs
  const DisplayUsers = () => (
    <div>
      <Typography sx={{ mb: 2 }} variant="h2" component="h2">
        Users:
      </Typography>
      <div id="allUsers">
        {users.data?.map((user) => {
          return <User key={user.id} user={user} />;
        })}
      </div>
    </div>
  );

  // Upon initial render of blogs and
  const blogs = useQuery({
    queryKey: ["blogs"],
    queryFn: blogService.getAll,
    staleTime: Infinity,
    cacheTime: Infinity,
    enabled: !!user,
    retry: 3,
    select: (data) => [...data].sort((a, b) => b.likes - a.likes),
  });

  const users = useQuery({
    queryKey: ["users"],
    queryFn: userService.getAll,
    enabled: !!user,
    retry: 3,
    select: (data) => [...data].sort((a, b) => b.username - a.username),
  });

  useEffect(() => {
    blogs.isLoading
      ? setMessage(dispatch, "Loading app")
      : dispatch({ type: "Clear" });

    blogs.isError && setMessage(dispatch, "Server error", null, true);
  }, [blogs.isLoading, blogs.isError, dispatch]);

  // Return correct object to details views
  const blogMatch = useMatch("/blog/:id");
  const blogDetail = blogMatch
    ? blogs.data?.find((blog) => blog.id === blogMatch.params.id)
    : null;

  const userMatch = useMatch("/users/:username");
  const userDetail = userMatch
    ? users.data?.find((user) => user.username === userMatch.params.username)
    : null;

  return (
    <>
      {/* Check if user is logged in and display the correct form accordingly */}
      <Notification />
      {!user ? (
        <LoginForm />
      ) : (
        <div>
          <Nav />
          <Routes>
            <Route path="/" element={<DisplayBlogs />} />
            <Route
              path="/blog/:id"
              element={
                <BlogDetail
                  blog={blogDetail}
                  incrementLike={updateLike}
                  addComment={addComment}
                  removeBlog={removeBlog}
                />
              }
            />
            <Route path="/users" element={<DisplayUsers />} />
            <Route
              path="/users/:username"
              element={<UserDetail user={userDetail} />}
            />
          </Routes>
        </div>
      )}
    </>
  );
};

export default App;
