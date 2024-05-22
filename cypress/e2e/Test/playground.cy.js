/// <reference types="cypress" />
const moment = require('moment');
const {
  chooseFromDropdown,
  lastDropdown,
  timePicker,
  loginUser,
} = require('../../support/helpers');

const yesterday = moment().subtract(1, 'day');
const formattedDate = yesterday.format('DD');
import { faker } from '@faker-js/faker';

describe('try', () => {
  it.only('try exit window print pop up ', () => {
    cy.intercept('http://localhost:4000/patient/registration/unit**').as(
      'getOutpatientDashoardData',
    );
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.viewport(1920, 1080);
    cy.visit('http://localhost:8080/', {
      onBeforeLoad: win => {
        cy.stub(win, 'print');
      },
    }); // Visit apps
    loginUser('admin', 'admin123');

    cy.get('[data-testid="Parent Pendaftaran"]').click();
    cy.get('[data-sidebar="Pendaftaran Rawat Jalan"]').click();

    cy.wait('@getOutpatientDashoardData').then(data => {
      const x = data.response.body.data[0].emr.medical_record_number;
      cy.get('[data-testid="search"]').type(x);
      cy.get('tr').then(() => {
        cy.get('td')
          .contains(x)
          .click();
      });
      cy.get('[data-testid="print"]').click();
      cy.get('[data-testid="patient card"]')
        .click()
        .wait(1000);
      // cy.document().then(doc => {
      //   console.log(doc);
      // });
      cy.get('[data-testid="queue"]')
        .click()
        .wait(1000);
      cy.window().then(win => {
        console.log(win);
        win.print();
        expect(win.print).to.be.calledOnce;
        // win[0].close();
      });
      // cy.document().then(doc => {
      //   console.log(doc);
      //   doc.close();
      // });
    });
  });

  it('try vuex get store', () => {
    const getStore = () => cy.window().its('app.$store');
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.viewport(1920, 1080);
    cy.visit('http://localhost:8080/'); // Visit apps
    loginUser();

    cy.get('[data-sidebar="Parent Pelayanan"]').click();
    cy.get('[data-sidebar="Pelayanan Poli Umum"]').click();

    cy.fixture('outpatientRegisData').then(patient => {
      cy.get('[data-general-poly="search"]').type(patient.name);
      cy.get('tr').then(() => {
        cy.get('td')
          .contains(patient.name)
          .click();
      });
      cy.get('[data-general-poly="e-resep"]')
        .first()
        .click();
    });
    cy.window()
      .its('app')
      .then(app =>
        console.log(app.getters.userLoggedIn.config.pharmacy_mix_recipe_input),
      );
    // cy.window()
    //   .its('__store__')
    //   .invoke('getState')
    //   .then(data => {
    //     console.log(data);
    //   });
  });
  it('try click hak akses and fill', () => {
    const staffName = 'Riyan Sutantio';
    cy.intercept('http://localhost:4000/master/staff?**').as('waitSearch');
    cy.intercept('http://localhost:4000/master/staff/staffAccess/**').as(
      'waitAccess',
    );
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.viewport(1920, 1080);
    cy.visit('http://localhost:8080/'); // Visit apps

    loginUser();

    cy.get('[data-sidebar="Parent Master Data"]').click();
    cy.get('[data-sidebar="Master Data Staf"]').click();

    cy.get('[data-staff="search"]').type(staffName);
    cy.wait('@waitSearch');
    cy.get('tbody')
      .contains(staffName)
      .click({ force: true });

    cy.get('[data-staff="akses"]').click();

    cy.wait('@waitAccess').then(data => {
      console.log(data.response?.body.data);
      const items = data.response?.body.data;
      for (let i in items) {
        cy.get(`[data-accessrights="${items[i].menu}"]`)
          .find('.v-treeview-node__checkbox')
          .click();
      }
    });

    cy.get('[data-accessrights="simpan"]').click();
  });
  it('try faker', () => {
    // cy.clearCookies();
    // cy.clearLocalStorage();
    // cy.viewport(1920, 1080);
    // cy.visit('http://localhost:8080/'); // Visit apps

    // loginUser();
    const text = faker.music.songName();
    console.log(text);
  });
  it('try cy.request()', async () => {
    await new Promise(resolve => {
      cy.clearCookies();
      cy.clearLocalStorage();
      cy.viewport(1920, 1080);
      cy.visit('http://localhost:8080/'); // Visit apps

      loginUser();
      console.log(resolve);
    });
    let bearer = localStorage.getItem('token');
    const token = JSON.parse(localStorage.getItem('token')).token;
    console.log(bearer);
    console.log(token);
    // cy.request({
    //   method: 'GET',
    //   url:
    //     'http://localhost:4000/patient/registration/unit?page=1&itemCount=7&search=&type=rawat%20jalan&date=2023-06-21&doctor=&unit_name=&assurance=',
    //   headers: {
    //     Authorization: `Bearer ${bearer}`,
    //     'Content-Type': 'application/json',
    //   },
    // }).then(data => {
    //   console.log(data);
    // });
  });
  it('try regist inpatient', () => {
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.viewport(1920, 1080);
    cy.visit('http://localhost:8080/'); // Visit apps

    loginUser();

    cy.get('[data-sidebar="Parent Pendaftaran"]').click();
    cy.get('[data-sidebar="Pendaftaran Rawat Inap"]').click();

    cy.get('[data-inpatient-regist="search"]').type('Bruno Venus');
    cy.contains('Bruno Venus')
      .last()
      .click();

    cy.get('[data-inpatient-regist="input"]').click();
    cy.intercept('GET', 'http://localhost:4000/master/bed/').as('getBed');
    cy.get('[data-social-data="lanjut"]').click();

    cy.wait('@getBed').then(datas => {
      let res = datas?.response?.body?.data;
      let availStatus;
      let indexBed;
      for (let i in res) {
        if (res?.[i]?.availability == 'available') {
          console.log('kosong');
          availStatus = 'available';
          indexBed = i;
          break;
        } else {
          console.log('terisi');
          availStatus = 'unavailable';
          indexBed = i;
        }
      }
      console.log(availStatus + indexBed);
      if (indexBed == res?.length && availStatus == 'unavailable') {
        cy.intercept('GET', 'http://localhost:4000/inpatient**').as(
          'getInpatient',
        );
        cy.get('[data-sidebar="Parent Pelayanan"]').click();
        cy.get('[data-sidebar="Pelayanan Rawat Inap"]').click();

        cy.wait('@getInpatient').then(datas => {
          let res = datas?.response?.body?.data[0];
          console.log(res.bed_number);
          cy.contains(res.bed_number).click();
          cy.get('[data-inpatient="selesai"]').click();
          cy.get('[data-finish-inpatient="pulangkan pasien"]').click();
          cy.get('[data-finish-inpatient="lanjutkan"]').click();
        });
      }
      if (availStatus == 'available') {
        cy.get(`[data-status-bed="available${indexBed}"]`).click();
        cy.get('[data-status-bed="daftar"]').click();
      }
    });
  });

  it('try doctor schedule detection', () => {
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.viewport(1920, 1080);
    cy.visit('http://localhost:8080/'); // Visit apps

    loginUser();

    cy.get('[data-sidebar="Parent Pendaftaran"]').click();
    cy.get('[data-sidebar="Pendaftaran Jadwal Dokter"]').click();

    cy.intercept(
      'GET',
      'http://localhost:4000/schedule/default/unit-doctor/**',
      req => {
        req.reply(res => {
          if (res.statusCode === 404) {
            res.send('404');
          }
        });
      },
    ).as('getSchedule');

    cy.get('[data-schedule="pengaturan"]').click();
    cy.fixture('outpatientRegisData').then(data => {
      chooseFromDropdown('[data-input-schedule="dokter"]', data.doctor);
      lastDropdown('[data-input-schedule="poli"]', data.poly);
      cy.wait('@getSchedule').then(schedule => {
        const res = schedule.response.statusCode;
        console.log(res);
        const schedules = schedule.response.body.data;
        if (res == 404) {
          cy.get('[data-input-schedule="kode antrian"]')
            .invoke('val')
            .then(value => {
              if (value.val === '') {
                cy.get('[data-input-schedule="kode antrian"]').type(
                  `Auto${Cypress._.uniqueId()}`,
                );
              }
            });
          for (let i = 0; i < 7; i++) {
            timePicker(`[data-input-schedule="start ${+i + 1} 0"]`, '10', '20');
            timePicker(`[data-input-schedule="end ${+i + 1} 0"]`, '20', '30');
            cy.get(`[data-input-schedule="kuota ${+i + 1} 0"]`)
              .invoke('val')
              .then(value => {
                if (value.val === '') {
                  cy.get(`[data-input-schedule="kuota ${+i + 1} 0"]`).type(
                    '20',
                  );
                }
              });
            cy.get(`[data-input-schedule="ruangan ${+i + 1} 0"]`)
              .invoke('val')
              .then(value => {
                if (value.val === '') {
                  cy.get(`[data-input-schedule="ruangan ${+i + 1} 0"]`).type(
                    `Auto${Cypress._.uniqueId()}`,
                  );
                }
              });
          }
        } else {
          for (let index in schedules) {
            const x = schedules[index].schedule;
            cy.get(
              `[data-input-schedule="tambah ${+index + 1} ${+x.length - 1}"]`,
            )
              .click()
              .then(() => {
                timePicker(
                  `[data-input-schedule="start ${+index + 1} ${+x.length}"]`,
                  '10',
                  '55',
                );
                timePicker(
                  `[data-input-schedule="end ${+index + 1} ${+x.length}"]`,
                  '20',
                  '55',
                );
                cy.get(
                  `[data-input-schedule="kuota ${+index + 1} ${+x.length}"]`,
                ).type('40');
                cy.get(
                  `[data-input-schedule="ruangan ${+index + 1} ${+x.length}"]`,
                ).type(`Auto${Cypress._.uniqueId()}`);
              });
          }
        }
      });
      cy.get('[data-input-schedule="simpan"]').click();
    });
  });
});
