const { test, describe } = require('node:test')
const assert = require('node:assert')
var _ = require('lodash')
const listHelper = require('../utils/list_helper')

const blogs = listHelper.testBlogs

describe('Assignment 4:3 test', () => {
  test('dummy returns one', () => {
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
    assert.strictEqual(result, 6)
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
  })
})
describe('Assignment 4:6 test', () => {
  test('returns the most liked blog', () => {
    const result = listHelper.mostBlogs(blogs)
    assert.deepStrictEqual(result, { author: 'Robert C. Martin', blogs: 3 })
  })
})
describe('Assignment 4:7 test', () => {
  test('returns the author with most likes', () => {
    const result = listHelper.mostLikes(blogs)
    assert.deepStrictEqual(result, { author: 'Edsger W. Dijkstra', likes: 17 })
  })
})