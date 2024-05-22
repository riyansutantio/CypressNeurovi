/// <reference types="cypress" />

import {
  createPatientJson,
  inpatientEMRData,
} from '../../../../../support/dataHelper';
import {
  addOutpatientRegistration,
  chooseFromDropdown,
  clearCookies,
  datePicker,
  fillInpatientOrder,
  inpatientRegistration,
  loginUser,
} from '../../../../../support/helpers';

describe('Medic Resume', () => {
  before(() => {
    clearCookies();
    inpatientEMRData();
    cy.viewport(1920, 1080);
    cy.visit('http://localhost:8080/'); // Visit apps
    loginUser('admin', 'admin123');
    createPatientJson();
    addOutpatientRegistration();
  });

  it('Write medic resume', () => {
    //fill SPRI
    fillInpatientOrder();
    //regist patient to inpatient
    inpatientRegistration();

    cy.fixture('outpatientRegisData').then(data => {
      cy.get('[data-testid="Parent Pelayanan"]').click();
      cy.get('[data-testid="Pelayanan Rawat Inap"]').click();
      cy.get('[data-testid="search"]').type(data.noRm);
      cy.contains(data.noRm).click();

      //go to emr inpatient page
      cy.get('[data-testid="emr"]').click();
      cy.get('[data-testid="Resume Medis"]').click();
    });
    cy.fixture('inpatientEMRData').then(data => {
      const item = data.medicalResume;
      datePicker('[data-testid="dateOut"]', item.date);
      cy.get('[data-testid="timeOut"]').type(item.time);
      chooseFromDropdown('[data-testid="staff"]', item.doctor);
      cy.get('[data-testid="room"]').type(item.room);

      cy.get('[data-testid="reasonIn"]').type(item.lorem);
      cy.get('[data-testid="diagnoseIn"]').type(item.lorem);
      cy.get('[data-testid="labResult"]').type(item.lorem);
      cy.get('[data-testid="diseaseHistory"]').type(item.lorem);
      cy.get('[data-testid="labResult"]').type(item.lorem);
      cy.get('[data-testid="consultationResult"]').type(item.lorem);
      cy.get('[data-testid="physicalCheckup"]').type(item.lorem);
      cy.get('[data-testid="supportCheckup"]').type(item.lorem);
      cy.get('[data-testid="mainDiagnose"]').type(item.lorem);
      cy.get('[data-testid="secDiagnose0"]').type(item.lorem);
      chooseFromDropdown('[data-testid="mainDiagnoseICD10"]', item.icd10);
      chooseFromDropdown('[data-testid="secDiagnoseICD100"]', item.icd10);
      chooseFromDropdown('[data-testid="ICD9Procedure0"]', item.icd9);
      cy.get('[data-testid="procedure0"]').type(item.lorem);
      cy.get('[data-testid="allergy0"]').type(item.lorem);
      cy.get('[data-testid="takehomeDrug0"]').type(item.lorem);
      cy.get('[data-testid="diet"]').type(item.lorem);
      cy.get('[data-testid="instruction"]').type(item.lorem);
      chooseFromDropdown('[data-testid="finishTypeName"]', item.finishTypeName);
      chooseFromDropdown(
        '[data-testid="treatmentContinued"]',
        item.treatmentContinued,
      );
      if (item.finishTypeName == 'Lain-lain')
        cy.get('[data-testid="finishTypeDesc"]').type(item.lorem);
      if (item.treatmentContinued == 'Lain-lain')
        cy.get('[data-testid="treatmentDesc"]').type(item.lorem);
      cy.get('[data-testid="Simpan "]').click();
      cy.get(
        '.main > .container > .v-snack > .v-snack__wrapper > .v-snack__content',
      )
        .should('be.visible')
        .then(() => {
          cy.log('Berhasil menyimpan resume medis');
        });
    });
  });
});
