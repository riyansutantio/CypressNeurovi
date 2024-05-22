/* eslint-disable no-undef */
/// <reference types="cypress" />
import { createMasterDataBed } from '../../../support/dataHelper';
import { loginUser } from '../../../support/helpers';

describe('Master data Bed', () => {
  beforeEach(() => {
    cy.viewport(1920, 1080);
    cy.visit('http://localhost:8080/'); // Visit apps

    loginUser();
    //klik master data
    cy.get('[data-testid="Parent Master Data"]').click();
    //klik Prosedur
    cy.intercept('GET', 'http://localhost:4000/master/bed**').as('getBed');
    cy.get('[data-testid="Master Data Bed"]').click();
  });

  it('Add bed', () => {
    createMasterDataBed();
    cy.fixture('createMasterDataBed').then(data => {
      let availStatus;
      let indexBed;
      cy.wait(2000);
      cy.wait('@getBed').then(item => {
        const res = item.response.body;
        if (res.length < 10) {
          cy.get('[data-testid="tambah"]').click();
          cy.get('[data-testid="nomor"]').type(data.number);
          data.broken
            ? cy.get('[data-testid="tersedia"]').click({ force: true })
            : cy.get('[data-testid="rusak"]').click({ force: true });
          cy.get('[data-testid="simpan"]')
            .click()
            .wait(1000);
          cy.get('.swal2-confirm').click();
        }
        if (res.length == 10) {
          for (let i = 1; i < +res.length - 1; i++) {
            if (res.data[i].availability == 'broken') {
              availStatus = 'broken';
              indexBed = i;
              break;
            }
            if (res.data[i].availability == 'available') {
              availStatus = 'available';
              indexBed = i;
              break;
            } else {
              availStatus = 'unavailable';
              indexBed = i;
            }
          }
        }
        if (indexBed == res?.length - 1 && availStatus == 'unavailable') {
          cy.intercept('GET', 'http://localhost:4000/inpatient**').as(
            'getInpatientData',
          );
          cy.get('[data-testid="Parent Pelayanan"]').click();
          cy.get('[data-testid="Pelayanan Rawat Inap"]').click();
          cy.wait('@getInpatientData').then(x => {
            let res = x?.response?.body?.data[0];
            cy.get('[data-inpatient="search"]').type(res.medical_record_number);
            cy.contains(res.medical_record_number).click();
            cy.get('[data-testid="selesai"]').click();
            cy.get('[data-testid="pulangkan pasien"]').click();
            cy.get('[data-testid="lanjutkan"]')
              .click()
              .wait(1500);
            cy.get('.swal2-confirm').click();
            //go to master data bed
            cy.get('[data-testid="Parent Master Data"]').click();
            cy.get('[data-testid="Master Data Bed"]').click();
            cy.get('[data-testid="search"]').type(res.bed_number);
            cy.get('[data-testid="hapus0"]')
              .click()
              .wait(1500);
            cy.get('.swal2-confirm').click();
            //add bed
            cy.get('[data-testid="tambah"]').click();
            cy.get('[data-testid="noomor"]').type(data.number);
            data.broken
              ? cy.get('[data-testid="tersedia"]').click({ force: true })
              : cy.get('[data-testid="rusak"]').click({ force: true });
            cy.get('[data-testid="simpan"]').click();
          });
        }
        if (availStatus == 'available' || availStatus == 'broken') {
          cy.get('[data-testid="search"]').type(res.data[indexBed].bed_number);
          cy.get(`[data-testid="hapus0"]`).click();
          cy.get('.swal2-confirm')
            .click()
            .wait(2000);
          cy.get('.swal2-confirm')
            .click()
            .wait(2000);
          cy.get('[data-testid="tambah"]').click();
          cy.get('[data-testid="nomor"]').type(data.number);
          data.broken
            ? cy.get('[data-testid="tersedia"]').click({ force: true })
            : cy.get('[data-testid="rusak"]').click({ force: true });
          cy.get('[data-testid="simpan"]').click();
        }
      });
    });
  });

  it('Edit bed', () => {
    cy.fixture('createMasterDataBed').then(data => {
      cy.get('[data-testid="search"]').type(data.number);
      // cy.get('[data-bed="search"]').type(uniqueId);
      cy.wait(1500);
      cy.get('[data-testid="ubah0"]')
        .click()
        .first();
      cy.get('[data-testid="nomor"]').type(data.edit);
      !data.isBroken
        ? cy.get('[data-testid="tersedia"]').click({ force: true })
        : cy.get('[data-testid="rusak"]').click({ force: true });
      cy.get('[data-testid="simpan"]').click();
      cy.get('.swal2-confirm').click();
    });
  });

  it('Delete bed', () => {
    cy.fixture('createMasterDataBed').then(data => {
      cy.get('[data-testid="search"]').type(data.number + data.edit);
      cy.get('[data-testid="hapus0"]')
        .click()
        .first();
      cy.wait(1500);
      cy.get('.swal2-confirm').click();
    });
  });
});
