/* eslint-disable no-undef */
/// <reference types="cypress" />

import { createPatientJson } from './dataHelper';
const baseUrl = Cypress.config('baseUrl');

//RM generator
export function noRmGenerator(input) {
  let x = input.toString();
  if (x.length == 3) {
    return '000' + x;
  } else if (x.length == 2) {
    return '0000' + x;
  } else {
    return '00000' + x;
  }
}
//function fo generate random number
//min -> include & max -> exclude
//if want generate 1 to 10, u should use 1 as min and 11 as max
export function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}
export function apiAdminLogin(username) {
  cy.session(username, () => {
    cy.request({
      method: 'POST',
      url: `${Cypress.config('baseUrl')}/master/staff/login`,
      body: {
        nip: 'admin',
        password: 'admin123',
        unit: '6020a5de50c5450ed4c7d8ba',
      },
    }).then(res => {
      console.log(res.status + ' login');
      window.localStorage.setItem('token', res.body.token);
      // Cypress.Cookies.preserveOnce('session_id', 'remember_token'); // sudah tidak bisa dipakai
    });
  });
}

//function to login into neurovi
//u can use it as it go without params and u will be logged as admin
//if you want to login as another user u can use params
//next if data-cy are on production this should include cy.visit and add new param to choose want to run locally or on server
export function loginUser(username, password) {
  cy.intercept('POST', 'http://localhost:4000/master/staff/unit').as(
    'loginwait',
  );
  cy.get('#nip').type(username || 'admin');
  cy.get('#password')
    .type(password || 'admin123')
    .wait(2000);
  cy.get('#login')
    .click()
    .wait('@loginwait');
  cy.get('body').then($body => {
    if ($body.find('.v-dialog__content').length > 0) {
      cy.get('[data-testid="unit"]')
        .click()
        .wait(2000)
        .then(() => {
          cy.get('.v-list-item__content')
            .first()
            .click();
        });
      cy.get('[data-testid="ok"]')
        .click()
        .wait(2000);
    }
  });
}

//default vuetify date picker
//u can use data-cy in pengenal as locator date picker field
//to use data u can choose between 1 to 31 (but i suggest to user current date, because some date picker have requirement we cant choose before or after current date)
export function datePicker(pengenal, data) {
  cy.get(pengenal)
    .click()
    .then(() => {
      cy.get('.v-btn.v-date-picker-table__current')
        .contains(data)
        .first()
        .click({ force: true });
    });
}

//u can use this function to type and choose data from dropdown autocomplete in vuetify
//use data-cy in pengenal as locator
//use any text that have similarity with the data that u want to choose from dropdown autcomplete
export function chooseFromDropdown(pengenal, data) {
  cy.get(pengenal)
    .first()
    .click()
    .clear()
    .type(data)
    .wait(1000)
    .then(() => {
      cy.get('.v-list-item__content > .v-list-item__title')
        .contains(data)
        .wait(1000)
        .click({ force: true });
    });
}

//u can use this function to choose between true and false radio button
//truevalue and falseValue are data-cy and variable are the true/false var/const
export function chooseFrom2RadioBtn(trueValue, falseValue, variabel) {
  variabel
    ? cy.get(trueValue).click({ force: true })
    : cy.get(falseValue).click({ force: true });
}

//u can use this to choose data from dropdown vlist
//use data-cy as pengenal
//use any text that have similarity with the data that u want to choose from dropdown vlist
export function dropdownVlist(pengenal, data) {
  cy.get(pengenal)
    .first()
    .click()
    .then(() => {
      cy.get('.v-list')
        .contains(data)
        .click();
    });
}

//u can use this to choose data from dropdown last vlist (this function for situation u have to choose 1 from many vlist that appeared in screen)
//use data-cy as pengenal
//use any text that have similarity with the data that u want to choose from dropdown vlist
export function lastDropdown(pengenal, data) {
  cy.get(pengenal)
    .click()
    .then(() => {
      cy.get('.v-list')
        .last()
        .contains(data)
        .click();
    });
}

//this function are specified for timepicker in doctor schedule
//use data-cy in identifier
//use index in for loop to identify which field current
//use string number to in start and end
export function timePickerForAddSchedule(
  identifier,
  index,
  start = '',
  end = '',
) {
  cy.get(identifier)
    .eq(index)
    .click()
    .then(() => {
      cy.get('.v-picker__body')
        .contains(start)
        .click()
        .wait(500);
      cy.get('.v-picker__body')
        .contains(end)
        .click()
        .wait(500);
    });
}

