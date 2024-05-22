/// <reference types="cypress" />

import {
  chooseFromDropdown,
  formTTVAnamnesis,
  lastDropdown,
  loginUser,
} from '../../../../support/helpers';

describe('Mendaftarkan pasien lama ke rawat jalan', () => {
  before(() => {
    cy.viewport(1920, 1080);
    cy.visit('http://localhost:8080/'); // Visit apps

    loginUser();
    cy.get('[data-testid="Parent Pendaftaran"]').click();
    cy.get('[data-testid="Pendaftaran Rawat Jalan"]').click();
  });

  it('Regist Outpatient Old Patient', () => {
    cy.fixture('outpatientRegisData').then(data => {
      cy.get('[data-testid="tambah"]')
        .click()
        .wait(1500);
      cy.get('[data-testid="pilih"]').click();
      cy.get('[data-testid="name"]')
        .type('000327')
        .wait(3000)
        .then(() => {
          cy.get('[data-testid="daftar 000327"]').click();
        });
      cy.get('[data-testid="bpjs"]').click({ force: true });
      cy.wait(1000);
      cy.get('[data-testid="lanjut"]').click();

      //Fill TTV & Anamnesis form
      formTTVAnamnesis(data);

      //Fill outpatient form
      cy.intercept('POST', 'http://localhost:4000/schedule/dropdown').as(
        'postDoctorSchedule',
      );
      lastDropdown('[data-testid="poli"]', 'Poli Umum');
      chooseFromDropdown('[data-testid="dokter"]', data.doctor);
      cy.wait('@postDoctorSchedule');
      cy.get('[data-testid="daftar"]').click();
      cy.get('.swal2-confirm').click();
      cy.get('.v-card__title > .v-btn > .v-btn__content > .v-icon').click();
    });
  });
});
function printClose() {
  window.close();
}
