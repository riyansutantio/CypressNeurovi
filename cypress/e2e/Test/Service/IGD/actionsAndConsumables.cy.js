/// <reference types="cypress" />

import { createPatientJson } from '../../../../support/dataHelper';
import {
  addNewPatientIGD,
  chooseFromDropdown,
  loginUser,
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
    createPatientJson();
    loginUser();
  });

  it('Add actions & Consumable', () => {
    cy.intercept(
      'http://localhost:4000/patient/registration/unit?search=&unit_name=IGD**',
    ).as('getdataIGD');
    addNewPatientIGD();
    // cy.get('[data-testid="Parent Pelayanan"]').click();
    // cy.get('[data-testid="Pelayanan Klinik IGD"]').click();
    cy.fixture('outpatientRegisData').then(data => {
      //search patient data
      cy.wait('@getdataIGD').then(() => {
        cy.get('[data-testid="search"]')
          .clear()
          .type(data.name);
        cy.get('tr').then(() => {
          cy.get('td')
            .contains(data.name)
            .click();
        });
      });
    });
    cy.get('[data-testid="actionEmergency"]').click();

    chooseFromDropdown('[data-testid="serviceName"]', action1);
    cy.get('[data-testid="actionAmount"]').type('5');
    chooseFromDropdown('[data-testid="operator"]', 'Ameera Syakira');
    cy.get('[data-testid="addService"]').click();
    chooseFromDropdown('[data-testid="serviceName"]', action2);
    cy.get('[data-testid="actionAmount"]').type('5');
    chooseFromDropdown('[data-testid="operator"]', 'Ameera Syakira');
    cy.get('[data-testid="addService"]').click();
    cy.get(`[data-testid="delete${action2}"]`).click();

    cy.get('[data-testid="simpan"]').click();
    cy.get('#swal2-title').should($item => {
      expect($item).to.contain('Data Tindakan berhasil disimpan!');
    });
  });
});
