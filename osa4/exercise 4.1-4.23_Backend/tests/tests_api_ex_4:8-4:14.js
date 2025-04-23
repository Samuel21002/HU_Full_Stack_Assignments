const { test, after, describe, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const { info } = require('../utils/logger')
const { testBlogs, blogsFromDb } = require('../utils/list_helper')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})
  let BlogObject = new Blog(testBlogs[0])
  await BlogObject.save()
  BlogObject = new Blog(testBlogs[1])
  await BlogObject.save()
})

describe('Testing API endpoints 4:8-4:10', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })
  test('blogs initial amount is 2', async () => {
    const response = await api.get('/api/blogs')
    const content = response.body.map(r => r.content)
    assert.strictEqual(content.length, (testBlogs.length - 4))
  })
  test('returned blogs contain "ID" in the correct format', async () => {
    const response = await api.get('/api/blogs/')
    const contents = Object.values(response.body).every(blog => blog.hasOwnProperty('id'))
    assert.strictEqual(contents, true)
  })
  test('add blog with correct format', async () => {

    const newBlog = {
      'title': 'Test',
      'author': 'Test Writer',
      'url': 'www.test.fi',
      'likes': 6,
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const allBlogs = await blogsFromDb()
    assert.strictEqual(allBlogs.length, 3)
    const contents = allBlogs.map(n => {
      return {
        'title': n.title,
        'author': n.author,
        'url': n.url,
        'likes': n.likes
      }
    })
    info('Added Object Body:\n',contents[2])
    assert.deepStrictEqual(contents[2], newBlog)
  })
})

describe('Bonus excercise tests 4:11-4:12', () => {
  test('add blog without set "likes" value', async () => {

    const newBlog = {
      'title': 'Test 2',
      'author': 'Test Writer 2',
      'url': 'www.test2.fi',
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const allBlogs = await blogsFromDb()
    const contents = allBlogs.map(n => {
      return {
        'title': n.title,
        'author': n.author,
        'url': n.url,
        'likes': n.likes
      }
    })
    info('Added Object Body:\n',contents[2])
    assert.strictEqual(contents[2].likes, Number(0))
  })
  test('add blog without title or url', async () => {

    const newBlog = {
      'author': 'Test Writer 2',
      'likes': 5
    }

    const response = await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    info('Error received:', response.body.error)
    assert.strictEqual(response.statusCode, 400)
    assert.strictEqual(response.body.error, 'Blog validation failed: url: URL is required, title: Title is required')
  })
})

after(async () => {
  await mongoose.connection.close()
})