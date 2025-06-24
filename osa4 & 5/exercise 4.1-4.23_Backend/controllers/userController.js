const bcrypt = require('bcrypt')
const userRouter = require('express').Router()
const User = require('../models/user')
const logger = require('../utils/logger')

// GET ALL BLOGS
userRouter.get('/', logger.routeLogger, async (request, response) => {
  const allUsers = await User.find({}).populate('blogs', { url: 1, title: 1, author: 1 })
  return response.json(allUsers)
})

// POST NEW USER
userRouter.post('/', logger.routeLogger, async (request, response) => {
  const { username, name, password } = request.body

  if (!(password !== undefined && password.length >= 3)) return response.status(400).json({ error: 'password is invalid or minimum length is not 3' })

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)
  const userObj = new User({
    username,
    name,
    passwordHash,
  })

  const savedUser = await userObj.save()
  response.status(201).json(savedUser)
})

module.exports = userRouter