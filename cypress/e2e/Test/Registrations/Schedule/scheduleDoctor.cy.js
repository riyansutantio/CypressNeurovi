/// <reference types="cypress" />

import {
  chooseFromDropdown,
  lastDropdown,
  timePicker,
  loginUser,
} from '../../../../support/helpers';

const moment = require('moment');
const today = moment().format('D');
const poliList = ['Poli Umum', 'Poli Gigi', 'Poli KIA'];
const Poli = poliList[Cypress._.random(0, 2)];
const Dokter = 'Rahmat Budi Dermawan';
const kuota = Cypress._.random(10, 50);

describe('Pendaftaran Jadwal Dokter', () => {
  beforeEach(() => {
    cy.viewport(1920, 1080);
    cy.visit('http://localhost:8080/'); // Visit apps

    loginUser();
    cy.get('[data-testid="Parent Pendaftaran"]').click();
    cy.get('[data-testid="Pendaftaran Jadwal Dokter"]').click();
  });

  it('Add doctor`s schedule', () => {
    cy.intercept(
      'GET',
      'http://localhost:4000/schedule/default/unit-doctor/**',
      req => {
        req.reply({ statusCode: 404, body: 'Not Found' });
      },
    ).as('getSchedule');

    cy.get('[data-schedule="pengaturan"]').click();
    cy.fixture('outpatientRegisData').then(data => {
      chooseFromDropdown('[data-testid="dokter"]', data.doctor);
      lastDropdown('[data-testid="poli"]', data.poly);
      cy.wait('@getSchedule').then(schedule => {
        const res = schedule.response.statusCode;
        console.log(res);
        const schedules = schedule.response.body.data;
        if (res == 404) {
          cy.get('[data-testid="kode antrian"]')
            .invoke('val')
            .then(value => {
              // if (value.val === '') {
              cy.get('[data-testid="kode antrian"]').type(
                `Auto${Cypress._.uniqueId()}`,
              );
              // }
            });
          for (let i = 0; i < 7; i++) {
            timePicker(`[data-testid="start ${+i + 1} 0"]`, '10', '20');
            timePicker(`[data-testid="end ${+i + 1} 0"]`, '20', '30');
            cy.get(`[data-testid="kuota ${+i + 1} 0"]`)
              .invoke('val')
              .then(value => {
                // if (value.val === '') {
                cy.get(`[data-testid="kuota ${+i + 1} 0"]`).type('20');
                // }
              });
            cy.get(`[data-testid="ruangan ${+i + 1} 0"]`)
              .invoke('val')
              .then(value => {
                // if (value.val === '') {
                cy.get(`[data-testid="ruangan ${+i + 1} 0"]`).type(
                  `Auto${Cypress._.uniqueId()}`,
                );
                // }
              });
          }
        } else {
          for (let index in schedules) {
            const x = schedules[index].schedule;
            cy.get(`[data-testid="tambah ${+index + 1} ${+x.length - 1}"]`)
              .click()
              .then(() => {
                timePicker(
                  `[data-testid="start ${+index + 1} ${+x.length}"]`,
                  '10',
                  '55',
                );
                timePicker(
                  `[data-testid="end ${+index + 1} ${+x.length}"]`,
                  '20',
                  '55',
                );
                cy.get(`[data-testid="kuota ${+index + 1} ${+x.length}"]`).type(
                  '40',
                );
                cy.get(
                  `[data-testid="ruangan ${+index + 1} ${+x.length}"]`,
                ).type(`Auto${Cypress._.uniqueId()}`);
              });
          }
        }
      });
    });
    cy.get('[data-testid="simpan"]').click();
  });

  it('Reschedule doctors schedule', () => {
    cy.fixture('outpatientRegisData').then(data => {
      cy.get('[data-testid="reschedule"]').click();
      chooseFromDropdown('[data-testid="dokter"]', data.doctor);
      lastDropdown('[data-testid="poli"]', data.poly);
      cy.get('[data-testid="jadwal praktik"]')
        .click()
        .then(() => {
          cy.get('.v-list')
            .last()
            .eq(0)
            .click();
        });
      cy.get('[data-testid="datePicker"]')
        .click()
        .then(() => {
          cy.get('.v-btn__content')
            .contains(today)
            .click({ force: true });
        });
      timePicker('[data-testid="jam mulai"]', '10', '20');
      timePicker('[data-testid="jam selesai"]', '23', '55');
      cy.get('[data-testid="kuota"]').type(kuota);
      cy.get('[data-testid="simpan"]').click();
      cy.get('.swal2-confirm').click();
    });
  });

  it('Doctors schedule off', () => {
    cy.fixture('outpatientRegisData').then(data => {
      cy.get('[data-testid="reschedule"]').click();
      cy.get('[data-testid="libur praktik"]')
        .click()
        .wait(1000);
      chooseFromDropdown('[data-testid="dokter off"]', data.doctor);
      lastDropdown('[data-testid="poli off"]', data.poly);
      cy.get('[data-testid="jadwal libur off"]')
        .click()
        .then(() => {
          cy.get('.v-list')
            .last()
            .eq(0)
            .click();
        });
      cy.get('[data-testid="alasan off"]').type('Automated by automation');
      cy.get('[data-testid="simpan off"]').click();
    });
  });
});
