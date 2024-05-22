/// <reference types="cypress" />
import { createAssessentData } from '../../../../support/dataHelper';
import {
  chooseFromDropdown,
  dropdownVlist,
  lastDropdown,
  loginUser,
  newPatientOutpatient,
} from '../../../../support/helpers';
import moment from 'moment-timezone';
const physicalList = [
  'head',
  'eye',
  'ears',
  'nose',
  'mouth',
  'neck',
  'hair',
  'lip',
  'teeth',
  'tounge',
  'palate',
  'throat',
  'tonsils',
  'chest',
  'breast',
  'back',
  'stomach',
  'genitalia',
  'anus',
  'upperArm',
  'lowerArm',
  'handFingers',
  'handNails',
  'handJoints',
  'upperLimbs',
  'lowerLimbs',
  'toes',
  'toeNail',
  'legJoints',
];
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
      cy.get('[data-assessment-general="alergi 0"]').then(() => {
        for (let index in data.nurse.subjective.alergy) {
          cy.get(`[data-assessment-general="alergi ${index}"]`).type(
            data.nurse.subjective.alergy[index],
          );
          cy.get(`[data-assessment-general="add alergi ${index}"]`).click();
        }
      });
      cy.get('[data-assessment-general="penyakit 0"]').then(() => {
        for (let index in data.nurse.subjective.illness) {
          cy.get(`[data-assessment-general="penyakit ${index}"]`).type(
            data.nurse.subjective.illness[index],
          );
          cy.get(`[data-assessment-general="add penyakit ${index}"]`).click();
        }
      });
      cy.get('[data-assessment-general="pengobatan"]').type(
        data.nurse.subjective.treatment,
      );
      cy.get('[data-assessment-general="psychologyStatus"]').click({
        force: true,
      });
      cy.get('[data-assessment-general="psikologi"]')
        .click()
        .then(() => {
          const psy = data.nurse.subjective.psychology;
          for (let index in psy) {
            cy.get('[data-assessment-general="psikologi"]').type(psy[index]);
            cy.get('.v-list-item__title')
              .last()
              .contains(psy[index])
              .click();
          }
        });
      cy.get('[data-assessment-general="ekonomi"]')
        .first()
        .type(data.nurse.subjective.social);
      cy.get('[data-assessment-general="spiritual"]')
        .first()
        .type(data.nurse.subjective.spiritual);
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
      cy.wait('@getPatientData').then(item => {
        const ada = item.response?.body.data.social.birth.date;
        const birthDate = moment(ada);
        const today = moment();
        const diff = moment().diff(birthDate, 'months');
        if (diff > 228) {
          console.log(data);
          adultScreening(data.nurse);
        } else {
          console.log(data);
          childScreening(data).nurse;
        }
      });
      cy.get('[data-assessment-general="simpan"]').click();
    });
  });
  //fill doctor's assessment
  it('Fill assessment as doctor', () => {
    cy.fixture('outpatientRegisData').then(data => {
      loginUser('dokter03', 'Neurovi123');
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
      // for (let index in data.doctor.doctorAnamnesis) {
      //   cy.get(`[data-assessment-general="anamnesis dokter ${index}"]`).type(
      //     data.doctor.doctorAnamnesis[index],
      //   );
      //   cy.get(
      //     `[data-assessment-general="add anamnesis dokter${index}"]`,
      //   ).click();
      //   if (index == +data.doctor.doctorAnamnesis.length - 1) {
      //     cy.get(
      //       `[data-assessment-general="hapus anamnesis dokter${data.doctor.doctorAnamnesis.length}"]`,
      //     ).click();
      //   }
      // }
      // for (let index in physicalList) {
      //   cy.get(`[data-assessment-general="${physicalList[index]}"]`).type(
      //     data.doctor.physical,
      //   );
      // }
      // cy.get('[data-assessment-general="ekg"]').type(data.doctor.other);
      // cy.get('[data-assessment-general="lab"]').type(data.doctor.other);
      // cy.get('[data-assessment-general="radiology"]').type(data.doctor.other);
      // cy.get('[data-assessment-general="otherNote"]').type(data.doctor.other);

      chooseFromDropdown(
        '[data-assessment-general="mainDiagnose"]',
        data.doctor.assessment.mainDiagnose,
      );
      cy.get('[data-assessment-general="detail"]').type(
        data.doctor.assessment.mainDiagnoseInfo,
      );
      for (let index in data.doctor.assessment.secDiagnose) {
        chooseFromDropdown(
          `[data-assessment-general="secondaryDiagnose${index}"]`,
          data.doctor.assessment.secDiagnose[index],
        );
        cy.get(
          `[data-assessment-general="add secondaryDiagnose${index}"]`,
        ).click();
        cy.get(`[data-assessment-general="diagnoseInfo${index}"]`).type(
          data.doctor.assessment.secDiagnoseInfo,
        );
        if (index == +data.doctor.assessment.secDiagnose.length - 1) {
          cy.get(
            `[data-assessment-general="delete secondaryDiagnose${data.doctor.assessment.secDiagnose.length}"]`,
          ).click();
        }
      }
      data.doctor.assessment.chronic
        ? cy.get('[data-assessment-general="isChronic"]').click({ force: true })
        : cy
            .get('[data-assessment-general="!isChronic"]')
            .click({ force: true });
      lastDropdown(
        '[data-assessment-general="returnStatus"]',
        data.doctor.assessment.returnStatus,
      );
      chooseFromDropdown(
        '[data-assessment-general="deathCause"]',
        data.doctor.assessment.deathCause,
      );
      for (let index in data.doctor.planning.actions) {
        cy.get(`[data-assessment-general="tindakan${index}"]`).type(
          data.doctor.planning.actions[index],
        );
        cy.get(`[data-assessment-general="add tindakan${index}"]`).click();
        chooseFromDropdown(
          `[data-assessment-general="icd9${index}"]`,
          data.doctor.planning.icd9[index],
        );
        if (index == +data.doctor.planning.actions.length - 1) {
          cy.get(
            `[data-assessment-general="delete tindakan${data.doctor.planning.actions.length}"]`,
          ).click();
        }
      }
      for (let index in data.doctor.planning.therapy) {
        cy.get(`[data-assessment-general="terapi${index}"]`).type(
          data.doctor.planning.therapy[index],
        );
        cy.get(`[data-assessment-general="add terapi${index}"]`).click();
        if (index == +data.doctor.planning.therapy.length - 1) {
          cy.get(
            `[data-assessment-general="delete terapi${data.doctor.planning.therapy.length}"]`,
          ).click();
        }
      }
      cy.get('[data-assessment-general="simpan"]').click();
    });
  });
});
function childScreening(datas) {
  datas.screeningChild.isThin
    ? cy.get('[data-assessment-general="isThin"]').click({ force: true })
    : cy.get('[data-assessment-general="!isThin"]').click({ force: true });
  datas.screeningChild.isLossWeight
    ? cy.get('[data-assessment-general="isLossWeight"]').click({ force: true })
    : cy
        .get('[data-assessment-general="!isLossWeight"]')
        .click({ force: true });
  datas.screeningChild.isHasCondition
    ? cy
        .get('[data-assessment-general="isHasCondition"]')
        .click({ force: true })
    : cy
        .get('[data-assessment-general="!isHasCondition"]')
        .click({ force: true });
  datas.screeningChild.isMalnutrition
    ? cy
        .get('[data-assessment-general="isMalnutrition"]')
        .click({ force: true })
    : cy
        .get('[data-assessment-general="!isMalnutrition"]')
        .click({ force: true });
  chooseFromDropdown(
    '[data-assessment-general="diagnosis"]',
    datas.screeningChild.diagnose,
  );
  chooseFromDropdown(
    '[data-assessment-general="kognitif"]',
    datas.screeningChild.cognitive,
  );
  chooseFromDropdown(
    '[data-assessment-general="medicamentosa"]',
    datas.screeningChild.medicamentosa,
  );
}

