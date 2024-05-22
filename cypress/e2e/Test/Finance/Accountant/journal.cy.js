/// <reference types="cypress" />
import { loginUser } from '../../../support/helpers';
describe('Daftar jurnal', () => {
  beforeEach(() => {
    cy.viewport(1920, 1080);
    cy.visit('http://localhost:8080/'); // Visit apps

    loginUser();
    //klik master data
    cy.contains('Keuangan').click();
    //klik Prosedur
    cy.contains('Akuntansi').click();
  });

  it('daftar jurnal', () => {
    cy.get('[data-accountant-jurnal="jurnal"]').click();
    cy.get('[data-accountant-jurnal="daftar jurnal"]')
      .click()
      .wait(1500);
    cy.get('[data-daftar-jurnal="tambah"]').click();
    cy.get('[data-detail-journal="entry"]').click();
    cy.get('[data-entry-journal="tipe"]')
      .click()
      .then(() => {
        cy.get('.v-list')
          .last()
          .contains('Pasien')
          .click();
      });

    cy.pause();
  });
});
