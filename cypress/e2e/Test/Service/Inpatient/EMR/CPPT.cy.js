/// <reference types="cypress" />

import {
  createPatientJson,
  inpatientEMRData,
} from '../../../../../support/dataHelper';
import {
  addOutpatientRegistration,
  chooseFromDropdown,
  fillInpatientOrder,
  inpatientRegistration,
} from '../../../../../support/helpers';

describe('Inpatient EMR', () => {
  before(() => {
    inpatientEMRData();
    cy.viewport(1920, 1080);
    cy.login('admin', 'admin123');
    cy.visit('http://localhost:8080/'); // Visit apps
    // createPatientJson();
    // addOutpatientRegistration();
  });

  it('Input CPPT', () => {
    //fill SPRI
    fillInpatientOrder();
    //regist patient to inpatient
    inpatientRegistration();

    //search data patient
    cy.fixture('outpatientRegisData').then(data => {
      cy.get('[data-testid="Parent Pelayanan"]').click();
      cy.get('[data-testid="Pelayanan Rawat Inap"]').click();
      cy.get('[data-testid="search"]').type(data.noRm);
      cy.contains(data.noRm).click();

      //go to emr inpatient page
      cy.get('[data-testid="emr"]').click();
      cy.get('[data-testid="CPPT"]')
        .should('be.visible')
        .click();
      cy.get('[data-testid="newCPPT"]').click();
    });

    cy.fixture('inpatientEMRData').then(data => {
      const item = data.CPPT;
      cy.get('[data-testid="anamnesis"]')
        .scrollIntoView()
        .type(item.subjective.anamnesis);

      cy.get('[data-testid="sistole"]')
        .scrollIntoView()
        .type(item.objective.sistolik);
      cy.get('[data-testid="diastole"]').type(item.objective.diastolik);
      cy.get('[data-testid="temperature"]').type(item.objective.temperature);
      cy.get('[data-testid="heartRate"]').type(item.objective.heartRate);
      cy.get('[data-testid="rr"]').type(item.objective.rr);
      cy.get('[data-testid="saturation"]').type(item.objective.saturation);
      cy.get('[data-testid="gds"]').type(item.objective.gds);
      cy.get('[data-testid="other"]').type(item.objective.objectiveData);

      //fill assessment& plan
      cy.get('[data-testid="diagnose-0"]').scrollIntoView();
      chooseFromDropdown(
        '[data-testid="diagnose-0"]',
        item.assessment.diagnose,
      );
      chooseFromDropdown('[data-testid="action-0"]', item.assessment.action);
      cy.get('[data-testid="note"]').type(item.assessment.note);

      //fill PPA instruction
      cy.get('[data-testid="ppaInstruction"]')
        .scrollIntoView()
        .type(item.PPA.instruction);

      //click save
      cy.get('[data-testid="cpptSave"]').click();
    });
  });

  it('edit CPPT', () => {
    cy.fixture('outpatientRegisData').then(data => {
      cy.intercept('http://localhost:4000/inpatient/cppt/**').as('getCPPTData');
      cy.get('[data-testid="Parent Pelayanan"]').click();
      cy.get('[data-testid="Pelayanan Rawat Inap"]').click();
      cy.get('[data-testid="search"]').type(data.noRm);
      cy.contains(data.noRm).click();

      //go to emr inpatient page
      cy.get('[data-testid="emr"]').click();
      cy.get('[data-testid="CPPT"]')
        .should('be.visible')
        .click();
      cy.get('[data-testid="CPPTEtc0"]').click();
      cy.get('[data-testid="Lihat Detail"]').click();
      cy.get('[data-testid="cpptEdit"]').click();
    });

    cy.fixture('inpatientEMRData').then(data => {
      const item = data.CPPT;
      cy.get('[data-testid="anamnesis"]').type(item.subjective.anamnesis);

      cy.get('[data-testid="sistole"]')
        .scrollIntoView()
        .clear()
        .type(item.objective.sistolik);
      cy.get('[data-testid="diastole"]')
        .clear()
        .type(item.objective.diastolik);
      cy.get('[data-testid="temperature"]')
        .clear()
        .type(item.objective.temperature);
      cy.get('[data-testid="heartRate"]')
        .clear()
        .type(item.objective.heartRate);
      cy.get('[data-testid="rr"]')
        .clear()
        .type(item.objective.rr);
      cy.get('[data-testid="saturation"]')
        .clear()
        .type(item.objective.saturation);
      cy.get('[data-testid="gds"]')
        .clear()
        .type(item.objective.gds);
      cy.get('[data-testid="other"]')
        .clear()
        .type(item.objective.objectiveData);

      //fill assessment& plan
      cy.wait('@getCPPTData').then(data => {
        const item =
          data.response.body.data[0].history[0].assesment.nurse.diagnose;
        for (let i = 0; i < item.length; i++) {
          cy.get(`[data-testid="addDiagnose-${i}"]`).click();
          chooseFromDropdown(`[data-testid="diagnose-${+i + 1}"]`, 'Diare');
          chooseFromDropdown(
            `[data-testid="action-${+i + 1}"]`,
            'Anjurkan hindari makanan pembentuk gas, pedas dan mengandung laktosa',
          );
        }
      });
      cy.get('[data-testid="note"]')
        .scrollIntoView()
        .clear()
        .type(item.assessment.note);

      //fill PPA instruction
      cy.get('[data-testid="ppaInstruction"]')
        .scrollIntoView()
        .clear()
        .type(item.PPA.instruction);
      cy.intercept('http://localhost:4000/inpatient/cppt/**').as('editCPPT');
    });
    //click save
    cy.get('[data-testid="cpptSaveUpdate"]').click();
    cy.get('.swal2-confirm').click();
    cy.get('.v-snack__content').should('be.visible');
  });

  it('delete CPPT', () => {
    cy.fixture('outpatientRegisData').then(data => {
      cy.intercept('http://localhost:4000/inpatient/cppt/all/**').as(
        'waitDataCppt',
      );
      cy.intercept('http://localhost:4000/inpatient/cppt/**').as('getCPPTData');
      cy.get('[data-testid="Parent Pelayanan"]').click();
      cy.get('[data-testid="Pelayanan Rawat Inap"]').click();
      cy.get('[data-testid="search"]').type(data.noRm);
      cy.contains(data.noRm).click();

      //go to emr inpatient page
      cy.get('[data-testid="emr"]').click();
      cy.get('[data-testid="CPPT"]')
        .should('be.visible')
        .click();
      cy.wait('@waitDataCppt').then(data => {
        const item = data.response.body.data[0].timestamps.created_at;
        const date = new Date(item).getDate();
        const today = new Date().getDate();
        if (date == today) {
          cy.get('[data-testid="CPPTEtc0"]').click();
          cy.get('[data-testid="Hapus Riwayat"]').click();
          cy.get('[data-testid="cpptEdit"]').click();
          cy.log('CPPT deleted');
        } else {
          cy.log('No cppt can be deleted');
        }
      });
    });
  });
});
