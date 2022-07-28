import { useState, useEffect } from 'react';
import Blog from './components/Blog';
import BlogForm from './components/BlogForm';
import LoginForm from './components/LoginForm';
import blogService from './services/blogs';
import loginService from './services/login';
import Notification from './components/Notification';

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [url, setUrl] = useState('');
  const [newBlog, setNewBlog] = useState(false);
  const [notification, setNotification] = useState({
    message: null,
    isError: false,
  });

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, [newBlog]);

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const user = await loginService.login({
        username,
        password,
      });

      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user));
      blogService.setToken(user.token);
      setUser(user);
      setUsername('');
      setPassword('');
    } catch (exception) {
      setNotification({ message: 'Wrong credentials', isError: true });
      setTimeout(() => {
        setNotification({ message: null, isError: false });
      }, 5000);
    }
  };

  const logOut = () => {
    window.localStorage.clear();
    setUser(null);
  };

  const handleCreate = async (e) => {
    e.preventDefault();

    try {
      await blogService.create({
        title: title,
        author: author,
        url: url,
      });

      setNotification({
        message: `a new blog ${title} by ${author} added`,
        isError: false,
      });
      setNewBlog((prev) => !prev);
      setTitle('');
      setAuthor('');
      setUrl('');

      setTimeout(
        () => setNotification({ message: null, isError: false }),
        3000
      );
    } catch (err) {
      setNotification({ message: err.response.data.error, isError: true });
      setTimeout(
        () => setNotification({ message: null, isError: false }),
        3000
      );
    }
  };

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification notification={notification} />
        <LoginForm
          handleLogin={handleLogin}
          username={username}
          setUsername={setUsername}
          password={password}
          setPassword={setPassword}
        />
      </div>
    );
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification notification={notification} />
      <p>
        {user.name} logged in <button onClick={logOut}>log out</button>
      </p>

      <h2>create new</h2>
      <BlogForm
        title={title}
        setTitle={setTitle}
        author={author}
        setAuthor={setAuthor}
        url={url}
        setUrl={setUrl}
        handleCreate={handleCreate}
      />

      {blogs.map((blog) => (
        <Blog key={blog.id} blog={blog} />
      ))}
    </div>
  );
};

export default App;
