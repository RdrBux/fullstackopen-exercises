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

module.exports = { dummy, totalLikes, favoriteBlog };
