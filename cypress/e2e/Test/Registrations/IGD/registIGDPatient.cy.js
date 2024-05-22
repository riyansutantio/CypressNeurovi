/// <reference types="cypress" />

import {
  addNewPatientIGD,
  dropdownVlist,
  lastDropdown,
} from '../../../../support/helpers';
import { createPatientJson } from '../../../../support/dataHelper';

describe('Regist IGD patient', () => {
  beforeEach(() => {
    cy.viewport(1920, 1080);
    cy.login('admin', 'admin123');
    cy.visit('http://localhost:8080/'); // Visit apps
    createPatientJson();
  });

  it('Register triage old Patient ', () => {
    addTriage();
    cy.fixture('outpatientRegisData').then(data => {
      const fullName = data.name;
      const name = fullName.split(' ');
      const searchName = name.join('%20');
      cy.intercept(
        'GET',
        `http://localhost:4000/patient/igd/triase?search=${searchName}**`,
      ).as('getTriageList');
      cy.get('[data-testid="Parent Pendaftaran"]').click();
      cy.get('[data-testid="Pendaftaran IGD"]').click();
      //choose traige
      cy.get('[data-testid="search"]').type(data.name);
      cy.wait('@getTriageList');
      cy.get('[data-testid="daftar 0"]').click();

      cy.get('[data-testid="search"]')
        .last()
        .click()
        .wait(500);

      cy.get('[data-testid="patientName"]').type(data.noRm);

      cy.intercept('GET', 'http://localhost:4000/patient/emr/all**').as(
        'getPatient',
      );
      cy.intercept('GET', 'http://localhost:4000/patient/emr/social/**').as(
        'getPatientDataSocial',
      );

      cy.get('[data-testid="search patient"]').click();
      cy.wait('@getPatient');

      cy.get(`[data-testid="register ${data.noRm}"]`).click();
      cy.wait('@getPatientDataSocial').then(res => {
        if (res.response?.body.data.assurance.type != 'umum') {
          cy.get('[data-testid="umum"]').click({ force: true });
        }
      });
      cy.get('[data-testid="lanjut"]').click();

      cy.get('.swal2-confirm').click();

      cy.get('[data-testid="Parent Pelayanan"]').click();
      cy.get('[data-testid="Pelayanan Klinik IGD"]').click();
      cy.get('[data-testid="search"]').type(data.noRm);

      cy.contains(data.noRm).should('be.visible');
    });
  });

  it('Register triage new Patient', () => {
    addNewPatientIGD();
  });

  function addTriage() {}
});
