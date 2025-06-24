const loginWith = async (page, username, password)  => {
    await page.getByTestId('username').fill(username)
    await page.getByTestId('password').fill(password)
    await page.getByRole('button', { name: 'login' }).click()
}

const createBlog = async (page, content) => {
    await page.getByText('Create new blog').click()
    await page.getByRole('textbox', { name: 'Title:' }).fill(content.title)
    await page.getByRole('textbox', { name: 'Author:' }).fill(content.author)
    await page.getByRole('textbox', { name: 'URL:' }).fill(content.url)
    await page.getByText('Submit Blog').click()
}

const createUser = async (request, name, username, password ) => {
    await request.post('api/users', {
        data: {
          name: name ? name : username,
          username: username,
          password: password
        }
    })
}

const extractCurrentBlogTitles = async (page) => {
    return page.evaluate(() => {
        const sections = document.querySelectorAll('#allBlogs section');
        const titles = [];
        
        sections.forEach(section => {
        const titleElement = section.querySelector('.blogTitle');
        if (titleElement) {
            titles.push(titleElement.textContent);
            }
        });
        return titles;
    });
}

const likeBlogByTitle = async (page, blogTitle, likeCount) => {
  for (let j = 0; j < likeCount; j++) {

    const sections = page.locator('#allBlogs section');
    const count = await sections.count();

    let found = false;
    for (let i = 0; i < count; i++) {
      const section = sections.nth(i);
      const title = await section.locator('.blogTitle').textContent();

      if (title === blogTitle) {
        const expandButton = section.locator('button:has-text("Expand")');
        if (await expandButton.isVisible()) {
          await expandButton.click();
        }
        await section.locator('button:has-text("Like")').click();
        await page.waitForTimeout(300);
        found = true;
        break;
      }
    }
    if (!found) {
      throw new Error(`Blog with title "${blogTitle}" not found`);
    }
  }
};



export { loginWith, createBlog, createUser, extractCurrentBlogTitles, likeBlogByTitle }