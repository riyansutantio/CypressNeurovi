/* eslint-disable no-undef */
/// <reference types="cypress" />
import { loginUser } from '../../../support/helpers';
const moment = require('moment');
const uniqueSeed = moment().format('DD/MM/YYYY');
const getUniqueId = () => Cypress._.uniqueId(uniqueSeed);
const kode = '-' + getUniqueId();
describe('Master data Prosedur', () => {
  beforeEach(() => {
    cy.viewport(1920, 1080);
    cy.visit('http://localhost:8080/'); // Visit apps

    loginUser();
    //klik master data
    cy.get('[data-testid="Parent Master Data"]').click();
    //klik prosedur
    cy.get('[data-testid="Master Data Prosedur"]').click();
  });

  it('Add procedure', () => {
    cy.get('[data-testid="tambah"]').click();
    cy.get('[data-testid="kode"]').type(`Automated${kode}`);
    cy.get('[data-testid="deskripsi"]').type('this text is automate generated');
    cy.get('[data-testid="simpan"]').click();
    cy.get('.swal2-confirm').click();
  });

  it('Edit Procedure', () => {
    cy.get('[data-testid="search"]').type(`Automated${kode}`);
    cy.contains(`Automated${kode}`).click();
    cy.get('[data-testid="ubah"]').click();
    cy.get('[data-testid="kode"]').type(` Edited`);
    cy.get('[data-testid="deskripsi"]').type(` Edited`);
    cy.get('[data-testid="simpan"]').click();
    cy.get('.swal2-confirm').click();
  });

  it('Delete Procedure', () => {
    cy.get('[data-testid="search"]').type(`Automated${kode}`);
    cy.contains(`Automated${kode}`).click();
    cy.get('[data-testid="hapus"]').click();
    cy.get('.swal2-confirm').click();
    cy.get('.swal2-confirm').click();
  });
});
