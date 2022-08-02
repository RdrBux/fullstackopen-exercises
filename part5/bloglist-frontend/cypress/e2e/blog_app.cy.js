describe('Blog app', function () {
  beforeEach(function () {
    cy.request('POST', 'http://localhost:3003/api/testing/reset');

    const user = {
      name: 'Superuser',
      username: 'super',
      password: 'abc123',
    };
    cy.request('POST', 'http://localhost:3003/api/users/', user);

    cy.visit('http://localhost:3000');
  });

  it('Login form is shown', function () {
    cy.contains('Log in to application');
  });

  describe('Login', function () {
    it('Succeeds with correct credentials', function () {
      cy.get('#username').type('super');
      cy.get('#password').type('abc123');
      cy.get('#login-button').click();

      cy.contains('Superuser logged in');
    });

    it('Fails with wrong credentials', function () {
      cy.get('#username').type('super');
      cy.get('#password').type('wrong123');
      cy.get('#login-button').click();

      cy.get('.notification')
        .should('contain', 'Wrong credentials')
        .and('have.css', 'color', 'rgb(255, 0, 0)');
    });
  });

  describe('When logged in', function () {
    beforeEach(function () {
      cy.login({ username: 'super', password: 'abc123' });
    });

    it('A blog can be created', function () {
      cy.contains('new blog').click();

      cy.get('#title').type('blog-title');
      cy.get('#author').type('blog-author');
      cy.get('#url').type('http://blog-url.com');

      cy.get('#create-button').click();

      cy.get('.blogs-container').contains('blog-title blog-author');
    });

    it('Users can like a blog', function () {
      cy.createBlog({
        title: 'Title 1',
        author: 'Author 1',
        url: 'http://url1.com',
      });

      cy.contains('Title 1 Author 1').find('.details-button').click();

      cy.contains('likes 0');

      cy.get('.like-button').click();
      cy.contains('likes 1');
    });

    it('Creator of blog can delete it', function () {
      cy.createBlog({
        title: 'Title 1',
        author: 'Author 1',
        url: 'http://url1.com',
      });

      cy.contains('Title 1 Author 1').find('.details-button').click();

      cy.get('.remove-button').click();

      cy.get('.blogs-container').should('not.contain', 'Title 1 Author 1');
    });

    it('Users cannot delete blogs they did not create', function () {
      cy.createBlog({
        title: 'Title 1',
        author: 'Author 1',
        url: 'http://url1.com',
      });

      const secondUser = {
        name: 'SecondUser',
        username: 'second',
        password: 'abc123',
      };
      cy.request('POST', 'http://localhost:3003/api/users/', secondUser);
      cy.login({ username: 'second', password: 'abc123' });

      cy.createBlog({
        title: 'Title 2',
        author: 'Author 2',
        url: 'http://url2.com',
      });

      cy.contains('Title 1 Author 1').find('.details-button').click();
      cy.contains('Title 1 Author 1')
        .find('.remove-button')
        .should('not.exist');
    });

    it('Blogs are ordered according to higher likes count', function () {
      cy.createBlog({
        title: 'Blog with third most likes',
        author: 'Author 1',
        url: 'http://url1.com',
        likes: 1,
      });

      cy.createBlog({
        title: 'Blog with most likes',
        author: 'Author 1',
        url: 'http://url1.com',
        likes: 100,
      });

      cy.createBlog({
        title: 'Blog with second most likes',
        author: 'Author 1',
        url: 'http://url1.com',
        likes: 10,
      });

      cy.get('.blog').eq(0).should('contain', 'Blog with most likes');
      cy.get('.blog').eq(1).should('contain', 'Blog with second most likes');
      cy.get('.blog').eq(2).should('contain', 'Blog with third most likes');
    });
  });
});
