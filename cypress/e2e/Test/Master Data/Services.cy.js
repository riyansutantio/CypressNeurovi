/* eslint-disable no-undef */
/// <reference types="cypress" />
import { createMasterDataServiceData } from '../../../support/dataHelper';
import { lastDropdown, loginUser } from '../../../support/helpers';
describe('Master data services', () => {
  beforeEach(() => {
    cy.viewport(1920, 1080);
    cy.visit('http://localhost:8080/'); // Visit apps

    loginUser();
    //klik master data
    cy.get('[data-testid="Parent Master Data"]').click();
    //klik layanan
    cy.get('[data-testid="Master Data Layanan"]').click();
  });

  it('Add services', () => {
    createMasterDataServiceData();
    cy.fixture('createMasterDataServiceData').then(data => {
      cy.get('[data-testid="tambah"]').click();
      cy.get('[data-testid="nama"]').type(data.code);
      lastDropdown('[data-testid="kategori"]', data.category);
      lastDropdown('[data-testid="unit"]', data.unit);
      // cy.contains('Input Tarif Layanan').click();
      if (data.category == 'Laboratorium') {
        cy.get('[data-testid="lis"]').type(data.codeLis);
      }
      // cy.get('[data-input-services="sub-category"]')
      //   .click()
      //   .then(() => {
      //     cy.wait(0);
      //     cy.get('.v-list-item__content > .v-list-item__title')
      //       .contains(data.subAdministration)
      //       .click({ foce: true });
      //     cy.contains('Input Tarif Layanan').click();
      //   });
      let tab = 0;
      switch (data.warrant) {
        case 'Asuransi':
          cy.get('[data-testid="asuransi"]').click();
          tab = 2;
          break;
        case 'BPJS':
          cy.get('[data-testid="bpjs"]').click();
          tab = 1;
          break;
      }
      fillServiceCost(tab, data, true);
    });
    cy.intercept('http://localhost:4000/master/service/').as('saving');
    cy.get('[data-testid="simpan"]').click();
    cy.wait('@saving');
    cy.get('.swal2-confirm').click();
  });

  it('Edit services', () => {
    cy.fixture('createMasterDataServiceData').then(data => {
      cy.get('[data-testid="search"]').type(data.code);
      cy.wait(1500);
      cy.get('[data-testid="ubah0"]')
        .should('be.visible')
        .first()
        .click();
      cy.get('[data-testid="nama"]').type(' edited');
      let tab = 0;
      switch (data.warrant) {
        case 'Asuransi':
          tab = 2;
          break;
        case 'BPJS':
          tab = 1;
          break;
        default:
          tab = 0;
      }
      fillServiceCost(tab, data, false);
    });
    cy.intercept('http://localhost:4000/master/service/').as('saving');
    cy.get('[data-testid="simpan"]').click();
    cy.wait('@saving');
    cy.get('.swal2-confirm').click();
  });

  it('Delete services', () => {
    cy.fixture('createMasterDataServiceData').then(data => {
      cy.get('[data-testid="search"]').type(data.code);
    });
    cy.wait(1500);
    cy.get('[data-testid="hapus0"]')
      .should('be.visible')
      .first()
      .click();
    cy.get('.swal2-confirm').click();
  });
});

function fillServiceCost(tab, data, ahpBHP) {
  cy.get(`[data-testid="staff-${tab}"]`)
    .last()
    .type(data.medicalServiceFee);
  cy.get(`[data-testid="specialize-${tab}"]`)
    .last()
    .type(data.medicalServiceFee);
  cy.get(`[data-testid="nurse-${tab}"]`)
    .last()
    .type(data.medicalServiceFee);
  cy.get(`[data-testid="midwife-${tab}"]`)
    .last()
    .type(data.medicalServiceFee);
  cy.get(`[data-testid="psychologist-${tab}"]`)
    .last()
    .type(data.medicalServiceFee);
  cy.get(`[data-testid="nutritionists-${tab}"]`)
    .last()
    .type(data.medicalServiceFee);
  cy.get(`[data-testid="healthAnalyst-${tab}"]`)
    .last()
    .type(data.medicalServiceFee);
  cy.get(`[data-testid="healthAnalyst-${tab}"]`)
    .last()
    .type(data.medicalServiceFee);
  cy.get(`[data-testid="radiografer-${tab}"]`)
    .last()
    .type(data.medicalServiceFee);

  if (ahpBHP == true) {
    cy.get(`[data-testid="medTool-${tab}"]`)
      .last()
      .click()
      .then(() => {
        cy.get('.v-list-item__content > .v-list-item__title')
          .contains(data.medicalTool)
          .click({ foce: true });
      });
    cy.get(`[data-testid="medToolQuantity-${tab}"]`)
      .last()
      .type(1);
    cy.get(`[data-testid="addMedTool-${tab}"]`)
      .last()
      .click();
    cy.get(`[data-testid="consumables-${tab}"]`)
      .last()
      .click()
      .then(() => {
        cy.get('.v-list-item__content > .v-list-item__title')
          .contains(data.medicalMaterial)
          .click({ foce: true });
      });
    cy.get(`[data-testid="consumablesQuantity-${tab}"]`)
      .last()
      .type(1);
    cy.get(`[data-testid="addConsumables-${tab}"]`)
      .last()
      .click();
  }

  cy.get(`[data-testid="beban-${tab}"]`)
    .last()
    .type(data.charge);
  cy.get(`[data-testid="margin-${tab}"]`)
    .last()
    .type(data.margin);
}
