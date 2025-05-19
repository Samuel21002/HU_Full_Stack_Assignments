const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const logger = require('../utils/logger')

// GET ALL BLOGS
blogsRouter.get('/', logger.routeLogger, async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  return response.json(blogs)
})

// POST NEW BLOG
blogsRouter.post('/', logger.routeLogger, async (request, response) => {

  const { title, author, url, likes } = request.body
  const userObj = await User.findById(request.user)
  if (!userObj) {
    return response.status(401).json({ error: 'user not logged in' })
  }

  const blogObj = new Blog(
    {
      title:title,
      author:author,
      url:url,
      likes:likes,
      user: userObj._id
    }
  )

  const result =  await blogObj.save()

  userObj.blogs = userObj.blogs.concat(blogObj._id)
  await userObj.save()

  response.status(201).json(result)
})

// PUT - Currently only increments likes and is used for test exercises
blogsRouter.put('/:id', logger.routeLogger, async (request, response) => {
  const id = request.params.id
  const blog = await Blog.findByIdAndUpdate(id, { $inc: { likes: 1 } }, { new: true })
  if (blog) {
    console.log(`The blog "${blog.title}" like count incremented to ${blog.likes}`)
    response.json(blog)
  } else {
    response.status(404).send({ error: `Cannot find Blog with the ID: ${id}` })
  }
})

// DELETE A BLOG
blogsRouter.delete('/:id', logger.routeLogger, async (request, response) => {
  const id = request.params.id
  const blogObj = await Blog.findById(id)
  const userObj = await User.findById(request.user)

  if (!blogObj) {
    return response.status(404).send({ error: `Cannot find Blog with the ID: ${id}` })
  }
  if (blogObj.user.toString() !== userObj._id.toString()) {
    return response.status(403).send({ error: `Deletion of blog by user ${blogObj.user} not allowed` })
  }
  await blogObj.deleteOne()

  userObj.blogs = userObj.blogs.filter(blog => blog.toString() !== id)
  await userObj.save()

  return response.status(204).send('Blog deleted')
})

module.exports = blogsRouter