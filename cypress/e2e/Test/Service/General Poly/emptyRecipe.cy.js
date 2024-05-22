/// <reference types="cypress" />

import {
  addOutpatientRegistration,
  loginUser,
  newPatientOutpatient,
} from '../../../../support/helpers';
const getStore = () => cy.window().its('app.$store');

describe('Test E-recipe', () => {
  before(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.viewport(1920, 1080);
    cy.visit('http://localhost:8080/'); // Visit apps
    loginUser();
  });

  it('Add Blank e-recipe', () => {
    newPatientOutpatient('Poli Umum');
    toERecipe();

    cy.get('[data-erecipe="save"]').click();

    cy.get('.swal2-confirm').click();
  });
});
