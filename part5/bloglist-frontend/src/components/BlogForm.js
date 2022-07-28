import React from 'react';

const BlogForm = ({
  title,
  setTitle,
  author,
  setAuthor,
  url,
  setUrl,
  handleCreate,
}) => {
  return (
    <form onSubmit={handleCreate}>
      <div>
        <label htmlFor="title">title:</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={({ target }) => setTitle(target.value)}
        />
      </div>
      <div>
        <label htmlFor="author">author:</label>
        <input
          type="text"
          id="author"
          value={author}
          onChange={({ target }) => setAuthor(target.value)}
        />
      </div>
      <div>
        <label htmlFor="url">url:</label>
        <input
          type="text"
          id="url"
          value={url}
          onChange={({ target }) => setUrl(target.value)}
        />
      </div>
      <button>create</button>
    </form>
  );
};

export default BlogForm;
