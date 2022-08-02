import { useState } from 'react';
import PropTypes from 'prop-types';

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
          <button
            className="remove-button"
            onClick={() => remove(blog.id, newBlog())}
          >
            remove
          </button>
        </div>
      );
    }
  };

  return (
    <div className="blog" style={blogStyle}>
      {blog.title} {blog.author}{' '}
      <button
        className="details-button"
        onClick={() => setDetails((prev) => !prev)}
      >
        {details ? 'hide' : 'view'}
      </button>
      <div style={{ display: details ? 'block' : 'none' }}>
        <div>{blog.url}</div>
        <div>
          likes {blog.likes}{' '}
          <button
            className="like-button"
            onClick={() => handleLikes(blog.id, newBlog())}
          >
            like
          </button>
        </div>
        <div>{blog.user.name}</div>
        {showRemoveButton()}
      </div>
    </div>
  );
};

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  handleLikes: PropTypes.func.isRequired,
  remove: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
};

export default Blog;
