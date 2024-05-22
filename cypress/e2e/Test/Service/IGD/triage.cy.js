/// <reference types="cypress" />

export const { faker } = require('@faker-js/faker');

import { createPatientJson, currentDate } from '../../../../support/dataHelper';
import {
  addNewPatientIGD,
  chooseFromDropdown,
  datePicker,
  getRndInteger,
  loginUser,
  timePicker,
} from '../../../../support/helpers';

describe('Triage', () => {
  before(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.viewport(1920, 1080);
    cy.visit('http://localhost:8080/'); // Visit apps
    createPatientJson();
    loginUser();
  });

  it('Edit Triage', () => {
    cy.intercept(
      'http://localhost:4000/patient/registration/unit?search=&unit_name=IGD**',
    ).as('getdataIGD');
    addNewPatientIGD();
    cy.fixture('outpatientRegisData').then(data => {
      //search patient data
      cy.wait('@getdataIGD').then(() => {
        cy.get('[data-testid="search"]')
          .clear()
          .type(data.name);
        cy.get('tr').then(() => {
          cy.get('td')
            .contains(data.name)
            .click();
        });
      });
    });
    cy.get('[data-testid="triageEmergency"]').click();

    cy.get('[data-testid="triaseLevelName"]').type(' Edited');
    cy.get('[data-testid="triaseLevelAddress"]').type(' Edited');
    cy.get('[data-testid="triaseLevelPIC"]').type(' Edited');
    cy.get('[data-testid="triaseLevelParentsName"]').type(' Edited');

    cy.get('[data-testid="triaseLevelSistol"]').type('1');
    cy.get('[data-testid="triaseLevelDiastole"]').type('1');
    cy.get('[data-testid="triaseLevelPulse"]').type('1');
    cy.get('[data-testid="triaseLevelRespiration"]').type('1');
    cy.get('[data-testid="triaseLevelWeight"]').type('1');
    cy.get('[data-testid="triaseLevelTemp"]').type('1');
    cy.get('[data-testid="triaseLevelSaturation"]').type('1');
    cy.get('[data-testid="triaseLevelPain"]')
      .clear()
      .type(getRndInteger(1, 10));
    cy.get('[data-testid="triaseLevelHeight"]').type('1');

    cy.get('[data-testid="WPSS"]').click();
    cy.get('[data-testid="wpssNote"]').type('edited');
    cy.get('[data-testid="Triase"]').click();

    switch (Cypress._.random(1, 4)) {
      case 1:
        cy.get('[data-testid="triageEntry1"]').click();
        break;
      case 3:
        cy.get('[data-testid="triageEntry3"]').click();
        break;
      case 4:
        cy.get('[data-testid="triageEntry4"]').click();
        break;
    }
    cy.get('[data-testid="triageMounted1"]').type('Edited');
    cy.get('[data-testid="triageMounted2"]').type('Edited');
    switch (Cypress._.random(1, 4)) {
      case 2:
        cy.get('[data-testid="triageReason2"]').click();
        break;
      case 3:
        cy.get('[data-testid="triageReason3"]').click();
        break;
      case 4:
        cy.get('[data-testid="triageReason4"]').click();
        break;
    }
    cy.get('[data-testid="triageVehicle"]').type('Mobil');
    cy.get('[data-testid="triageNextPage"]').click();

    cy.get('[data-testid="triageAgent"]').type('Edited');
    for (let i = 1; i < 9; i++) {
      cy.get(`[data-testid="triageArrivalCondition${i}"]`).check();
    }
    cy.get('[data-testid="triageTraumaIndividualStatus"]').check();
    cy.get('[data-testid="triageTraumaIndividualPlace"]').type(
      faker.location.city,
    );
    datePicker('[data-testid="triageTraumaIndividualDate"]', currentDate);
    timePicker('[data-testid="triageTraumaIndividualTime"]', 11, 30);

    cy.get('[data-testid="triageTraumaBetweenStatus"]').check();
    cy.get('[data-testid="triageTraumaBetweenVehicle1"]').type('edited');
    cy.get('[data-testid="triageTraumaBetweenVehicle2"]').type('edited');
    cy.get('[data-testid="triageTraumaBetweenPlace"]').type(
      faker.location.city,
    );
    datePicker('[data-testid="triageTraumaBetweenDate"]', currentDate);
    timePicker('[data-testid="triageTraumaBetweenTime"]', 12, 35);

    cy.get('[data-testid="triageTraumaBetweenStatus"]').check();
    cy.get('[data-testid="triageTraumaFallInfo"]').type('Edited');

    cy.get('[data-testid="triageTraumaBurnsStatus"]').check();
    cy.get('[data-testid="triageTraumaElectricStatus"]').check();
    cy.get('[data-testid="triageTraumaSubstanceStatus"]').check();
    cy.get('[data-testid="triageTraumaBurnsInfo"]').type('edited');
    cy.get('[data-testid="triageTraumaElectricInfo"]').type('edited');
    cy.get('[data-testid="triageTraumaSubstanceInfo"]').type('edited');

    chooseFromDropdown('[data-testid="triageTraumaDiagnose"]', 'Retained');
    cy.get('[data-testid="triageTraumaPrimaryComplaint"]').type('edited');

    cy.get('[data-testid="triageSave"]').click();
    cy.get('#swal2-title').should($item => {
      expect($item).to.contain('Triase Berhasil Diperbaharui');
    });
  });
});
