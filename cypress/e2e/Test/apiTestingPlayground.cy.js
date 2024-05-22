/// <reference types="cypress" />

const { apiAdminLogin } = require('../../support/helpers');
const baseUrl = Cypress.config('baseUrl');
describe('Api Testing', () => {
  it('get MD pharmacy goods', () => {
    // cy.session('admin', () => {
    //   cy.request({
    //     method: 'POST',
    //     url: `${Cypress.config('baseUrl')}/master/staff/login`,
    //     body: {
    //       nip: 'admin',
    //       password: 'admin123',
    //       unit: '6020a5de50c5450ed4c7d8ba',
    //     },
    //   }).then(res => {
    //     console.log(res.status + ' login');
    //     window.localStorage.setItem('token', res.body.token);
    //     cy.request({
    //       method: 'GET',
    //       url: `${baseUrl}/master/drugs?page=1&itemCount=7&sort=&search=&category=`,
    //       headers: {
    //         Authorization: `Bearer ${window.localStorage.getItem('token')}`,
    //       },
    //       body: null,
    //     }).then(res => {
    //       expect(res.status).to.eq(200);
    //       expect(res.body.pesan).to.eq('Data obat ditemukan');
    //     });
    //   });
    // });

    cy.login('admin', 'admin123').then(() => {
      cy.request({
        method: 'GET',
        url: `${baseUrl}/master/drugs?page=1&itemCount=7&sort=&search=&category=`,
        headers: {
          Authorization: `Bearer ${window.localStorage.getItem('token')}`,
        },
        body: null,
      }).then(res => {
        expect(res.status).to.eq(200);
        expect(res.body.pesan).to.eq('Data obat ditemukan');
      });
    });
  });

  it('get MD house goods', () => {
    cy.login('admin', 'admin123').then(() => {
      cy.request({
        method: 'GET',
        url: `${baseUrl}/master/goods?page=1&itemCount=7&sort=&search=&category=`,
        headers: {
          Authorization: `Bearer ${window.localStorage.getItem('token')}`,
        },
        body: null,
      }).then(res => {
        expect(res.status).to.eq(200);
        expect(res.body.pesan).to.eq('Data barang ditemukan');
      });
    });
  });

  it('save schedule doctor', () => {
    //Documentation
    //Poli KIA : 5ff6cdb8254eea390cbf4b84
    //Poli Umum :61f25ae5a51eb224541e2bee
    //Poli gigi :61e52a5403ac062fa4228f98
    //POli fisio :65826119641c276b3c2d7b3f
    // untuk id Staff bisa dicari lewat master data staff
    cy.login('admin', 'admin123').then(() => {
      cy.request({
        method: 'POST',
        url: `${baseUrl}/schedule/default`,
        headers: {
          Authorization: `Bearer ${window.localStorage.getItem('token')}`,
        },
        body: {
          id_staff: '5fba2aaa52c19c5c6a6b16f6',
          id_unit: '5ff6cdb8254eea390cbf4b84',
          schedule: [
            {
              day: '1',
              start_time: '10:00',
              end_time: '20:00',
              quota: 10,
              room: 'Mawar',
            },
            {
              day: '1',
              start_time: '20:00',
              end_time: '21:44',
              quota: 10,
              room: '1',
            },
            {
              day: '2',
              start_time: '07:00',
              end_time: '15:00',
              quota: 15,
              room: 'Mawar',
            },
            {
              day: '2',
              start_time: '16:00',
              end_time: '23:54',
              quota: 11,
              room: '1',
            },
            {
              day: '3',
              start_time: '06:00',
              end_time: '22:00',
              quota: 20,
              room: 'Mawar',
            },
            {
              day: '4',
              start_time: '12:59',
              end_time: '16:00',
              quota: 151,
              room: 'Kebun',
            },
            {
              day: '4',
              start_time: '18:00',
              end_time: '22:59',
              quota: 101,
              room: 'kebun tetangga',
            },
            {
              day: '4',
              start_time: '12:00',
              end_time: '14:56',
              quota: 101,
              room: 'Kebun',
            },
            {
              day: '5',
              start_time: '10:00',
              end_time: '16:00',
              quota: 15,
              room: 'Mawar',
            },
            {
              day: '6',
              start_time: '13:00',
              end_time: '17:15',
              quota: 15,
              room: 'Mawar',
            },
            {
              day: '7',
              start_time: '18:30',
              end_time: '22:00',
              quota: 123,
              room: '1',
            },
            {
              day: '7',
              start_time: '22:50',
              end_time: '23:54',
              quota: 12,
              room: '12',
            },
          ],
          queue_code: 'DY',
          timestamps: { created_by: '5fb92977add95e45ab123342' },
        },
      }).then(res => {
        expect(res.status).to.eq(200);
      });
    });
  });
});
