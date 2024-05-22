/// <reference types="cypress" />
import {
  addDoctorSchedule,
  formTTVAnamnesis,
  loginUser,
  newPatientOutpatient,
} from '../../../../support/helpers';
import { createPatientJson } from '../../../../support/dataHelper';

describe('new outpatient registration', () => {
  before(() => {
    createPatientJson();
    cy.viewport(1920, 1080);
    addDoctorSchedule();
  });

  it('Regist Outpatient New Patient', () => {
    cy.visit('http://localhost:8080/'); // Visit apps
    newPatientOutpatient('Poli Umum');
  });
});
