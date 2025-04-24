const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const logger = require('../utils/logger')

// GET ALL BLOGS
blogsRouter.get('/', logger.routeLogger, async (request, response) => {
  const blogs = await Blog.find({})
  return response.json(blogs)
})

// POST NEW BLOG
blogsRouter.post('/', logger.routeLogger, async (request, response) => {
  const blog = new Blog(request.body)
  const result =  await blog.save()
  response.status(201).json(result)
})

// PUT - Currently only increments likes
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
  const result = await Blog.findByIdAndDelete(id)
  if (!result) {
    return response.status(404).send({ error: `Cannot find blog with the ID: ${id}` })
  }
  response.status(204).send('Blog deleted')
})

module.exports = blogsRouter