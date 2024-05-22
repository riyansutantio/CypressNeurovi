// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
const fs = require('fs');

Cypress.Commands.add('addDataToJsonFile', (filePath, data) => {
  cy.task('writeFile', { filePath, data });
});
//generate file xlsx for BDD bpjs
Cypress.Commands.add('parseXlsx', inputFile => {
  return cy.task('parseXlsx', { filePath: inputFile });
});
Cypress.Commands.add('closePrintDialog', () => {
  cy.document().then(doc => {
    doc.dispatchEvent(new KeyboardEvent('keydown', { keyCode: 27 })); // Simulate 'Escape' key press
  });
});
Cypress.Commands.add('login', (username, password) => {
  cy.session([username, password], () => {
    cy.request({
      method: 'POST',
      url: `${Cypress.config('baseUrl')}/master/staff/login`,
      body: {
        nip: username,
        password: password,
        unit: '6020a5de50c5450ed4c7d8ba',
      },
    }).then(res => {
      console.log(res.status + ' login');
      window.localStorage.setItem('token', res.body.token);
      // Cypress.Cookies.preserveOnce('session_id', 'remember_token'); // sudah tidak bisa dipakai
    });
  });
});
