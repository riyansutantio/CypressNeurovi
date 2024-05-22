/// <reference types="cypress" />
import { createAssessentData } from '../../../../support/dataHelper';
import {
  chooseFromDropdown,
  lastDropdown,
  loginUser,
  newPatientOutpatient,
  dropdownVlist,
} from '../../../../support/helpers';

describe('Test Assessment General Poly', () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.viewport(1920, 1080);
    cy.visit('http://localhost:8080/'); // Visit apps
    createAssessentData();
  });
  it('Regist outpatient', () => {
    loginUser();
    newPatientOutpatient('Poli Umum');
  });

  it('Fill assessment as Nurse', () => {
    cy.fixture('outpatientRegisData').then(data => {
      loginUser('perawat02', 'Neurovi123');

      //choose menu service general poly
      cy.get('[data-sidebar="Parent Pelayanan"]').click();
      cy.get('[data-sidebar="Pelayanan Poli Umum"]').click();
      //search patient data
      cy.get('[data-general-poly="search"]').type(data.name);
      cy.get('tr').then(() => {
        cy.get('td')
          .contains(data.name)
          .click();
      });
    });
    cy.fixture('assessentData').then(data => {
      cy.intercept('GET', 'http://localhost:4000/patient/emr/**').as(
        'getPatientData',
      );
      cy.get('[data-general-poly="assessmen"]').click();
      for (let index in data.nurse.subjective.anamnesis) {
        cy.get(`[data-assessment-general="anamnesis nurse ${index}"]`).type(
          data.nurse.subjective.anamnesis[index],
        );
        cy.get(
          `[data-assessment-general="add anamnesis nurse ${index}"]`,
        ).click();
      }

      cy.get('[data-serviceassessmentobjectivedata="sistole"]')
        .first()
        .type(data.nurse.objective.sistolik);
      cy.get('[data-serviceassessmentobjectivedata="diastole"]')
        .first()
        .type(data.nurse.objective.diastolik);
      cy.get('[data-serviceassessmentobjectivedata="pulse"]')
        .first()
        .type(data.nurse.objective.pulse);
      cy.get('[data-serviceassessmentobjectivedata="weight"]')
        .first()
        .type(data.nurse.objective.bb);
      cy.get('[data-serviceassessmentobjectivedata="height"]')
        .first()
        .type(data.nurse.objective.tb);
      cy.get('[data-serviceassessmentobjectivedata="bellyCircumference"]')
        .first()
        .type(data.nurse.objective.lp);
      cy.get('[data-serviceassessmentobjectivedata="respiration"]')
        .first()
        .type(data.nurse.objective.rr);
      cy.get('[data-serviceassessmentobjectivedata="saturation"]')
        .first()
        .type(data.nurse.objective.saturation);
      cy.get('[data-serviceassessmentobjectivedata="temperature"]')
        .first()
        .type(data.nurse.objective.temperature);
      dropdownVlist(
        '[data-serviceassessmentobjectivedata="awareness"]',
        data.nurse.objective.awareness,
      );
      cy.get('[data-assessment-general="simpan"]').click();
    });
  });
  //fill doctor's assessment
  it('Fill assessment as doctor', () => {
    cy.fixture('outpatientRegisData').then(data => {
      loginUser('dokter03', 'Neurovi123');
      //choose poly if there any
      // chooseFromDropdown('[data-login="unit"]', 'Poli Umum');
      // cy.get('[data-login="ok"]').click();
      //choose menu service general poly
      cy.get('[data-sidebar="Parent Pelayanan"]').click();
      cy.get('[data-sidebar="Pelayanan Poli Umum"]').click();
      //search patient data
      cy.get('[data-general-poly="search"]').type(data.name);
      cy.get('tr').then(() => {
        cy.get('td')
          .contains(data.name)
          .click();
      });
    });
    cy.fixture('assessentData').then(data => {
      cy.get(`[data-general-poly="assessmen"]`).click();
      for (let index in data.doctor.doctorAnamnesis) {
        cy.get(`[data-assessment-general="anamnesis dokter ${index}"]`).type(
          data.doctor.doctorAnamnesis[index],
        );
        cy.get(
          `[data-assessment-general="add anamnesis dokter${index}"]`,
        ).click();
        if (index == +data.doctor.doctorAnamnesis.length - 1) {
          cy.get(
            `[data-assessment-general="hapus anamnesis dokter${data.doctor.doctorAnamnesis.length}"]`,
          ).click();
        }
      }

      chooseFromDropdown(
        '[data-assessment-general="mainDiagnose"]',
        data.doctor.assessment.mainDiagnose,
      );
      lastDropdown(
        '[data-assessment-general="returnStatus"]',
        data.doctor.assessment.returnStatus,
      );
      cy.get('[data-assessment-general="simpan"]').click();
    });
  });
});
