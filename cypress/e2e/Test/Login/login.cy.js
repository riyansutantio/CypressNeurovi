/// <reference types="cypress" />

const { clearCookies } = require('../../../support/helpers');
//to add more user go to fixture/loginUserData.json
describe('Test Login', () => {
  it('Login ', () => {
    cy.fixture('loginUseraData.json').then(data => {
      data.forEach(user => {
        cy.viewport(1920, 1080);
        cy.visit('http://localhost:8080/'); // Visit apps
        clearCookies();
        cy.intercept('POST', 'http://localhost:4000/master/staff/unit').as(
          'loginwait',
        );
        cy.get('#nip').type(user.username);
        cy.get('#password')
          .type(user.password)
          .wait(2000);
        cy.get('#login')
          .click()
          .wait('@loginwait');
        cy.get('body').then($body => {
          if ($body.find('.v-dialog__content').length > 0) {
            cy.get('[data-testid="unit"]')
              .click()
              .wait(2000)
              .then(() => {
                cy.get('.v-list-item__content')
                  .first()
                  .click();
              });
            cy.get('[data-testid="ok"]')
              .click()
              .wait(2000);
          }
        });
        cy.get('.mr-4', { timeout: 10000 }).should('be.visible');
        cy.get('[data-testid="profile"]')
          .click()
          .wait(2000);
        cy.get('[data-testid="logout"]')
          .click()
          .wait(2000);
      });
    });
  });
});
