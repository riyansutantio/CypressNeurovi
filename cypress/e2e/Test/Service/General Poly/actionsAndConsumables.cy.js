/// <reference types="cypress" />

import {
  chooseFromDropdown,
  loginUser,
  newPatientOutpatient,
} from '../../../../support/helpers';
const action1 = 'Pemeriksaan Dokter Gigi';
const action2 = 'Pemeriksaan Air Minum';
const consumable1 = 'Masker Headloop';
const consumable2 = 'Covid-19 Rapid Test';
describe('Test actions and consumable', () => {
  before(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.viewport(1920, 1080);
    cy.visit('http://localhost:8080/'); // Visit apps
    loginUser();
    newPatientOutpatient('Poli Umum');
  });

  it('Add actions & Consumable', () => {
    cy.get('[data-sidebar="Parent Pelayanan"]').click();
    cy.get('[data-sidebar="Pelayanan Poli Umum"]').click();
    cy.fixture('outpatientRegisData').then(data => {
      //search patient data
      cy.get('[data-testid="search"]').type(data.name);
      cy.get('tr').then(() => {
        cy.get('td')
          .contains(data.name)
          .click();
      });
    });
    cy.get('[data-testid="Tindakan dan BHP"]').click();

    chooseFromDropdown('[data-testid="serviceName"]', action1);
    cy.get('[data-testid="actionAmount"]').type('5');
    chooseFromDropdown('[data-testid="operator"]', 'Ameera Syakira');
    cy.get('[data-testid="addService"]').click();
    chooseFromDropdown('[data-testid="serviceName"]', action2);
    cy.get('[data-testid="actionAmount"]').type('5');
    chooseFromDropdown('[data-testid="operator"]', 'Ameera Syakira');
    cy.get('[data-testid="addService"]').click();
    cy.get(`[data-testid="delete${action2}"]`).click();
    chooseFromDropdown('[data-testid="consumable"]', consumable1);
    cy.get('[data-testid="consumableAmount"]').type('5');
    cy.get('[data-testid="addConsumable"]').click();
    chooseFromDropdown('[data-testid="consumable"]', consumable2);
    cy.get('[data-testid="consumableAmount"]').type('5');
    cy.get('[data-testid="addConsumable"]').click();
    cy.get(`[data-testid="delete${consumable2}"]`).click();
    cy.get('[data-testid="simpan"]').click();
    cy.get('#swal2-title').should($item => {
      expect($item).to.contain('Data Tindakan berhasil disimpan!');
    });
  });
});