function adultScreening(datas) {
  switch (datas.screeningAdult.unplanned) {
    case 1:
      cy.get('[data-assessment-general="no isUnplanned"]').click({
        force: true,
      });
      break;
    case 2:
      cy.get('[data-assessment-general="notSure isUnplanned"]').click({
        force: true,
      });
      break;
    case 3:
      cy.get('[data-assessment-general="sure isUnplanned"]').click({
        force: true,
      });
      break;
  }
  if (datas.screeningAdult.unplanned == 3) {
    switch (datas.screeningAdult.unplannedAmount) {
      case 1:
        cy.get('[data-assessment-general="1-5kg"]').click({
          force: true,
        });
        break;
      case 2:
        cy.get('[data-assessment-general="6-10 kg"]').click({
          force: true,
        });
        break;
      case 3:
        cy.get('[data-assessment-general="11-15 kg"]').click({
          force: true,
        });
        break;
      case 4:
        cy.get('[data-assessment-general=">15 kg"]').click({
          force: true,
        });
        break;
    }
  }
  datas.screeningAdult.foodIntake
    ? cy.get('[data-assessment-general="isFoodIntake"]').click({ force: true })
    : cy
        .get('[data-assessment-general="!isFoodIntake"]')
        .click({ force: true });
  datas.screeningAdult.seriousIllness
    ? cy
        .get('[data-assessment-general="seriousIllness"]')
        .click({ force: true })
    : cy
        .get('[data-assessment-general="!seriousIllness"]')
        .click({ force: true });
  datas.screeningAdult.fallHistory
    ? cy.get('[data-assessment-general="fallHistory"]').click({ force: true })
    : cy.get('[data-assessment-general="!fallHistory"]').click({ force: true });
  datas.screeningAdult.secondaryDiagnose
    ? cy.get('[data-assessment-general="secDiagnose"]').click({ force: true })
    : cy.get('[data-assessment-general="!secDiagnose"]').click({ force: true });
  switch (datas.screeningAdult.walker) {
    case 1:
      cy.get('[data-assessment-general="normalWalker"]').click({ force: true });
      break;
    case 2:
      cy.get('[data-assessment-general="crutchWalker"]').click({ force: true });
      break;
    case 3:
      cy.get('[data-assessment-general="furnitureWalker"]').click({
        force: true,
      });
      break;
  }
  datas.screeningAdult.heparin
    ? cy.get('[data-assessment-general="heparin"]').click({ force: true })
    : cy.get('[data-assessment-general="!heparin"]').click({ force: true });
  switch (datas.screeningAdult.walk) {
    case 1:
      cy.get('[data-assessment-general="normalWalk"]').click({ force: true });
      break;
    case 2:
      cy.get('[data-assessment-general="weakWalk"]').click({ force: true });
      break;
    case 3:
      cy.get('[data-assessment-general="distrubedWalk"]').click({
        force: true,
      });
      break;
  }
  datas.screeningAdult.mentalStatus
    ? cy
        .get('[data-assessment-general="sesuai kemampuan"]')
        .click({ force: true })
    : cy.get('[data-assessment-general="lupa"]').click({ force: true });
}
