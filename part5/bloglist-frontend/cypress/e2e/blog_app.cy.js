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
      cy.get('#username').type('super');
      cy.get('#password').type('abc123');
      cy.get('#login-button').click();
    });

    it('A blog can be created', function () {
      cy.contains('new blog').click();

      cy.get('#title').type('blog-title');
      cy.get('#author').type('blog-author');
      cy.get('#url').type('http://blog-url.com');

      cy.get('#create-button').click();

      cy.get('.blogs-container').contains('blog-title blog-author');
    });
  });
});
