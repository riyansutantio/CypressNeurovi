/* eslint-disable no-undef */
/// <reference types="cypress" />
import {
  loginUser,
  chooseFrom2RadioBtn,
  datePicker,
  chooseFromDropdown,
} from '../../../support/helpers';
import { createMasterDataStaff } from '../../../support/dataHelper';

describe('Master data staff', () => {
  beforeEach(() => {
    cy.viewport(1920, 1080);
    cy.visit('http://localhost:8080/'); // Visit apps

    loginUser();
    //klik master data
    cy.get('[data-testid="Parent Master Data"]').click();
    //klik staff
    cy.get('[data-testid="Master Data Staf"]').click();
  });
  it('Add staff', () => {
    createMasterDataStaff();
    cy.fixture('createMasterDataStaff').then(data => {
      cy.get('[data-testid="tambah"]').click();
      cy.get('[data-testid="nip"]').type(data.nip);
      cy.get('[data-testid="name"]').type(data.name);
      cy.get('[data-testid="nik"]').type(data.nik);
      chooseFrom2RadioBtn(
        '[data-testid="gender"]',
        '[data-testid="!gender"]',
        data.gender,
      );
      datePicker('[data-testid="birth"]', data.currentDate);
      cy.get('[data-testid="ok"]').click();
      cy.get('[data-testid="tempat lahir"]').type(data.placeBirth);
      cy.get('[data-testid="alamat"]').type(data.placeBirth);
      cy.get('[data-testid="telp"]').type(data.phoneNumber);
      chooseFromDropdown('[data-testid="agama"]', data.religion);
      chooseFromDropdown('[data-testid="bank"]', data.bank);
      cy.get('[data-testid="account"]').type(data.accountNumber);
      cy.get('[data-testid="password"]').type('Neurovi123');
      chooseFromDropdown('[data-testid="goldar"]', data.bloodType);
      cy.get('[data-testid="str"]').type(data.str);
      cy.get('[data-testid="batas str"]').type(data.str);
      cy.get('[data-testid="sip"]').type(data.sip);
      cy.get('[data-testid="batas sip"]').type(data.sip);
      cy.get('[data-testid="sik"]').type(data.sik);
      cy.get('[data-testid="batas sik"]').type(data.sik);
      chooseFromDropdown('[data-testid="spesialis"]', data.specialist);
      // datePicker('[data-testid="tanggal praktek"]', data.currentDate);
      // cy.get('[data-testid="okpraktek"]').click();
      chooseFromDropdown('[data-testid="role"]', data.role);
      chooseFromDropdown('[data-testid="poli"]', data.unit);
      cy.get('[data-testid="detail"]').type('detail');
      chooseFrom2RadioBtn(
        '[data-testid="aktif"]',
        '[data-testid="tidak aktif"]',
        data.isActive,
      );
      cy.get('[data-testid="simpan"]').click();
      cy.get('.swal2-confirm').click();
    });
  });

  it('Edit staff', () => {
    cy.fixture('createMasterDataStaff').then(data => {
      cy.get('[data-testid="search"]').type(data.name);
      cy.contains(data.name).click();
      cy.get('[data-testid="ubah"]').click();
      cy.get('[data-testid="name"]').type(` Edited`);
      cy.get('[data-testid="simpan"]').click();
      cy.get('.swal2-confirm').click();
    });
  });

  it('Edit access right staff', () => {
    cy.fixture('createMasterDataStaff').then(data => {
      cy.intercept('http://localhost:4000/master/staff?**').as('waitSearch');
      cy.intercept('http://localhost:4000/master/staff/staffAccess/**').as(
        'waitAccess',
      );

      cy.get('[data-testid="search"]').type(data.name);
      cy.wait('@waitSearch');
      cy.get('tbody')
        .contains(data.name)
        .click({ force: true });

      cy.get('[data-testid="akses"]').click();

      cy.wait('@waitAccess').then(item => {
        const items = item.response?.body.data;
        items.pop();
        for (let i in items) {
          cy.get(`[data-testid="${items[i].menu}"]`)
            .find('.v-treeview-node__checkbox')
            .click();
        }
        console.log(item.response?.body.data);
        cy.pause();
      });

      cy.get('[data-testid="simpan"]').click();
    });
  });

  it('Edit password staff', () => {
    cy.fixture('createMasterDataStaff').then(data => {
      cy.intercept('http://localhost:4000/master/staff?**').as('waitSearch');

      cy.get('[data-testid="search"]').type(data.name);
      cy.wait('@waitSearch');
      cy.get('tbody')
        .contains(data.name)
        .click({ force: true });

      cy.get('[data-testid="gantisandi"]').click();

      cy.get('[data-testid="password"]').type('Neurovi123');
      cy.get('[data-testid="confirmation"]').type('Neurovi123');

      cy.get('[data-testid="save"]').click();
    });
  });
});
