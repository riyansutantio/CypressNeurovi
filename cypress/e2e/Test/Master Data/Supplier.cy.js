/* eslint-disable no-undef */
/// <reference types="cypress" />
import { loginUser } from '../../../support/helpers';
const moment = require('moment');
const uniqueSeed = moment().format('DD/MM/YYYY');
const getUniqueId = () => Cypress._.uniqueId(uniqueSeed);
const uniqueId = '-' + getUniqueId();
const telp = Cypress._.random(0, 1000000);
const alamat = 'Generate template by automation';
const email = 'automated@gmail.com';
const dueDate = Cypress._.random(0, 31);

describe('Master data Unit', () => {
  beforeEach(() => {
    cy.viewport(1920, 1080);
    cy.visit('http://localhost:8080/'); // Visit apps

    loginUser();
    //klik master data
    cy.get('[data-testid="Parent Master Data"]').click();
    //klik supplier
    cy.get('[data-testid="Master Data Supplier"]').click();
  });

  it('Add Supplier', () => {
    cy.get('[data-testid="tambah"]').click();
    cy.get('[data-testid="nama"]').type(`Automated${uniqueId}`);
    cy.get('[data-testid="alamat"]').type(alamat);
    cy.get('[data-testid="telp"]').type(`082134${telp}`);
    cy.get('[data-testid="email"]').type(email);
    cy.get('[data-testid="tanggal"]').type(dueDate);
    cy.get('[data-testid="simpan"]').click();
    cy.get('.swal2-confirm').click();
  });

  it('Edit supplier', () => {
    cy.get('[data-testid="search"]').type(`Automated${uniqueId}`);
    cy.contains(`Automated${uniqueId}`).click();
    cy.get('[data-testid="ubah"]').click();
    cy.get('[data-testid="nama"]').type(` Edited`);
    cy.get('[data-testid="alamat"]').type(` Edited`);
    cy.get('[data-testid="telp"]').type(`11`);
    cy.get('[data-testid="email"]').type(` Edited`);
    cy.get('[data-testid="tanggal"]').type(`1`);
    cy.get('[data-testid="simpan"]').click();
    cy.get('.swal2-confirm').click();
  });

  it('Delete supplier', () => {
    cy.get('[data-testid="search"]').type(`Automated${uniqueId}`);
    cy.contains(`Automated${uniqueId}`).click();
    cy.get('[data-testid="hapus"]').click();
    cy.get('.swal2-confirm').click();
  });
});
