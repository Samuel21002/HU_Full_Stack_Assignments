const { test, after, describe, beforeEach, before } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
const { info } = require('../utils/logger')
const { testBlogs, blogsFromDb } = require('../utils/list_helper')

const api = supertest(app)

// Setup before running tests
// 1. Delete pre-existing users 2. Register user 3. Log in 4. Append newly created user to every test blog entry
before(async () => {
  try {

    // Clear users to ensure clean state and create new user
    await User.deleteMany({})
    await api
      .post('/api/users')
      .send({
        username: 'Testuser',
        name: 'Testuser',
        password: 'password'
      })

    // Login
    const loginResponse = await api
      .post('/api/login')
      .send({
        username: 'Testuser',
        password: 'password'
      })

    loggedInToken = `Bearer ${loginResponse.body.token}`
    userId = await User.findOne({ username: 'Testuser' })
    testBlogs.forEach(u => u.user = userId)

    console.log('Authentication token obtained for tests:', loggedInToken)
  } catch (error) {
    console.error('Error in test setup:', error)
    throw error
  }
})

// Clears the blogs collection and add the test blogs
beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(testBlogs)
})

describe('Testing API endpoints 4:8-4:10', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .set({ 'Authorization': loggedInToken }).set({ 'Authorization': loggedInToken })
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })
  test('blogs initial amount is 6', async () => {
    const response = await api.get('/api/blogs').set({ 'Authorization': loggedInToken })
    assert.strictEqual(response.body.length, testBlogs.length)
  })
  test('returned blogs contain "ID" in the correct format', async () => {
    const response = await api.get('/api/blogs/').set({ 'Authorization': loggedInToken })
    const contents = Object.values(response.body).every(blog => blog.hasOwnProperty('id'))
    assert.strictEqual(contents, true)
  })
  test('add blog successfully to database and verify content', async () => {

    const allBlogsAtStart = await blogsFromDb()

    const newBlog = {
      'title': 'Test',
      'author': 'Test Writer',
      'url': 'www.test.fi',
      'likes': 6,
    }

    await api
      .post('/api/blogs')
      .set({ 'Authorization': loggedInToken })
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const allBlogsInTheEnd = await blogsFromDb()
    assert.strictEqual(allBlogsInTheEnd.length, allBlogsAtStart.length + 1)

    const contents = allBlogsInTheEnd.map(n => {    // Only compare the crucial object properties
      return {
        'title': n.title,
        'author': n.author,
        'url': n.url,
        'likes': n.likes,
      }
    })
    info('Added Object Body:\n',contents[contents.length-1])
    assert.deepStrictEqual(contents[contents.length-1], newBlog)
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
      .set({ 'Authorization': loggedInToken })
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const allBlogs = await blogsFromDb()

    info('Added Object Body:\n',allBlogs[allBlogs.length-1])
    assert.strictEqual(allBlogs[allBlogs.length-1].likes, Number(0))
  })
  test('add blog without title or url', async () => {
    const newBlog = {
      'author': 'Test Writer 2',
      'likes': 5
    }

    const response = await api
      .post('/api/blogs')
      .set({ 'Authorization': loggedInToken })
      .send(newBlog)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    info('Error received:', response.body.error)
    assert(response.body.error.includes('Blog validation failed: title: Title is required, url: URL is required'))
  })
})

describe('Assignment 4:13', () => {
  test('test for succesful deletion', async () => {
    const blogsAtStart = await blogsFromDb()
    const blogToDelete = blogsAtStart[0]   // Get only the first blog

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set({ 'Authorization': loggedInToken })
      .expect(204)

    const blogsAtEnd = await blogsFromDb()

    assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1)
    const titlesLeft = blogsAtEnd.map(r => r.title)
    assert(!titlesLeft.includes(blogToDelete.title))
  })
  test('test for failed deletion - malformatted id', async () => {
    const blogsAtStart = await blogsFromDb()
    const response = await api
      .delete('/api/blogs/1234')
      .set({ 'Authorization': loggedInToken })
      .expect(400)
    assert(response.body.error.includes('malformatted id'))
    assert.strictEqual(blogsAtStart.length, testBlogs.length)
  })
  test('test for failed deletion - id not found', async () => {
    const blogsAtStart = await blogsFromDb()
    const response = await api
      .delete('/api/blogs/680a6209ba29a35ba2e7be93')
      .set({ 'Authorization': loggedInToken })
      .expect(404)
    assert(response.body.error.includes('Cannot find Blog with the ID: 680a6209ba29a35ba2e7be93'))
    assert.strictEqual(blogsAtStart.length, testBlogs.length)
  })
})

describe('Assignment 4:14', () => {
  test('test for like incrementation, test object initially has 10 likes', async () => {
    const blogToUpdate = await blogsFromDb()
    await api
      .put(`/api/blogs/${blogToUpdate[0].id}`)
      .set({ 'Authorization': loggedInToken })
      .expect(200)
    const blogUpdated = await blogsFromDb()
    assert.strictEqual(blogUpdated[0].likes, 11)    // First blog has a default like count of 10
  })
  test('test for failed update - malformatted id', async () => {
    const response = await api
      .put('/api/blogs/1234')
      .set({ 'Authorization': loggedInToken })
      .expect(400)
    assert(response.body.error.includes('malformatted id'))
  })
  test('test for failed update - id not found', async () => {
    const blogsAtStart = await blogsFromDb()
    const response = await api
      .put('/api/blogs/680a6209ba29a35ba2e7be93')
      .set({ 'Authorization': loggedInToken })
      .expect(404)
    assert(response.body.error.includes('Cannot find Blog with the ID: 680a6209ba29a35ba2e7be93'))
    assert.strictEqual(blogsAtStart[0].likes, 10)   // First blog has a default like count of 10
  })
})

after(async () => {
  await mongoose.connection.close()
})