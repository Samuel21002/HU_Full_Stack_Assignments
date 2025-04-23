const { info } = require('../utils/logger')
const Blog = require('../models/blog')
var _ = require('lodash')

const testBlogs = [
  {
    _id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    __v: 0
  },
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0
  },
  {
    _id: '5a422b3a1b54a676234d17f9',
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
    __v: 0
  },
  {
    _id: '5a422b891b54a676234d17fa',
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10,
    __v: 0
  },
  {
    _id: '5a422ba71b54a676234d17fb',
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0,
    __v: 0
  },
  {
    _id: '5a422bc61b54a676234d17fc',
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
    __v: 0
  }
]

const dummy = (blogs) => {
  info('First test should always return 1')
  return Number(1)
}

const totalLikes = (blogs) => {
  const likeCounter = (sum, blog) => {
    return sum + blog.likes
  }
  return blogs.length === 0 ? 0 : blogs.reduce(likeCounter, 0) / blogs.length
}

const favoriteBlog = (blogs) => {
  const mostLikes = blogs.reduce((max, blog) => (blog.likes > max.likes ? blog : max), blogs[0])
  return mostLikes
}

const favoriteBlogWithLodash = (blogs) => {
  const mostLikesWithLodash = _.maxBy(blogs, function(o) { return o.likes })
  return mostLikesWithLodash
}

const mostBlogs = (blogs) => {
  const authorBlogsCount = _.countBy(blogs, 'author')
  const mostPopularBlogger = _.maxBy(_.keys(authorBlogsCount), author => authorBlogsCount[author])
  return {
    author: mostPopularBlogger,
    blogs: authorBlogsCount[mostPopularBlogger]
  }
}

const mostLikes = (blogs) => {
  const groupByAuthor = _.groupBy(blogs, 'author')
  const countBlogsLikes = _.map(groupByAuthor, (posts, author) => {
    const totalLikes = _.sumBy(posts, 'likes')
    return { [author]: totalLikes }
  })
  const mostLikesBy = _.maxBy(countBlogsLikes, obj => { return _.values(obj)[0] })
  return {
    author: Object.keys(mostLikesBy)[0],
    likes : Object.values(mostLikesBy)[0]
  }
}

const blogsFromDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  favoriteBlogWithLodash,
  mostBlogs,
  mostLikes,
  blogsFromDb,
  testBlogs
}