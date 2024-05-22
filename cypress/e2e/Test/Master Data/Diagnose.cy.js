/* eslint-disable no-undef */
const moment = require('moment');
import { loginUser } from '../../../support/helpers';
/// <reference types="cypress" />
const uniqueSeed = moment().format('DD/MM/YYYY');
const getUniqueId = () => Cypress._.uniqueId(uniqueSeed);
const uniqueId = getUniqueId();

describe('Input Diagnosa - MD Diagnosa', () => {
  beforeEach(() => {
    cy.viewport(1920, 1080);
    cy.visit('http://localhost:8080/'); // Visit apps

    loginUser();
    //klik master data
    cy.get('[data-testid="Parent Master Data"]').click();
    //klik diagnose
    cy.get('[data-testid="Master Data Diagnosa"]').click();
  });
  it('Input new diagnose', () => {
    //klik + button
    cy.get('[data-testid="tambah"]').click();
    //masukan kode diagnosa
    cy.get('[data-testid="code"]').type(`Automated${uniqueId}`);
    //masukan deskripsi diagnosa
    cy.get('[data-testid="description"]').type(
      'This description are automated',
    );
    //Simpan
    cy.get('.v-card__actions > .v-btn--has-bg').click();
    //OK
    cy.get('.swal2-confirm').click();
    cy.wait(2000);
  });

  it('Edit new diagnose', () => {
    //Mencari diagnosa yang sudah dimasukkan sebelumnya
    cy.get('[data-testid="search"]').type(`Automated${uniqueId}`);
    cy.wait(1000);
    //Menekan data
    cy.contains(`Automated${uniqueId}`).click();
    //Menekan ikon update
    cy.get('[data-testid="update"]').click();
    //masukan deskripsi diagnosa
    cy.get('[data-testid="description"]').type(' and edited');
    //Simpan
    cy.get('.v-card__actions > .v-btn--has-bg').click();
    //OK
    cy.get('.swal2-confirm').click();
    cy.wait(2000);
  });

  it('Delete new diagnose', () => {
    //Mencari diagnosa yang sudah dimasukkan sebelumnya
    cy.get('[data-testid="search"]').type(`Automated${uniqueId}`);
    cy.wait(1000);
    //Menekan data
    cy.contains(`Automated${uniqueId}`).click();
    //Menekan ikon update
    cy.get('[data-testid="hapus"]').click();
    //Menekan Ya pada pop-up
    cy.get('.swal2-confirm').click();
    //Menekan ok pada pop-up
    cy.get('.swal2-confirm').click();
    cy.wait(2000);
  });
});
