/// <reference types="cypress" />

import {
  addDoctorSchedule,
  addOutpatientRegistration,
  loginUser,
} from '../../../../support/helpers';
import { createPatientJson } from '../../../../support/dataHelper';

describe('Mendaftarkan pasien lama ke rawat jalan', () => {
  it('add outpatient', () => {
    addDoctorSchedule();
    cy.viewport(1920, 1080);
    cy.visit('http://localhost:8080/'); // Visit apps
    addOutpatientRegistration('Poli Umum');
  });
});
