/// <reference types="cypress" />

import { createPatientJson } from '../../../../support/dataHelper';
import {
  chooseFromDropdown,
  formTTVAnamnesis,
  lastDropdown,
  loginUser,
  newPatientOutpatient,
} from '../../../../support/helpers';

describe('Mendaftarkan pasien lama ke rawat jalan', () => {
  beforeEach(() => {
    // createPatientJson();
    cy.viewport(1920, 1080);
    cy.visit('http://localhost:8080/'); // Visit apps
    loginUser();
  });

  it('Regist Booking Outpatient Old Patient', () => {
    cy.get('[data-testid="Parent Pendaftaran"]').click();
    cy.get('[data-testid="Pendaftaran Rawat Jalan"]').click();
    cy.fixture('outpatientRegisData').then(data => {
      cy.intercept('http://localhost:4000/patient/emr/all**').as('getUser');
      cy.intercept('http://localhost:4000/patient/emr/social/**').as(
        'getSocialDataUser',
      );
      cy.get('[data-testid="tambah"]')
        .click()
        .wait(1500); //Add old patient to outpatient
      cy.get('[data-testid="pilih"]').click();
      cy.get('[data-testid="name"]').type(data.noRm);
      cy.wait('@getUser').then(item => {
        const res = item.response.body.data[0].medical_record_number;
        cy.get(`[data-testid="daftar ${res}"]`).click();
        if (item.response.body.data[0].social.assurance.type != 'umum') {
          cy.get('[data-testid="umum"]').click();
        }
      });
      cy.wait('@getSocialDataUser');

      cy.get('[data-testid="lanjut"]')
        .last()
        .click();

      //Fill TTV & Anamnesis form
      formTTVAnamnesis(data);

      //Fill outpatient form
      lastDropdown('[data-testid="poli"]', data.poly);
      chooseFromDropdown('[data-testid="dokter"]', data.doctor);
      cy.wait(2000);
      lastDropdown('[data-testid="hari"]', data.bookingDate);
      cy.get('[data-testid="daftar"]').click();
      cy.get('.swal2-confirm').click();
      cy.get('.v-card__title > .v-btn > .v-btn__content > .v-icon').click();
    });
  });

  it('Regist Booking New Outpatient Patient', () => {
    cy.fixture('outpatientRegisData').then(data => {
      cy.get('[data-testid="Parent Pendaftaran"]').click();
      cy.get('[data-testid="Pendaftaran Rawat Jalan"]').click();

      cy.get('[data-testid="tambah"]').click();
      cy.get('[data-testid="daftar"]').click();

      //fill data social patient
      cy.get('[data-testid="nama"]').type(data.name);
      lastDropdown('[data-testid="status"]', data.patientStatus);
      if (data.patientStatus == 'Bayi' || data.patientStatus == 'Anak') {
        data.isMale
          ? cy.get('[data-testid="laki"]').click({ force: true })
          : cy.get('[data-testid="perempuan"]').click({ force: true });
      }
      cy.get('[data-testid="tempat lahir"]').type(data.address.state);
      cy.get('[data-testid="tanggal lahir"]').type(data.dateBirth);
      if (data.guaranteeType == 'Umum') {
        cy.get('[data-testid="umum"]').click({ force: true });
      } else if (data.guaranteeType == 'Asuransi') {
        cy.get('[data-testid="asuransi"]').click({ force: true });
        cy.get('[data-testid="nama asuransi"]')
          .click({ force: true })
          .then(() => {
            cy.wait(1000);
            cy.get('.v-list')
              .last()
              .contains(data.insurance)
              .click();
          });
        cy.get('[data-testid="no asuransi"]').type(data.insuranceNumer);
      }
      cy.get('[data-testid="alamat"]').type(
        `${data.address.street}, ${data.address.city}, ${data.address.state}, ${data.address.zipcode}, ${data.address.country}.`,
      );
      lastDropdown('[data-testid="agama"]', data.religion);
      lastDropdown('[data-testid="goldar"]', data.bloodType);
      lastDropdown('[data-testid="pendidikan"]', data.education);
      lastDropdown('[data-testid="status kawin"]', data.martialStatus);
      cy.get('[data-testid="nama ayah"]').type(data.fatherName);
      cy.get('[data-testid="nama ibu"]').type(data.motherName);

      //click button lanjut
      cy.get('[data-testid="lanjut"]').click();
      //Fill TTV & Anamnesis form
      formTTVAnamnesis(data);

      //Fill outpatient form
      cy.intercept('POST', 'http://localhost:4000/schedule/dropdown').as(
        'postDoctorSchedule',
      );
      lastDropdown('[data-testid="poli"]', data.poly);
      chooseFromDropdown('[data-testid="dokter"]', data.doctor);
      cy.wait(2000);
      lastDropdown('[data-testid="hari"]', data.bookingDate);
      cy.get('[data-testid="daftar"]').click();
      cy.get('.swal2-confirm').click();
      cy.get('.v-card__title > .v-btn > .v-btn__content > .v-icon').click();
    });
  });
});
