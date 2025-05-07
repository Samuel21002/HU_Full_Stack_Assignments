const { info } = require('../utils/logger')
const { test, after, describe, beforeEach } = require('node:test')
const app = require('../app')
const assert = require('node:assert')
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const supertest = require('supertest')
const User = require('../models/user')
const { usersFromDb } = require('../utils/list_helper')

const api = supertest(app)

beforeEach(async () => {
  await User.deleteMany({})
  const passwordHash = await bcrypt.hash('testpass', 10)
  const user = new User({ username: 'testuser', name:'Test User', passwordHash: passwordHash })
  await user.save()
})

describe('Testing user API functions', () => {
  test('User creation successful', async () => {
    const usersAtStart = await usersFromDb()

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

    const newUser = {
      username: 'testuser',
      name: 'Test User',
      password: 'testpass',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
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

    assert(result.body.error.includes('password is invalid, verify the minimum length is 3'))

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

    assert(result_2.body.error.includes('password is invalid, verify the minimum length is 3'))

    // Check there are no new users generated
    const usersAtEnd = await usersFromDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })
})

after(async () => {
  await mongoose.connection.close()
})