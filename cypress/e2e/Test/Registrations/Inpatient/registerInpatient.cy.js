/// <reference types="cypress" />

import { createPatientJson } from '../../../../support/dataHelper';
import {
  chooseFromDropdown,
  lastDropdown,
  addOutpatientRegistration,
  loginUser,
  apiAdminLogin,
  inpatientRegistration,
  fillInpatientOrder,
} from '../../../../support/helpers';

describe('Register Inpatient', () => {
  beforeEach(() => {
    cy.viewport(1920, 1080);
    cy.login('admin', 'admin123');
    cy.visit('http://localhost:8080/'); // Visit apps

    // loginUser();
  });

  it('Register new outpatient', () => {
    createPatientJson();
    addOutpatientRegistration();
  });

  it('Fill out a inpatient order', () => {
    fillInpatientOrder();
  });

  it('Register patient to inpatient', () => {
    inpatientRegistration();
  });
});
