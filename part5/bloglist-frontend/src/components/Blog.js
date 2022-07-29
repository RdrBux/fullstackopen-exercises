import { useState } from 'react';

const Blog = ({ blog, handleLikes, remove, username }) => {
  const [details, setDetails] = useState(false);

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  };

  const newBlog = () => {
    return {
      user: blog.user.id,
      likes: blog.likes + 1,
      author: blog.author,
      title: blog.title,
      url: blog.url,
    };
  };

  const showRemoveButton = () => {
    if (blog.user.username === username) {
      return (
        <div>
          <button onClick={() => remove(blog.id, newBlog())}>remove</button>
        </div>
      );
    }
  };

  return (
    <div style={blogStyle}>
      {blog.title} {blog.author}{' '}
      <button onClick={() => setDetails((prev) => !prev)}>
        {details ? 'hide' : 'view'}
      </button>
      <div style={{ display: details ? 'block' : 'none' }}>
        <div>{blog.url}</div>
        <div>
          likes {blog.likes}{' '}
          <button onClick={() => handleLikes(blog.id, newBlog())}>like</button>
        </div>
        <div>{blog.user.name}</div>
        {showRemoveButton()}
      </div>
    </div>
  );
};

export default Blog;
