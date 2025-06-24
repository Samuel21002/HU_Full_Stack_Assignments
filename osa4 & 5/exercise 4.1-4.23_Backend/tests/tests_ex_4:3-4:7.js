const { test, describe } = require('node:test')
const assert = require('node:assert')
var _ = require('lodash')
const { info } = require('../utils/logger')
const listHelper = require('../utils/list_helper')

const blogs = listHelper.testBlogs

describe('Assignment 4:3 test', () => {
  test('dummy returns one', () => {
    const blogs = []
    const result = listHelper.dummy(blogs)
    assert.strictEqual(result, 1)
  })
})
describe('Assignment 4:4 tests', () => {
  test('is of type list', () => {
    assert.equal(Array.isArray(blogs), true)
  })
  test('number of blogs is not zero', () => {
    const result = listHelper.totalLikes(blogs)
    assert.notStrictEqual(result, 0)
  })
  test('total number of blogs', () => {
    const result = listHelper.totalLikes(blogs)
    assert.strictEqual(result, 40)
  })
})
describe('Assignment 4:5 test', () => {
  test('blog is not empty', () => {
    assert.notStrictEqual(blogs.length, 0)
  })
  test('returns the most liked blog using reduce()', () => {
    const result = listHelper.favoriteBlog(blogs)
    assert.deepStrictEqual(result.title, 'Canonical string reduction')
  })
  test('testing Lodash to return most liked blog', () => {
    const result_lodash = listHelper.favoriteBlogWithLodash(blogs)
    assert.deepStrictEqual(result_lodash.title, 'Canonical string reduction')
    info(`The most liked blog is called "${result_lodash.title}"`)
  })
})
describe('Assignment 4:6 test', () => {
  test('returns the author with most blogs', () => {
    const result = listHelper.mostBlogs(blogs)
    assert.deepStrictEqual(result, { author: 'Robert C. Martin', blogs: 3 })
    info(`Author with the most blogs is ${result.author} with ${result.likes} blogs`)
  })
})
describe('Assignment 4:7 test', () => {
  test('returns the author with most overall likes', () => {
    const result = listHelper.mostLikes(blogs)
    assert.deepStrictEqual(result, { author: 'Edsger W. Dijkstra', likes: 17 })
    info(`Author with the most likes is ${result.author} with ${result.likes} likes`)
  })
})