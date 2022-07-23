const { application } = require('express');
const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);

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

beforeEach(async () => {
  await Blog.deleteMany({});

  const blogObjects = initialBlogs.map((blog) => new Blog(blog));
  const promiseArray = blogObjects.map((blog) => blog.save());
  await Promise.all(promiseArray);
});

describe('When there are initially some notes saved', () => {
  test('blogs are returned as JSON', async () => {
    await api
      .get('/api/blogs')
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

describe('Viewing a specific note', () => {
  test('can create a new blog post', async () => {
    const newBlog = {
      title: 'First class tests',
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
      likes: 10,
    };
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const newBlogs = await api.get('/api/blogs');
    expect(newBlogs.body).toHaveLength(initialBlogs.length + 1);

    const newTitle = newBlogs.body.map((blog) => blog.title);
    expect(newTitle).toContain('First class tests');
  });

  test('the likes property defaults to 0 if is missing from request', async () => {
    const newBlog = {
      title: 'First class tests',
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    };
    await api.post('/api/blogs').send(newBlog).expect(201);

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

    await api.post('/api/blogs').send(newBlog).expect(400);
  });

  test('url property is required to post new blogs', async () => {
    const newBlog = {
      title: 'First class tests',
      author: 'Robert C. Martin',
      likes: 10,
    };

    await api.post('/api/blogs').send(newBlog).expect(400);
  });
});

describe('On deletion of a blog', () => {
  test('success with status of 204 if id is valid', async () => {
    const blogs = await api.get('/api/blogs');
    const startBlogs = blogs.body;

    await api.delete(`/api/blogs/${startBlogs[0].id}`).expect(204);

    const endBlogs = await api.get('/api/blogs');
    expect(endBlogs.body).toHaveLength(startBlogs.length - 1);
  });

  test('fails with status of 400 if id is invalid', async () => {
    const blogs = await api.get('/api/blogs');
    const startBlogs = blogs.body;

    await api.delete('/api/blogs/abc').expect(400);

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

afterAll(() => mongoose.connection.close());
