const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  const sum = blogs.reduce((acc, val) => {
    return acc + val.likes;
  }, 0);
  return sum;
};

const favoriteBlog = (blogs) => {
  if (blogs.length < 1) {
    return 'WARNING: empty list';
  }

  const sortedByLikes = [...blogs].sort((a, b) => b.likes - a.likes);
  const fav = sortedByLikes[0];
  return { title: fav.title, author: fav.author, likes: fav.likes };
};

const mostBlogs = (blogs) => {
  if (blogs.length < 1) {
    return 'WARNING: empty list';
  }

  const blogCountByAuthor = blogs.reduce((allAuthors, author) => {
    const name = author.author;
    if (name in allAuthors) {
      allAuthors[name] += 1;
    } else {
      allAuthors[name] = 1;
    }
    return allAuthors;
  }, {});

  let count = 0;
  let author = '';

  for (const prop in blogCountByAuthor) {
    if (blogCountByAuthor[prop] > count) {
      count = blogCountByAuthor[prop];
      author = prop;
    }
  }

  return { author: author, blogs: count };
};

const mostLikes = (blogs) => {
  if (blogs.length < 1) {
    return 'WARNING: empty list';
  }

  const blogCountByAuthor = blogs.reduce((allAuthors, author) => {
    const name = author.author;
    if (name in allAuthors) {
      allAuthors[name] += author.likes;
    } else {
      allAuthors[name] = author.likes;
    }
    return allAuthors;
  }, {});

  let count = 0;
  let author = '';

  console.log(blogCountByAuthor);

  for (const prop in blogCountByAuthor) {
    if (blogCountByAuthor[prop] > count) {
      count = blogCountByAuthor[prop];
      author = prop;
    }
  }

  return { author: author, likes: count };
};

module.exports = { dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes };
