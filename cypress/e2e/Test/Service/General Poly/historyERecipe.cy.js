/// <reference types="cypress" />

import {
  addOutpatientRegistration,
  loginUser,
  newPatientOutpatient,
} from '../../../../support/helpers';
const getStore = () => cy.window().its('app.$store');

const rm = '335';

describe('Test E-recipe', () => {
  before(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.viewport(1920, 1080);
    cy.visit('http://localhost:8080/'); // Visit apps
    loginUser();
  });
  it('add old outpatient', () => {
    addOutpatientRegistration('Poli Umum', rm);
  });

  it('Add recipe from history recipe', () => {
    cy.get('[data-sidebar="Parent Pelayanan"]').click();
    cy.get('[data-sidebar="Pelayanan Poli Umum"]').click();

    cy.fixture('outpatientRegisData').then(patient => {
      cy.get('[data-general-poly="search"]')
        .type(rm)
        .wait(1000);
      cy.get('tr').then(() => {
        cy.get('td')
          .contains(rm)
          .click();
      });
      cy.get('[data-general-poly="e-resep"]')
        .first()
        .click();
    });

    cy.get('[data-erecipe="riwayatResep"]').click();

    cy.get('body').then($body => {
      if ($body.find('.v-expansion-panel-header').length == 0) {
        console.log('tidak ada');
        cy.get('.swal2-confirm').click();
      } else {
        cy.get('[data-recipehistory="addRecipeHistory0"]').click();
      }
    });
    cy.get('[data-erecipe="save"]').click();
  });
});