//this function for general timepicker
//params explanations similar with timepicker for doctor schedule
//next time this function should merged with another timepicker to simplify code
export function timePicker(identifier, start = '', end = '') {
  cy.get(identifier)
    .click()
    .then(() => {
      cy.get('.v-time-picker-clock')
        .contains(start)
        .click()
        .wait(500);
      cy.get('.v-time-picker-clock')
        .contains(end)
        .click()
        .wait(500);
    });
}

//this function to input data form anamnesis & ttv
//use data (object) for param data
export function formTTVAnamnesis(data) {
  if (data.ttv === true) {
    cy.get('.swal2-confirm').click();
    cy.get('[data-testid="anamnesis"]').type(data.anamnesis);
    cy.get('[data-testid="sistolik"]').type(data.sistolik);
    cy.get('[data-testid="diastolik"]').type(data.diastolik);
    cy.get('[data-testid="nadi"]').type(data.pulse);
    cy.get('[data-testid="BB"]').type(data.bb);
    cy.get('[data-testid="TB"]').type(data.tb);
    cy.get('[data-testid="LP"]').type(data.lp);
    cy.get('[data-testid="RR"]').type(data.rr);
    cy.get('[data-testid="kesadaran"]')
      .click()
      .then(() => {
        cy.wait(1000);
        cy.get('.v-list')
          .contains(data.awareness)
          .click();
      });
    cy.get('[data-testid="lanjut"]')
      .last()
      .click();
  } else {
    cy.get('.swal2-cancel').click();
  }
}

//this function use for clear cookies and local storage
export function clearCookies() {
  cy.clearAllCookies();
  cy.clearAllLocalStorage();
  cy.clearAllSessionStorage();
}

//this function to simplify way to regist old patien to outpatient
export function addOutpatientRegistration(poli, rm) {
  cy.get('[data-testid="Parent Pendaftaran"]').click();
  cy.get('[data-testid="Pendaftaran Rawat Jalan"]').click();
  cy.intercept('http://localhost:4000/patient/emr/all**').as('getUser');
  cy.intercept('http://localhost:4000/patient/emr/social/**').as(
    'getSocialDataUser',
  );
  cy.fixture('outpatientRegisData').then(data => {
    cy.get('[data-testid="tambah"]')
      .click()
      .wait(1500); //Add old patient to outpatient
    cy.get('[data-testid="pilih"]').click();
    rm
      ? cy.get('[data-testid="name"]').type(rm)
      : cy.get('[data-testid="name"]').type(data.noRm);
    cy.wait('@getUser').then(item => {
      const res = item.response.body.data[0].medical_record_number;
      cy.get(`[data-testid="daftar ${res}"]`).click();
    });
    cy.wait(1000);
    cy.wait('@getSocialDataUser').then(res => {
      if (res.response?.body.data.assurance.type != 'umum') {
        cy.get('[data-testid="umum"]').click({ force: true });
      }
    });
    cy.get('[data-testid="lanjut"]')
      .first()
      .click();

    //Fill TTV & Anamnesis form
    formTTVAnamnesis(data);

    //Fill outpatient form
    cy.intercept('POST', 'http://localhost:4000/schedule/dropdown').as(
      'getDoctorSchedule',
    );
    cy.intercept('POST', 'http://localhost:4000/patient/registration').as(
      'postRegist',
    );
    poli
      ? lastDropdown('[data-testid="poli"]', poli)
      : lastDropdown('[data-testid="poli"]', data.poly);
    chooseFromDropdown('[data-testid="dokter"]', data.doctor);
    cy.wait('@getDoctorSchedule');
    cy.get('[data-testid="daftar"]').click();
    cy.wait('@postRegist');
    cy.get('.swal2-confirm').click();
    cy.get('.v-card__title > .v-btn > .v-btn__content > .v-icon').click();
  });
}

//this function simplify add new patient to outpatient
//use json data in dataHelper.js
export function newPatientOutpatient(poli) {
  createPatientJson();
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
    poli
      ? lastDropdown('[data-testid="poli"]', poli)
      : lastDropdown('[data-testid="poli"]', data.poly);
    chooseFromDropdown('[data-testid="dokter"]', data.doctor);
    cy.wait('@postDoctorSchedule');
    cy.get('[data-testid="daftar"]').click();
    cy.get('.swal2-confirm').click();
    cy.get('.v-card__title > .v-btn > .v-btn__content > .v-icon').click();
  });
}

