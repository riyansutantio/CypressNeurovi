/// <reference types="cypress" />

import { faker } from '@faker-js/faker';
import {
  addOutpatientRegistration,
  chooseFromDropdown,
  loginUser,
  newPatientOutpatient,
} from '../../../../support/helpers';

describe('Test Document', () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.viewport(1920, 1080);
    cy.visit('http://localhost:8080/'); // Visit apps
    loginUser();
  });

  it('Add outpatient regist', () => {
    newPatientOutpatient('Poli Umum');
  });

  it('General consent', () => {
    cy.get('[data-sidebar="Parent Pelayanan"]').click();
    cy.get('[data-sidebar="Pelayanan Poli Umum"]').click();

    cy.fixture('outpatientRegisData').then(data => {
      cy.get('[data-general-poly="search"]').type(data.name);
      cy.get('tr').then(() => {
        cy.get('td')
          .contains(data.name)
          .click();
      });
      cy.get('[data-general-poly="dokumen"]').click();

      cy.get('[data-printdocument="General Consent"]').click();
    });

    cy.get('body').then($body => {
      if (
        $body.find('[data-printdocument="general consent kosong"]').length > 0
      ) {
        cy.get('[data-printdocument="close"]').click();
        cy.get('[data-sidebar="Parent Pendaftaran"]').click();
        cy.get('[data-sidebar="Pendaftaran Rawat Jalan"]').click();

        cy.fixture('outpatientRegisData').then(data => {
          cy.get('[data-outpatient="search"]').type(data.name);
          cy.get('tr').then(() => {
            cy.get('td')
              .contains(data.name)
              .click();
          });
          cy.get('[data-outpatient="print"]').click();

          cy.get('[data-printdialogue="general consent"]').click();
          cy.get('[data-generalconsentform="no telp"]').type(
            faker.phone.number('+62 82 ### ## ##'),
          );

          cy.get('[data-generalconsentform="no identitas"]').type(
            faker.phone.imei(),
          );
          chooseFromDropdown('[data-generalconsentform="petugas"]', 'Rahmat');

          // cy.get('[data-generalconsentform="simpan"]').click();
        });
      } else {
        console.log('Filled');
      }
    });
  });
});
