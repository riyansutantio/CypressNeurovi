/* eslint-disable no-undef */
/// <reference types="cypress" />
import { chooseFromDropdown, loginUser } from '../../../support/helpers';
const moment = require('moment');
const uniqueSeed = moment().format('DD/MM/YYYY');
const getUniqueId = () => Cypress._.uniqueId(uniqueSeed);
const kode = '-' + getUniqueId();
const instalasiList = [
  'Administrasi dan Tata Usaha',
  'Farmasi',
  'Gudang Inti',
  'Instalasi Gawat Darurat',
  'Instalasi Penunjang Medis',
  'Instalasi Rawat Inap',
  'Instalasi Rawat Jalan',
  'Kesehatan Lingkungan',
];
const instalasi = instalasiList[Cypress._.random(0, 7)];
const isWarehouse = Cypress._.random() < 0.6; //if don't want to randomized ttv change this with true/false
const isPharmacy = Cypress._.random() < 0.6; //if don't want to randomized ttv change this with true/false

describe('Master data Unit', () => {
  beforeEach(() => {
    cy.viewport(1920, 1080);
    cy.visit('http://localhost:8080/'); // Visit apps

    loginUser();
    //klik master data
    cy.get('[data-testid="Parent Master Data"]').click();
    //klik unit
    cy.get('[data-testid="Master Data Unit"]').click();
  });

  it('Add unit', () => {
    cy.get('[data-testid="tambah"]').click();
    cy.get('[data-testid="nama"]').type(`Automated${kode}`);
    chooseFromDropdown('[data-testid="instalasi"]', instalasi);
    isWarehouse
      ? cy.get('[data-testid="gudang"]').click({ force: true })
      : cy.get('[data-testid="!gudang"]').click({ force: true });
    isPharmacy
      ? cy.get('[data-testid="farmasi"]').click({ force: true })
      : cy.get('[data-testid="!farmasi"]').click({ force: true });
    cy.get('[data-testid="simpan"]').click();
    cy.get('.swal2-confirm').click();
  });

  it('Edit unit', () => {
    cy.get('[data-testid="search"]').type(`Automated${kode}`);
    cy.contains(`Automated${kode}`).click();
    cy.get('[data-testid="ubah"]').click();
    cy.get('[data-testid="nama"]').type(` Edited`);
    cy.get('[data-testid="instalasi"]')
      .click()
      .then(() => {
        cy.get('.v-list-item__content > .v-list-item__title')
          .contains(instalasi)
          .should('be.visible')
          .click({ foce: true });
      });
    !isWarehouse
      ? cy.get('[data-testid="gudang"]').click({ force: true })
      : cy.get('[data-testid="!gudang"]').click({ force: true });
    !isPharmacy
      ? cy.get('[data-testid="farmasi"]').click({ force: true })
      : cy.get('[data-testid="!farmasi"]').click({ force: true });
    cy.get('[data-testid="simpan"]').click();
    cy.get('.swal2-confirm').click();
  });

  it('Delete unit', () => {
    cy.get('[data-testid="search"]').type(`Automated${kode}`);
    cy.contains(`Automated${kode}`).click();
    cy.get('[data-testid="hapus"]').click();
    cy.get('.swal2-confirm').click();
  });
});
