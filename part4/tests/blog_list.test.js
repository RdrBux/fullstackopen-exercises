const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);
const bcrypt = require('bcrypt');
const User = require('../models/user');

const Blog = require('../models/blog');

// HELPERS

const initialBlogs = [
  {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
  },
  {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
  },
];

let token = '';
beforeAll(async () => {
  const firstUser = {
    username: 'testing',
    name: 'Testing',
    password: 'abc123',
  };
  await api.post('/api/users').send(firstUser);
  const userInfo = await api.post('/api/login').send(firstUser);
  token = userInfo.body.token;
});

beforeEach(async () => {
  await Blog.deleteMany({});

  const blogObjects = initialBlogs.map((blog) => new Blog(blog));
  const promiseArray = blogObjects.map((blog) => blog.save());
  await Promise.all(promiseArray);
});

describe('When there are initially some blogs saved', () => {
  test('blogs are returned as JSON', async () => {
    await api
      .get('/api/blogs')
      .set('Authorization', 'abc123')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs');
    expect(response.body).toHaveLength(initialBlogs.length);
  });

  test('blogs have an id property', async () => {
    const response = await api.get('/api/blogs');
    expect(response.body[0].id).toBeDefined();
  });
});

describe('Viewing a specific blog', () => {
  test('can create a new blog post', async () => {
    const newBlog = {
      title: 'First class tests',
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
      likes: 10,
    };
    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const newBlogs = await api.get('/api/blogs');
    expect(newBlogs.body).toHaveLength(initialBlogs.length + 1);

    const newTitle = newBlogs.body.map((blog) => blog.title);
    expect(newTitle).toContain('First class tests');
  });

  test('adding a blog fails if a token is not provided', async () => {
    const newBlog = {
      title: 'First class tests',
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
      likes: 10,
    };
    await api.post('/api/blogs').send(newBlog).expect(401);
  });

  test('the likes property defaults to 0 if is missing from request', async () => {
    const newBlog = {
      title: 'First class tests',
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    };
    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201);

    const blogs = await api.get('/api/blogs');
    const findBlog = blogs.body.filter(
      (blog) => blog.title === 'First class tests'
    )[0];
    expect(findBlog.likes).toBe(0);
  });

  test('title property is required to post new blogs', async () => {
    const newBlog = {
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
      likes: 10,
    };

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(400);
  });

  test('url property is required to post new blogs', async () => {
    const newBlog = {
      title: 'First class tests',
      author: 'Robert C. Martin',
      likes: 10,
    };

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(400);
  });
});

describe('On deletion of a blog', () => {
  test('success with status of 204 if id is valid', async () => {
    const newBlog = {
      title: 'Blog created by user to be deleted',
      author: 'myself',
      url: 'http://delete.me',
      likes: 10,
    };

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog);

    const blogs = await api.get('/api/blogs');
    const startBlogs = blogs.body;

    await api
      .delete(`/api/blogs/${startBlogs[startBlogs.length - 1].id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204);

    const endBlogs = await api.get('/api/blogs');
    expect(endBlogs.body).toHaveLength(startBlogs.length - 1);
  });

  test('fails with status of 400 if id is invalid', async () => {
    const blogs = await api.get('/api/blogs');
    const startBlogs = blogs.body;

    await api
      .delete('/api/blogs/abc')
      .set('Authorization', `Bearer ${token}`)
      .expect(400);

    const endBlogs = await api.get('/api/blogs');
    expect(endBlogs.body).toHaveLength(startBlogs.length);
  });
});

describe('When updating an existing blog', () => {
  test('Updates the ammount of likes on an existing post', async () => {
    const blogs = await api.get('/api/blogs');
    const firstBlog = blogs.body[0];

    await api
      .put(`/api/blogs/${firstBlog.id}`)
      .send({ ...firstBlog, likes: 300 })
      .expect(200);

    const newBlogs = await api.get('/api/blogs');
    const newBlogsBody = newBlogs.body;
    const updatedBlog = newBlogsBody.filter((blog) => blog.id === firstBlog.id);

    expect(updatedBlog[0].likes).toBe(300);
  });

  test('fails when trying to update an invalid id', async () => {
    const blogs = await api.get('/api/blogs');
    const firstBlog = blogs.body[0];

    await api
      .put('/api/blogs/abc')
      .send({ ...firstBlog, likes: 300 })
      .expect(400);
  });
});

const usersInDb = async () => {
  const users = await User.find({});
  return users.map((u) => u.toJSON());
};

describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash('sekret', 10);
    const user = new User({ username: 'root', passwordHash });

    await user.save();
  });

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await usersInDb();

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    };

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const usersAtEnd = await usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);

    const usernames = usersAtEnd.map((u) => u.username);
    expect(usernames).toContain(newUser.username);
  });

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await usersInDb();

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen',
    };

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(result.body.error).toContain('username must be unique');

    const usersAtEnd = await usersInDb();
    expect(usersAtEnd).toEqual(usersAtStart);
  });

  test('creation fails with proper statuscode and message if username length is lower than three chars', async () => {
    const usersAtStart = await usersInDb();

    const newUser = {
      username: 'ab',
      name: 'userwithshorname',
      password: 'abc',
    };

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-type', /application\/json/);

    expect(result.body.error).toContain(
      'username must at least 3 characters long'
    );

    const usersAtEnd = await usersInDb();
    expect(usersAtStart).toEqual(usersAtEnd);
  });

  test('creation fails with proper statuscode and message if password length is lower than three chars', async () => {
    const usersAtStart = await usersInDb();

    const newUser = {
      username: 'abc',
      name: 'userwithshorname',
      password: 'ab',
    };

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-type', /application\/json/);

    expect(result.body.error).toContain(
      'password must at least 3 characters long'
    );

    const usersAtEnd = await usersInDb();
    expect(usersAtStart).toEqual(usersAtEnd);
  });
});

afterAll(() => mongoose.connection.close());
