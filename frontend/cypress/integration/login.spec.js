describe('Login Page', () => {
  it('should display login form', () => {
    cy.visit('/login');
    cy.get('form').should('exist');
  });

  it('should login successfully', () => {
    cy.visit('/login');
    cy.get('input[type="email"]').type('test@example.com');
    cy.get('input[type="password"]').type('password');
    cy.get('form').submit();
    cy.url().should('include', '/');
  });
});