//add doctor's schedule via API
export function addDoctorSchedule() {
  cy.login('admin', 'admin123').then(() => {
    cy.request({
      method: 'POST',
      url: `${baseUrl}/schedule/default`,
      headers: {
        Authorization: `Bearer ${window.localStorage.getItem('token')}`,
      },
      body: {
        id_staff: '6163a9434f2140229f099908',
        id_unit: '61f25ae5a51eb224541e2bee',
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
            end_time: '21:00',
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
            end_time: '22:00',
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
            end_time: '22:56',
            quota: 101,
            room: 'Kebun',
          },
          {
            day: '5',
            start_time: '10:00',
            end_time: '22:00',
            quota: 15,
            room: 'Mawar',
          },
          {
            day: '6',
            start_time: '13:00',
            end_time: '22:15',
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
}

//regist outpatient to inpatient
export function fillInpatientOrder(caseType) {
  cy.fixture('outpatientRegisData').then(data => {
    cy.get('[data-testid="Parent Pelayanan"]').click();
    switch (data.poly) {
      case 'Poli Umum':
        cy.get('[data-testid="Pelayanan Poli Umum"]').click();
        cy.get('[data-testid="search"]').type(data.noRm);
        cy.contains(data.noRm).click();
        cy.get('[data-testid="Surat"]').click();
        break;
      case 'Poli Gigi':
        cy.get('[data-testid="Pelayanan Poli Gigi"]').click();
        cy.get('[data-testid="search"]').type(data.noRm);
        cy.contains(data.noRm).click();
        cy.get('[data-testid="Surat"]').click();
        break;
      case 'Poli KIA':
        cy.get('[data-testid="Pelayanan Poli KIA"]').click();
        cy.get('[data-testid="search"]').type(data.noRm);
        cy.contains(data.noRm).click();
        cy.get('[data-testid="Surat"]').click();
        break;
    }
    cy.get('[data-testid="Surat Perintah Rawat Inap"]').click();
    lastDropdown('[data-testid="penjamin"]', 'Umum');
    lastDropdown(
      '[data-testid="kasus"]',
      caseType ? caseType : data.inpatientType,
    );
    lastDropdown('[data-testid="pelayanan"]', data.serviceType);
    chooseFromDropdown(
      'input[placeholder="Pilih Diagnosa Masuk 1"]',
      'Ileostomy status',
    );
    cy.get('[data-testid="simpan"]')
      .last()
      .click()
      .wait(2000);
    cy.get('.swal2-confirm').click();
    cy.get('[data-testid="kembali"]').click();
    switch (data.poly) {
      case 'Poli Umum':
        cy.get('[data-testid="Selesai"]').click();
        cy.get('[data-testid="rawat inap"]').click();
        cy.get('[data-testid="lanjutkan"]').click();
        break;
      case 'Poli Gigi':
        cy.get('[data-testid="Selesai"]').click();
        cy.get('[data-testid="rawat inap"]').click();
        cy.get('[data-testid="lanjutkan"]').click();
        break;
      case 'Poli KIA':
        cy.get('[data-testid="Selesai"]').click();
        cy.get('[data-testid="rawat inap"]').click();
        cy.get('[data-testid="lanjutkan"]').click();
        break;
    }
    cy.get('.swal2-confirm').click();
  });
}

//Regist patient to inpatient
export function inpatientRegistration() {
  cy.get('[data-testid="Parent Pendaftaran"]').click();
  cy.get('[data-testid="Pendaftaran Rawat Inap"]').click();

  cy.fixture('outpatientRegisData').then(data => {
    cy.intercept('GET', 'http://localhost:4000/master/bed**').as('getBed1');
    cy.intercept('http://localhost:4000/patient/emr/social/**').as(
      'getSocialDataUser',
    );
    cy.get('[data-testid="search"]')
      .type(data.noRm)
      .wait(1000);
    cy.get('[data-testid="daftar 0"]').click();
    cy.wait(1000);
    cy.wait('@getSocialDataUser').then(res => {
      if (res.response?.body.data.assurance.type != 'umum') {
        cy.get('[data-testid="umum"]').click({ force: true });
      }
    });
    cy.get('[data-testid="lanjut"]').click();

    cy.wait('@getBed1').then(datas => {
      let res = datas?.response?.body?.data;
      let availStatus;
      let indexBed;
      for (let i in res) {
        if (res?.[i]?.availability == 'available') {
          availStatus = 'available';
          indexBed = i;
          break;
        } else {
          availStatus = 'unavailable';
          indexBed = i;
        }
      }
      if (indexBed == res?.length - 1 && availStatus == 'unavailable') {
        cy.get('[data-testid="kembali"]').click();
        cy.get('[data-testid="kembali"]').click();
        cy.intercept('GET', 'http://localhost:4000/inpatient**').as(
          'getInpatient',
        );
        cy.get('[data-testid="Parent Pelayanan"]').click();
        cy.get('[data-testid="Pelayanan Rawat Inap"]').click();

        cy.wait('@getInpatient').then(item => {
          let resp = item?.response?.body?.data[0];
          cy.contains(resp.bed_number).click();
          cy.get('[data-testid="selesai"]').click();
          cy.get('[data-testid="pulangkan pasien"]').click();
          cy.get('[data-testid="continue"]').click();
        });
        cy.get('.swal2-confirm').click();

        cy.get('[data-testid="Parent Pendaftaran"]').click();
        cy.get('[data-testid="Pendaftaran Rawat Inap"]').click();
        cy.get('[data-testid="search"]')
          .type(data.noRm)
          .wait(1000);
        cy.get('[data-testid="daftar 0"]').click();

        cy.intercept('GET', 'http://localhost:4000/master/bed**').as('getBed2');
        cy.wait('@getSocialDataUser').then(res => {
          if (res.response?.body.data.assurance.type != 'umum') {
            cy.get('[data-testid="umum"]').click({ force: true });
          }
        });
        cy.get('[data-testid="lanjut"]').click();
        cy.wait('@getBed2').then(x => {
          let y = x?.response?.body?.data;
          const z = y.filter(a => a.availability == 'available');
          const bedNum = z[0].bed_number;
          cy.contains(bedNum).click();
          cy.get('[data-testid="daftar"]').click();
        });
      }
      if (availStatus == 'available') {
        cy.get(`[data-testid="available${indexBed}"]`).click();
        cy.get('[data-testid="daftar"]').click();
      }
      cy.get('.swal2-confirm').click();
    });
  });
}

export function addNewPatientIGD() {
  cy.fixture('outpatientRegisData').then(data => {
    cy.get('[data-testid="Parent Pelayanan"]').click();
    cy.get('[data-testid="Pelayanan Klinik IGD"]').click();

    cy.get('[data-testid="addTriageEmergency"]').click();

    cy.get('[data-testid="triaseLevelName"]').type(data.name);
    cy.get('[data-testid="triaseLevelAddress"]').type(data.address.country);
    dropdownVlist(
      '[data-testid="triaseLevelGender"]',
      data.isMale ? 'Laki-laki' : 'Perempuan',
    );
    cy.get('[data-testid="triaseLevelParentsName"]').type(data.fatherName);

    switch (data.pasc) {
      case 2:
        cy.get('[data-testid="pacs2"]').click();
        break;

      case 3:
        cy.get('[data-testid="pacs3"]').click();
        break;

      case 4:
        cy.get('[data-testid="pacs4"]').click();
        break;
    }
    switch (data.triageAwareness) {
      case 2:
        cy.get('[data-testid="aware2"]').click();
        break;

      case 3:
        cy.get('[data-testid="aware3"]').click();
        break;

      case 4:
        cy.get('[data-testid="aware4"]').click();
        break;
    }
    cy.get('[data-testid="triaseLevelSistol"]').type(data.sistolik);
    cy.get('[data-testid="triaseLevelDiastole"]').type(data.diastolik);

    cy.get('[data-testid="triaseLevelPulse"]').type(data.pulse);
    cy.get('[data-testid="triaseLevelRespiration"]').type(data.rr);
    cy.get('[data-testid="triaseLevelWeight"]').type(data.bb);
    cy.get('[data-testid="triaseLevelTemp"]').type(data.temperature);
    cy.get('[data-testid="triaseLevelSaturation"]').type(data.saturation);
    cy.get('[data-testid="triaseLevelPain"]').type(data.pain);
    cy.get('[data-testid="triaseLevelHeight"]').type(data.tb);

    cy.get('[data-testid="save"]').click();

    cy.get('.swal2-confirm').click();

    const fullName = data.name;
    const name = fullName.split(' ');
    const searchName = name.join('%20');
    cy.intercept(
      'GET',
      `http://localhost:4000/patient/igd/triase?search=${searchName}**`,
    ).as('getTriageList');
    cy.get('[data-testid="Parent Pendaftaran"]').click();
    cy.get('[data-testid="Pendaftaran IGD"]').click();
    //choose traige
    cy.get('[data-testid="search"]').type(data.name);
    cy.wait('@getTriageList');
    cy.get('[data-testid="daftar 0"]').click();

    //make new patient's data
    cy.get('[data-testid="buat pasien baru"]').click();

    //fill social data
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

    cy.get('.swal2-confirm').click();

    cy.get('[data-testid="Parent Pelayanan"]').click();
    cy.get('[data-testid="Pelayanan Klinik IGD"]').click();
    cy.get('[data-testid="search"]').type(data.name);

    cy.get('tbody > tr > :nth-child(3)')
      .contains(data.name)
      .should('be.visible');
  });
}
