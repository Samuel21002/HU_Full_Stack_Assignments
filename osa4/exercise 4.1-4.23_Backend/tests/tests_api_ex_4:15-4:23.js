const { info } = require('../utils/logger')
const { test, after, describe, beforeEach, before } = require('node:test')
const app = require('../app')
const assert = require('node:assert')
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const supertest = require('supertest')
const User = require('../models/user')
const Blog = require('../models/blog')
const { usersFromDb, blogsFromDb, testBlogs } = require('../utils/list_helper')

const api = supertest(app)

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

describe('Testing user API functions', () => {
  test('User creation successful', async () => {
    const usersAtStart = await usersFromDb()

    // This user will be utilized in the succeeding test for testing blog deletion
    const newUser = {
      username: 'testuser_2',
      name: 'Test User 2',
      password: 'testpass2',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await usersFromDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    assert(usernames.includes(newUser.username))
  })

  test('User creation failed - Username taken', async () => {
    const usersAtStart = await usersFromDb()

    const sameUser = {
      username: 'testuser_2',
      name: 'Test User 2',
      password: 'testpass2',
    }

    const result = await api
      .post('/api/users')
      .send(sameUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await usersFromDb()
    assert(result.body.error.includes('expected `username` to be unique'))
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('User creation failed - Password Invalid', async () => {
    const usersAtStart = await usersFromDb()

    // Check password length
    const invalidUser = {
      username: 'testuser',
      name: 'Test User',
      password: 'te',
    }

    const result = await api
      .post('/api/users')
      .send(invalidUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    assert(result.body.error.includes('password is invalid or minimum length is not 3'))

    // Check missing password
    const invalidUser_2 = {
      username: 'testuser',
      name: 'Test User'
    }

    const result_2 = await api
      .post('/api/users')
      .send(invalidUser_2)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    assert(result_2.body.error.includes('password is invalid or minimum length is not 3'))

    // Check there are no new users generated
    const usersAtEnd = await usersFromDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })
})
describe('Testing blog functions (Assignments in 4:23)', () => {
  test('Blog addition without login', async () => {
    const newBlog = {
      'title': 'Test 2',
      'author': 'Test Writer 2',
      'url': 'www.test2.fi',
    }
    const response = await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)
    assert(response.body.error.includes('token missing or invalid'))
  })
  test('Blog deletion by another user', async () => {
    const allBlogs = await blogsFromDb()
    const blogToDelete = allBlogs[0]

    // Login as the other user. This test uses the username created in prior test
    await api
      .post('/api/login')
      .send({
        username: 'testuser_2',
        password: 'testpass2'
      })
    const response = await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set({ 'Authorization': loggedInToken })
      .expect(403)
    assert(response.body.error.includes(`Deletion of blog by user ${blogToDelete.user.toString()} not allowed`))
  })
})

after(async () => {
  await mongoose.connection.close()
})
