/// <reference types="cypress" />

import {
  createPatientJson,
  inpatientEMRData,
} from '../../../../../support/dataHelper';
import {
  addOutpatientRegistration,
  chooseFromDropdown,
  clearCookies,
  fillInpatientOrder,
  inpatientRegistration,
  loginUser,
} from '../../../../../support/helpers';

describe('Informed Consent', () => {
  beforeEach(() => {
    clearCookies();
    inpatientEMRData();
    cy.viewport(1920, 1080);
    cy.visit('http://localhost:8080/', {
      onBeforeLoad: win => {
        cy.stub(win, 'print');
      },
    }); // Visit apps
    loginUser('admin', 'admin123');
  });

  it('Add new informed consent', () => {
    createPatientJson();
    addOutpatientRegistration();
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
      cy.get('[data-testid="Informed Consent"]').click();
    });
    cy.intercept('http://localhost:4000/master/diagnose?**').as('waitDiagnose');
    cy.fixture('inpatientEMRData').then(data => {
      const item = data.informedConsent;
      cy.get('[data-testid="addIC"]').click();

      cy.wait('@waitDiagnose');
      cy.get('[data-testid="doctor"]')
        .last()
        .click()
        .type(item.doctor)
        .wait(1000)
        .then(() => {
          cy.get('.v-list-item__content > .v-list-item__title')
            .last()
            .contains(item.doctor)
            .wait(1000)
            .click({ force: true });
        });
      chooseFromDropdown(
        '[data-testid="staffInformation"]',
        item.staffInformation,
      );
      chooseFromDropdown('[data-testid="staffExecutor"]', item.staffExecutor);
      cy.get('[data-testid="informationReceiver"]').type(
        item.informationReceiver,
      );
      cy.get('[data-testid="isCheckDiagnose"]').check();
      chooseFromDropdown('.v-select__selections', item.diagnose);
      cy.get('[data-testid="isCheckBaseDiagnose"]').check();
      cy.get('[data-testid="baseDiagnose"]').type(item.lorem);
      cy.get('[data-testid="isCheckAction"]').check();
      chooseFromDropdown('[data-testid="action"]', item.action);
      cy.get('[data-testid="isCheckActionIndication"]').check();
      cy.get('[data-testid="actionIndication"]').type(item.lorem);
      cy.get('[data-testid="isCheckActionRisk"]').check();
      cy.get('[data-testid="actionRisk"]').type(item.lorem);
      cy.get('[data-testid="isCheckProcedure"]').check();
      cy.get('[data-testid="procedure"]').type(item.lorem);
      cy.get('[data-testid="isCheckPurpose"]').check();
      cy.get('[data-testid="purpose"]').type(item.lorem);
      cy.get('[data-testid="isCheckComplication"]').check();
      cy.get('[data-testid="complication"]').type(item.lorem);
      cy.get('[data-testid="isCheckPrognosis"]').check();
      cy.get('[data-testid="prognosis"]').type(item.lorem);
      cy.get('[data-testid="isCheckAltRisk"]').check();
      cy.get('[data-testid="altRisk"]').type(item.lorem);
      cy.get('[data-testid="isCheckCost"]').check();
      cy.get('[data-testid="cost"]').type(item.lorem);
      cy.get('[data-testid="isCheckOthers"]').check();
      cy.get('[data-testid="others"]').type(item.lorem);

      cy.contains('Surat Pernyataan').click();

      item.isWali ??
        cy
          .get('[data-testid="patient"]')
          .click()
          .then(() => {
            cy.get('[data-testid="signerName"]').type(item.wali);
            chooseFromDropdown('[data-testid="signerAs"]', item.signerAs);
            cy.get('[data-testid="signerAge"]').type(item.signerAge);
            cy.get('[data-testid="phone"]').type(item.phone);
          });
      cy.get('[data-testid="familyName"]').type(item.familyName);
      chooseFromDropdown('[data-testid="familyAs"]', item.familyAs);
      chooseFromDropdown('[data-testid="staffCompanion"]', item.staffCompanion);
      item.patientAgreement
        ? cy.get('[data-testid="patienAgreement"]').click({ force: true })
        : cy.get('[data-testid="!patienAgreement"]').click({ force: true });

      cy.get('[data-testid="print"]')
        .click()
        .then(() => {
          cy.get('.menuable__content__active > .v-list')
            .last()
            .contains(' Print Formulir Informed Consent ')
            .wait(1000)
            .click({ force: true });
        });
      cy.window().then(win => {
        win.print();
        expect(win.print).to.be.calledOnce;
      });
      cy.get('[data-testid="Simpan"]').click();
    });
  });
});
