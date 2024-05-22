/// <reference types="cypress" />

import moment from 'moment';
import {
  createPatientJson,
  inpatientEMRData,
} from '../../../../support/dataHelper';
import {
  addOutpatientRegistration,
  chooseFromDropdown,
  clearCookies,
  datePicker,
  dropdownVlist,
  fillInpatientOrder,
  inpatientRegistration,
  loginUser,
} from '../../../../support/helpers';
import { faker } from '@faker-js/faker';

describe('Inpatient Letters', () => {
  before(() => {
    clearCookies();
    inpatientEMRData();
    cy.viewport(1920, 1080);
    cy.visit('http://localhost:8080/', {
      onBeforeLoad: win => {
        cy.stub(win, 'print');
      },
    }); // Visit apps
    loginUser('admin', 'admin123');
    createPatientJson();
    addOutpatientRegistration();
  });

  it('add  letters', () => {
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
      cy.get('[data-testid="surat"]').click();
    });

    dropdownVlist(
      '[data-testid="returnStatus"]',
      Cypress._.random() < 0.5 ? 'Sembuh' : 'Belum Sembuh',
    );
    datePicker('[data-testid="datePicker"]', moment().format('D'));
    chooseFromDropdown('[data-testid="diagnose0"]', 'K01.0');
    cy.get('[data-testid="therapies0"]').type(faker.lorem.text(1));
    cy.get('[data-testid="suggestions0"]').type(faker.lorem.text(1));
    cy.get('[data-testid="simpan"]').click();
    cy.get('#swal2-title').should($item => {
      expect($item).to.contain('Surat Keterangan Rawat Jalan Berhasil Dibuat');
    });
    cy.get('.swal2-confirm').click();

    cy.get('[data-testid="Surat Rujukan ke Rumah Sakit"]').click();
    chooseFromDropdown('[data-testid="diagnose"]', 'Embedded teeth');

    switch (Cypress._.random() < 0.5) {
      case true:
        cy.get('[data-testid="specialist"]').click({ force: true });
        chooseFromDropdown(
          '[data-testid="referralSpecialist"]',
          'Gigi Bedah Mulut',
        );
        break;
      case false:
        cy.get('[data-testid="particular"]').click({ force: true });
        chooseFromDropdown(
          '[data-testid="referralSpecialist"]',
          'Sarana Kemoterapi',
        );
        break;
    }
    cy.get('[data-testid="instansi"]').type('RSUD Ir. Soekarno');
    cy.get('[data-testid="therapy"]').type(faker.lorem.text(1));
    cy.get('[data-testid="suggestion"]').type(faker.lorem.text(1));
    cy.get('[data-testid="simpan"]')
      .last()
      .click();
    cy.get('#swal2-title').should($item => {
      expect($item).to.contain('Surat Rujukan ke Rumah Sakit Berhasil Dibuat');
    });
    cy.get('.swal2-confirm').click();

    //surat keterangan kematian
    cy.get('[data-testid="Surat Keterangan Kematian"]').click();
    if (Cypress._.random() < 0.5) {
      datePicker('[data-testid="date"]', moment().format('D'));
      cy.get('[data-testid="time"]').type('12:12');
      dropdownVlist(
        '[data-testid="disease"]',
        Cypress._.random() < 0.5 ? 'Menular' : 'Tidak Menular',
      );
    } else {
      cy.get('[data-testid="doa"]').click({ force: true });
      datePicker('[data-testid="date"]', moment().format('D'));
      cy.get('[data-testid="time"]').type('12:12');
      dropdownVlist(
        '[data-testid="disease"]',
        Cypress._.random() < 0.5 ? 'Menular' : 'Tidak Menular',
      );
    }
    cy.get('[data-testid="simpan"]')
      .last()
      .click();
    cy.get('#swal2-title').should($item => {
      expect($item).to.contain('Surat Keterangan Kematian Berhasil Dibuat');
    });
    cy.get('.swal2-confirm').click();

    //surat keterangan Sakit
    cy.get('[data-testid="Surat Keterangan Sakit"]').click();
    cy.get('[data-testid="height"]')
      .clear()
      .type('180');
    cy.get('[data-testid="weight"]')
      .clear()
      .type('80');
    cy.get('[data-testid="sitole"]')
      .clear()
      .type('120');
    cy.get('[data-testid="diastole"]')
      .clear()
      .type('90');
    cy.get('[data-testid="pulse"]')
      .clear()
      .type('90');
    cy.get('[data-testid="respiration"]')
      .clear()
      .type('22');
    cy.get('[data-testid="notes"]').type(faker.lorem.text(1));
    cy.get('[data-testid="simpan"]')
      .last()
      .click();
    cy.get('#swal2-title').should($item => {
      expect($item).to.contain('Surat Keterangan Kematian Berhasil Dibuat');
    });
    cy.get('.swal2-confirm').click();
  });
});
