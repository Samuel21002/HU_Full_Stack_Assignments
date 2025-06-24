const { test, expect, beforeEach, describe } = require('@playwright/test')
const { createUser, createBlog, extractCurrentBlogTitles, loginWith, likeBlogByTitle } = require('./helper.js')
const { create } = require('domain')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('api/reset')
    await createUser(request, 'Test User', 'Testuser', 'salasana')
    await page.goto('/')
  })

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByText('Log in:')).toBeVisible()

    const usernameField = await page.getByTestId('username')
    expect(usernameField).toBeVisible()
    const passwordField = await page.getByTestId('password')
    expect(passwordField).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'Testuser', 'salasana')

      const responsePromise = page.waitForResponse('**/api/login') // Checks that the status from the login action is 200
      const response = await responsePromise
      expect(response.status()).toBe(200)

      const loggedInElement = await page.locator('p:has(strong):has-text("Logged in as:")')
      expect(loggedInElement).toBeVisible()
      expect(loggedInElement).toContainText('Testuser')
      expect(page.getByText('Log Out')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'Testuser_2', 'salasana_2')

      const responsePromise = page.waitForResponse('**/api/login') // Checks that the status from the login action is 200
      const response = await responsePromise
      expect(response.status()).toBe(401)
      expect(page.getByText('Log Out')).not.toBeVisible()
    })
  })

  describe('When logged in', () => {
    // Test are run after logging in
    beforeEach(async ({ page }) => {
      await loginWith(page, 'Testuser', 'salasana')
    })

    test('a new blog can be created', async ({ page }) => {
      const createBlogBtn = await page.getByText('Create new blog')
      const submitBlogBtn = await page.getByText('Submit Blog')

      await expect(createBlogBtn).toBeVisible()
      await createBlog(page, {title: 'Testuser blog', author: 'Testuser', url: 'https://www.test.fi'})

      await expect(submitBlogBtn).not.toBeVisible()
      const allDescendantDivs = await page.locator('#allBlogs section')
      
      // Check that there are only one added blog containing the title of the added blog and an expand button
      const sectionCount = await allDescendantDivs.count()
      expect(sectionCount).toBe(1)
      await expect(allDescendantDivs.locator('div > strong').first()).toContainText('Testuser blog')
    })
    test('a blog can be liked', async({ page }) => {
      await createBlog(page, {title: 'Testuser blog', author: 'Testuser', url: 'https://www.test.fi'})
      const allDescendantDivs = await page.locator('#allBlogs section')
      const expandBlogBtn = await allDescendantDivs.locator('button:has-text("Expand")')
      await expect(expandBlogBtn).toBeVisible()
      await expandBlogBtn.click()

      const likeBlogBtn = await page.getByRole('button', { name: 'Like' })
      await expect(likeBlogBtn).toBeVisible()
      await likeBlogBtn.click()

      await page.waitForTimeout(500)

      // Gets the inner div with the likes attribute and checks the like is incremented by one
      const likesText = await allDescendantDivs
        .locator('div div')
        .filter({ hasText: /Likes:/ })
        .first()
        .textContent()
      const likesCount = parseInt(likesText.match(/\d+/)[0])
      expect(likesCount).toBe(1)
    })
    test('a blog can be deleted', async ({ page }) => {

      await createBlog(page, {title: 'Testuser blog', author: 'Testuser', url: 'https://www.test.fi'})
      const allDescendantDivs = await page.locator('#allBlogs section')

      // Test liking a blog
      const expandBlogBtn = await allDescendantDivs.locator('button:has-text("Expand")')
      await expect(expandBlogBtn).toBeVisible()
      await expandBlogBtn.click()

      const deleteBlogBtn = await page.getByRole('button', { name: 'Remove' })
      await expect(deleteBlogBtn).toBeVisible()

      page.on('dialog', dialog => dialog.accept())
      await deleteBlogBtn.click()
      await page.waitForTimeout(500)

      // Verifies there are no Blog elements within the section element
      const likesText = await page.locator('#allBlogs section').count()
      expect(likesText).toBe(0)
    })
    test('log out to verify remove buttons are not shown', async ({ page, request }) => {
      await createUser(request, 'Test User 2', 'Testuser_2', 'salasana_2')
      await createBlog(page, {title: 'Testuser blog', author: 'Testuser', url: 'https://www.test.fi'})
      await page.getByRole('button', { name: 'Log Out' }).click()
      await loginWith(page, 'Testuser_2', 'salasana_2')

      // Test liking a blog
      const allDescendantDivs = await page.locator('#allBlogs section')
      const expandBlogBtn = await allDescendantDivs.locator('button:has-text("Expand")').first()
      await expect(expandBlogBtn).toBeVisible()
      await expandBlogBtn.click()

      const deleteBlogBtn = await page.getByRole('button', { name: 'Remove' })
      await expect(deleteBlogBtn).not.toBeVisible()
    })
    test('verify blog sorting works', async ({ page, request }) => {
      await createBlog(page, {title: 'Testuser blog', author: 'Testuser', url: 'https://www.test.fi' })
      await createBlog(page, {title: 'Testuser blog_2', author: 'Testuser', url: 'https://www.test2.fi' })
      await createBlog(page, {title: 'Testuser blog_3', author: 'Testuser', url: 'https://www.test3.fi' })
      await page.waitForTimeout(500)
      
      const allDescendantDivs = await page.locator('#allBlogs section').count();
      expect(allDescendantDivs).toBe(3)
      
      // Check current order after creating blogs
      const blogsBeforeLikes = await extractCurrentBlogTitles(page)
      expect(blogsBeforeLikes).toEqual(["Testuser blog", "Testuser blog_2", "Testuser blog_3"])
      
      await likeBlogByTitle(page, "Testuser blog", 3);
      await likeBlogByTitle(page, "Testuser blog_2", 1);
      await likeBlogByTitle(page, "Testuser blog_3", 4);      
      await page.waitForFunction(() => {
        const titles = Array.from(document.querySelectorAll('#allBlogs .blogTitle')).map(e => e.textContent)
        return JSON.stringify(titles) === JSON.stringify(["Testuser blog_3", "Testuser blog", "Testuser blog_2"])
      })
      
      const blogsAfterLikes = await extractCurrentBlogTitles(page)
      expect(blogsAfterLikes).toEqual(["Testuser blog_3", "Testuser blog", "Testuser blog_2"])
    })
  })
})