/// <reference types="cypress" />

import { createPatientJson } from '../../../../support/dataHelper';
import { chooseFromDropdown, dropdownVlist } from '../../../../support/helpers';

describe('Laboratory Order', () => {
  beforeEach(() => {
    cy.viewport(1920, 1080);
    cy.login('admin', 'admin123');
    cy.visit('http://localhost:8080/'); // Visit apps
  });

  it('Order Lab Request for old patient', () => {
    addOrderLabOldPatient();
  });

  it('Order Lab Request for new patient', () => {
    createPatientJson();
    cy.fixture('outpatientRegisData').then(data => {
      cy.intercept('http://localhost:4000/patient/emr/all**').as('getUser');
      cy.intercept('http://localhost:4000/master/diagnose**').as('getDiagnose');
      cy.intercept('http://localhost:4000/patient/emr/social/**').as(
        'getSocialDataUser',
      );

      //go to lab request menu
      cy.get('[data-testid="Parent Pendaftaran"]').click();
      cy.get('[data-testid="Pendaftaran Laboratorium"]').click();

      //choose old patient data
      cy.get('[data-testid="tambah"]').click();
      cy.get('[data-testid="daftar"]').click();
      cy.get('#name').type(data.name);
      dropdownVlist('[data-testid="status pasien"]', data.patientStatus);
      if (data.patientStatus == 'Bayi' || data.patientStatus == 'Anak') {
        data.isMale
          ? cy.get('[data-testid="Laki-laki"]').click({ force: true })
          : cy.get('[data-testid="Perempuan"]').click({ force: true });
      }
      cy.get('#birthPlace').type(data.address.state);
      cy.get('#birthDate').type(data.dateBirth);
      cy.get('#addressText').type(data.address.street);

      cy.get('[data-testid="Lanjut"]').click();
      //get diagnose data & fill diagnose
      cy.wait('@getDiagnose').then(data => {
        const diagnoseList = data.response.body.data;
        const diagnose = diagnoseList[Cypress._.random(0, 99)].code;
        chooseFromDropdown('[data-testid="diagnose"]', diagnose);
      });

      //choose item lab
      for (let i = 0; i < data.itemLab.length; i++) {
        const item = data.itemLab[i];
        const px = 500;
        cy.get(`[data-testid="item ${item}"]`)
          .first()
          .scrollIntoView()
          .should('be.visible')
          .click();
      }

      cy.get('[data-testid="Lanjut"]').click();
      cy.get('[data-testid="Order"]').click();
    });
  });

  it('Cancel order lab Request', () => {
    cy.fixture('outpatientRegisData').then(data => {
      cy.intercept('http://localhost:4000/patient/lab?**').as(
        'getLabOrderData',
      );
      addOrderLabOldPatient();
      cy.wait('@getLabOrderData').then(() => {
        cy.get('[data-testid="search"]').type(data.noRm);
        cy.get('tr').then(() => {
          cy.get('td')
            .contains(data.noRm)
            .click();
        });
        cy.get('[data-testid="hapus"]').click();
        cy.get('.swal2-confirm').click();
      });
    });
  });

  function addOrderLabOldPatient() {
    createPatientJson();
    cy.fixture('outpatientRegisData').then(data => {
      cy.intercept('http://localhost:4000/patient/emr/all**').as('getUser');
      cy.intercept('http://localhost:4000/master/diagnose**').as('getDiagnose');
      cy.intercept('http://localhost:4000/patient/emr/social/**').as(
        'getSocialDataUser',
      );

      //go to lab request menu
      cy.get('[data-testid="Parent Pendaftaran"]').click();
      cy.get('[data-testid="Pendaftaran Laboratorium"]').click();

      //choose old patient data
      cy.get('[data-testid="tambah"]').click();
      cy.get('[data-testid="pilih"]').click();
      cy.get('[data-testid="name"]').type(data.noRm);

      cy.wait('@getUser').then(item => {
        const res = item.response.body.data[0].medical_record_number;
        cy.get(`[data-testid="daftar ${res}"]`).click();
      });
      cy.wait(1000);
      cy.wait('@getSocialDataUser').then(res => {
        if (res.response?.body.data.assurance.type != 'umum') {
          cy.get('[data-testid="Umum"]').click({ force: true });
        }
      });
      cy.get('[data-testid="Lanjut"]').click();
      //get diagnose data & fill diagnose
      cy.wait('@getDiagnose').then(data => {
        const diagnoseList = data.response.body.data;
        const diagnose = diagnoseList[Cypress._.random(0, 99)].code;
        chooseFromDropdown('[data-testid="diagnose"]', diagnose);
      });

      //choose item lab
      for (let i = 0; i < data.itemLab.length; i++) {
        const item = data.itemLab[i];
        const px = 500;
        cy.get(`[data-testid="item ${item}"]`)
          .first()
          .scrollIntoView()
          .should('be.visible')
          .click();
      }

      cy.get('[data-testid="Lanjut"]').click();
      cy.get('[data-testid="Order"]').click();
    });
  }
});
