/// <reference types="cypress" />

import { lettersData } from '../../../../support/dataHelper';
import {
  chooseFrom2RadioBtn,
  chooseFromDropdown,
  datePicker,
  lastDropdown,
  loginUser,
  newPatientOutpatient,
  timePicker,
} from '../../../../support/helpers';
const moment = require('moment');
const latestDate = moment()
  .endOf('month')
  .format('DD');
const todayDate = moment().format('DD');

describe('Letters', () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.viewport(1920, 1080);
    cy.visit('http://localhost:8080/'); // Visit apps
  });
  it('Regist outpatient', () => {
    lettersData();
    loginUser();
    newPatientOutpatient('Poli Umum');
  });
  it('Outpatient Warrant letter', () => {
    cy.intercept(
      'http://localhost:4000/letter/out-patient-control-letter/registration/**',
    ).as('getOutpatientControl');
    //Direct user from dashboard to letter page
    openLetterPage();
    //choose tab letter
    cy.get('[data-warrant="Surat Kontrol Rawat Jalan"]')
      .click()
      .wait('@getOutpatientControl');
    cy.fixture('lettersData').then(data => {
      lastDropdown(
        '[data-outpatient-warrant="returnStatus"]',
        data.outpatientWarrant.returnStatus,
      );
      cy.get('[data-outpatient-warrant="doctor"]').then($input => {
        const doc = $input.val();

        if (doc != null) {
          chooseFromDropdown('[data-outpatient-warrant="doctor"]', data.doctor);
        } else {
          cy.get('.v-input__append-inner').click();
          chooseFromDropdown('[data-outpatient-warrant="doctor"]', data.doctor);
        }
      });
      if (todayDate == latestDate) {
        cy.get('[aria-label="Next month"]').click();
        datePicker(
          '[data-outpatient-warrant="controlDate"]',
          data.outpatientWarrant.controlDate,
        );
      } else {
        datePicker(
          '[data-outpatient-warrant="controlDate"]',
          data.outpatientWarrant.controlDate,
        );
      }
      for (let index in data.diagnose) {
        chooseFromDropdown(
          `[data-outpatient-warrant="diagnose${index}"]`,
          data.diagnose[index],
        );
      }
      for (let index in data.outpatientWarrant.therapies) {
        cy.get(`[data-outpatient-warrant="therapies${index}"]`).type(
          data.outpatientWarrant.therapies[index],
        );
      }
      for (let index in data.outpatientWarrant.suggestions) {
        cy.get(`[data-outpatient-warrant="suggestions${index}"]`).type(
          data.outpatientWarrant.suggestions[index],
        );
      }
      cy.get('[data-outpatient-warrant="simpan"]')
        .click()
        .wait(1000);
    });
  });
  it('Inpatient Warrant letter', () => {
    cy.intercept(
      'http://localhost:4000/letter/control-inpatient-letter/registration/**',
    ).as('getInpatientControl');
    //Direct user from dashboard to letter page
    openLetterPage();
    //choose tab letter
    cy.get('[data-warrant="Surat Perintah Rawat Inap"]')
      .click()
      .wait('getInpatientControl');
    cy.fixture('lettersData').then(data => {
      lastDropdown(
        '[data-inpatient-warrant="penjamin"]',
        data.inpatientWarrant.guarantorType,
      );
      chooseFromDropdown(
        '[data-inpatient-warrant="kasus"]',
        data.inpatientWarrant.caseType,
      );
      cy.get('[data-inpatient-warrant="dpjp"]').then($input => {
        const doc = $input.val();

        if (doc != null) {
          chooseFromDropdown('[data-inpatient-warrant="dpjp"]', data.doctor);
        } else {
          cy.get('.v-input__append-inner').click();
          chooseFromDropdown('[data-inpatient-warrant="dpjp"]', data.doctor);
        }
      });
      lastDropdown(
        '[data-inpatient-warrant="pelayanan"]',
        data.inpatientWarrant.serviceType,
      );
      chooseFromDropdown(
        '[data-inpatient-warrant="diagnose0"]',
        'Retained dental root',
      );
      cy.get('[data-inpatient-warrant="simpan"]')
        .click()
        .wait(1000);
      cy.get('.swal2-confirm').click();
    });
  });
  it('Hospital Referral letter', () => {
    cy.intercept(
      'http://localhost:4000/letter/referral-patient-letter/registration/**',
    ).as('getReferral');
    //Direct user from dashboard to letter page
    openLetterPage();
    //choose tab letter
    cy.get('[data-warrant="Surat Rujukan ke Rumah Sakit"]')
      .click()
      .wait('@getReferral');
    cy.fixture('lettersData').then(data => {
      cy.get('[data-hospital-referral="doctor"]').then($input => {
        const doc = $input.val();

        if (doc != null) {
          chooseFromDropdown('[data-hospital-referral="doctor"]', data.doctor);
        } else {
          cy.get('.v-input__append-inner').click();
          chooseFromDropdown('[data-hospital-referral="doctor"]', data.doctor);
        }
      });
      chooseFromDropdown(
        '[data-hospital-referral="diagnose"]',
        'Retained dental root',
      );
      if (data.hospitalReferral.referralPurpose == 'Spesialis') {
        cy.get('[data-hospital-referral="specialist"]').click({ force: true });
        chooseFromDropdown(
          '[data-hospital-referral="referralSpecialist"]',
          data.hospitalReferral.specialist,
        );
      } else {
        cy.get('[data-hospital-referral="particular"]').click({ force: true });
        chooseFromDropdown(
          '[data-hospital-referral="referralSpecialist"]',
          data.hospitalReferral.specific,
        );
      }
      cy.get('[data-hospital-referral="instansi"]').type('Tadika Mesra');
      cy.get('[data-hospital-referral="therapy"]').type(
        data.hospitalReferral.therapy,
      );
      cy.get('[data-hospital-referral="suggestion"]').type(
        data.hospitalReferral.suggestions,
      );
      cy.get('[data-hospital-referral="simpan"]').click();
    });
  });
  it('Dead letter', () => {
    cy.intercept(
      'http://localhost:4000/letter/death-patient-letter/registration/**',
    ).as('getDeathLetter');
    //Direct user from dashboard to letter page
    openLetterPage();
    //choose tab letter
    cy.get('[data-warrant="Surat Keterangan Kematian"]')
      .click()
      .wait('@getDeathLetter');
    cy.fixture('lettersData').then(data => {
      cy.get('[data-mortality-letter="doctor"]').then($input => {
        const doc = $input.val();

        if (doc != null) {
          chooseFromDropdown('[data-mortality-letter="doctor"]', data.doctor);
        } else {
          cy.get('.v-input__append-inner').click();
          chooseFromDropdown('[data-mortality-letter="doctor"]', data.doctor);
        }
      });
      datePicker('[data-mortality-letter="date"]', data.deadLetter.date);
      timePicker(
        '[data-mortality-letter="time"]',
        data.deadLetter.time[0],
        data.deadLetter.time[1],
      );
      lastDropdown(
        '[data-mortality-letter="disease"]',
        data.deadLetter.disease,
      );
      cy.get('[data-mortality-letter="simpan"]').click();
      cy.get('.swal2-confirm').click();
      cy.get('[data-mortality-letter="doa"]').click({ force: true });
      cy.get('[data-mortality-letter="simpan"]').click();
    });
  });
  it('Sick letter', () => {
    cy.intercept(
      'http://localhost:4000/letter/sick-patient-letter/registration/**',
    ).as('getSickLetter');
    //Direct user from dashboard to letter page
    openLetterPage();
    //choose tab letter
    cy.get('[data-warrant="Surat Keterangan Sakit"]')
      .click()
      .wait('@getSickLetter');
    cy.fixture('lettersData').then(data => {
      cy.get('[data-sick-letter="doctor"]').then($input => {
        const doc = $input.val();

        if (doc != null) {
          chooseFromDropdown('[data-sick-letter="doctor"]', data.doctor);
        } else {
          cy.get('.v-input__append-inner').click();
          chooseFromDropdown('[data-sick-letter="doctor"]', data.doctor);
        }
      });
      if (todayDate == latestDate) {
        cy.get('[aria-label="Next month"]').click();
        datePicker('[data-sick-letter="endDate"]', data.sickLetter.endDate);
      } else {
        datePicker('[data-sick-letter="endDate"]', data.sickLetter.endDate);
      }
      cy.get('[data-sick-letter="simpan"]').click();
    });
  });
  it('Doctor letter', () => {
    cy.intercept(
      'http://localhost:4000/letter/healthy-patient-letter/registration/**',
    ).as('getHealtyLetter');
    lettersData();
    //Direct user from dashboard to letter page
    openLetterPage();
    //choose tab letter
    cy.get('[data-warrant="Surat Keterangan Dokter"]')
      .click()
      .wait('@@getHealtyLetter');
    cy.fixture('lettersData').then(data => {
      cy.get('[data-doctor-letter="doctor"]').then($input => {
        const doc = $input.val();

        if (doc != null) {
          chooseFromDropdown('[data-doctor-letter="doctor"]', data.doctor);
        } else {
          cy.get('.v-input__append-inner').click();
          chooseFromDropdown('[data-doctor-letter="doctor"]', data.doctor);
        }
      });
      lastDropdown(
        '[data-doctor-letter="patientCondition"]',
        data.doctorLetter.patientCondition,
      );
      cy.get('[data-doctor-letter="purpose"]').type(data.doctorLetter.purpose);
      cy.get('[data-doctor-letter="height"]').type(data.doctorLetter.height);
      cy.get('[data-doctor-letter="weight"]').type(data.doctorLetter.weight);
      cy.log(data.doctorLetter.siastole);
      cy.log(data.doctorLetter.diastole);
      cy.get('[data-doctor-letter="sistole"]').type(data.doctorLetter.siastole);
      cy.get('[data-doctor-letter="diastole"]').type(
        data.doctorLetter.diastole,
      );
      cy.get('[data-doctor-letter="pulse"]').type(data.doctorLetter.pulse);
      cy.get('[data-doctor-letter="respiration"]').type(
        data.doctorLetter.respiration,
      );
      cy.get('[data-doctor-letter="simpan"]').click();
    });
  });
});

function openLetterPage() {
  cy.intercept('http://localhost:4000/patient/registration/unit?**').as(
    'getDashboardPolyData',
  );
  loginUser();
  cy.get('[data-sidebar="Parent Pelayanan"]').click();
  cy.get('[data-sidebar="Pelayanan Poli Umum"]').click();
  cy.fixture('outpatientRegisData').then(data => {
    cy.wait('@getDashboardPolyData');
    cy.get('[data-general-poly="search"]').type(data.name);
    cy.get('tr').then(() => {
      cy.get('td')
        .contains(data.name)
        .click();
      cy.get('[data-general-poly="surat"]').click();
    });
  });
}
