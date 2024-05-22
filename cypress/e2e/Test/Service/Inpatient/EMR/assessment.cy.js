/// <reference types="cypress" />

import {
  createPatientJson,
  inpatientEMRData,
  physicalList,
} from '../../../../../support/dataHelper';
import {
  addOutpatientRegistration,
  chooseFromDropdown,
  clearCookies,
  datePicker,
  dropdownVlist,
  fillInpatientOrder,
  inpatientRegistration,
  loginUser,
} from '../../../../../support/helpers';

describe('Inpatient EMR', () => {
  before(() => {
    clearCookies();
    inpatientEMRData();
    cy.viewport(1920, 1080);
    // cy.login('admin', 'admin123');
    cy.visit('http://localhost:8080/'); // Visit apps
    loginUser('admin', 'admin123');
    createPatientJson();
    addOutpatientRegistration();
  });

  it('initial Assessment', () => {
    //fill SPRI
    fillInpatientOrder();
    //regist patient to inpatient
    inpatientRegistration();
    cy.fixture('outpatientRegisData').then(data => {
      cy.get('[data-testid="Parent Pelayanan"]').click();
      cy.get('[data-testid="Pelayanan Rawat Inap"]').click();
      cy.get('[data-testid="search"]').type(data.noRm);
      cy.contains(data.noRm).click();

      //go to emr inpatient page
      cy.get('[data-testid="emr"]').click();
      cy.get('[data-testid="Assesmen Awal Rawat Inap"]').should('be.visible');
    });

    //fill pengkajian awal data
    cy.intercept(
      'http://localhost:4000/inpatient/firstassesment/get/**?type=initial_assessment',
    ).as('getInitialAssessment');
    cy.fixture('inpatientEMRData').then(data => {
      // cy.wait('@getInitialAssessment');
      const item = data.earlyAssessment.initialAssessment;
      chooseFromDropdown('[data-testid="staff"]', data.nurse);
      datePicker('[data-testid="arriveDate"]', item.arrivedDate);
      cy.get('[data-testid="arrivedTime"]').type(
        `${item.arrivedTime[0]}:${item.arrivedTime[1]}`,
      );
      cy.get('[data-testid="assessmentStart"]')
        .click()
        .then(() => {
          cy.get(
            '.menuable__content__active > .v-picker > .v-picker__body > :nth-child(1) > .v-date-picker-table > table > tbody ',
          )
            .contains(item.arrivedDate)
            .last()
            .click({ force: true });
        });
      cy.get('[data-testid="assessmentStartTime"]').type(
        `${item.arrivedTime[0]}:${item.arrivedTime[1]}`,
      );
      cy.get('[data-testid="ClearName"]').type(item.clearName);
      chooseFromDropdown('[data-testid="relation"]', item.relation);
      chooseFromDropdown('[data-testid="enteryMethod"]', item.entryMethod);
      switch (item.originPoly) {
        case 'igd':
          cy.get('[data-testid="igd"]').click({ force: true });
          break;
        case 'umum':
          cy.get('[data-testid="umum"]').click({ force: true });
          break;
        case 'VK':
          cy.get('[data-testid="VK"]').click({ force: true });
          break;
      }
    });

    // Fill anamnesa data
    cy.fixture('inpatientEMRData').then(data => {
      cy.intercept(
        'http://localhost:4000/inpatient/firstassesment/get/**?type=anamnesis',
      ).as('getAnamnesisAssessment');
      const item = data.earlyAssessment.anamnesa;
      cy.get('[data-testid="Anamnesa"]').click();
      cy.wait('@getAnamnesisAssessment');
      cy.get('[data-testid="currentHealtHistory"]').type(
        item.presentHealtyHistory,
      );
      cy.get('[data-testid="pastHealthHistory"]').type(item.pastHealtyHistory);
      if (item.isFamilyDisease) {
        cy.get('[data-testid="familyDiseaseHistory"]').click({ force: true });
        chooseFromDropdown(
          '[data-testid="familyDiseaseHistoryName"]',
          item.familyDisease,
        );
      }
      cy.get('[data-testid="treatmentHistoryName"]').type(
        item.treatmentHistory,
      );
      if (Cypress._.random() < 0.5) {
        cy.get('[data-testid="psychologyStatus"]').click({ force: true });
        chooseFromDropdown(
          '[data-testid="psychologyStatusName"]',
          item.psychologyStatus,
        );
      }
      for (let i = 0; i < item.allergyHistory.length; i++) {
        cy.get(`[data-testid="allergy ${i}"]`).type(item.allergyHistory[i]);
        cy.get(`[data-testid="add allergy ${i}"]`).click();
      }
    });

    //fill objective data
    cy.fixture('inpatientEMRData').then(data => {
      const item = data.earlyAssessment.objectiveData;
      cy.intercept(
        'http://localhost:4000/inpatient/firstassesment/get/**?type=objective',
      ).as('getObjectiveAssessment'); //   const item = data.earlyAssessment.objectiveData;
      cy.get('[data-testid="Data Objektif"]').click();
      cy.wait('@getObjectiveAssessment');
      cy.get('[data-testid="sistole"]').type(item.sistolik);
      cy.get('[data-testid="diastole"]').type(item.diastolik);
      cy.get('[data-testid="hearRate"]').type(item.pulse);
      cy.get('[data-testid="weight"]').type(item.bb);
      cy.get('[data-testid="weight"]').type(item.bb);
      cy.get('[data-testid="height"]').type(item.tb);
      cy.get('[data-testid="bellyCircumference"]').type(item.lp);
      cy.get('[data-testid="rr"]').type(item.rr);
      cy.get('[data-testid="saturation"]').type(item.saturation);
      cy.get('[data-testid="temperature"]').type(item.temperature);
      chooseFromDropdown('[data-testid="awaraness"]', item.awareness);
    });

    //fill physical data
    cy.intercept(
      'http://localhost:4000/inpatient/firstassesment/get/**?type=physical',
    ).as('getPhysicalAssessment'); //   const item = data.earlyAssessment.objectiveData;
    cy.get('[data-testid="Pemeriksaan Fisik"]').click();
    cy.wait('@getPhysicalAssessment');
    for (let i = 0; i < physicalList.length; i++) {
      const x = physicalList[i];
      cy.get(`[data-testid="${x.label}"]`).type(`Normal-${i}`);
    }

    //fill pain assessment data
    cy.fixture('inpatientEMRData').then(data => {
      cy.intercept(
        'http://localhost:4000/inpatient/firstassesment/get/**?type=pain_assessment',
      ).as('getPainAssessment');
      const item = data.earlyAssessment.painAssessment;
      cy.get('[data-testid="Assesmen Nyeri"]').click();
      cy.wait('@getPainAssessment');
      cy.get('.v-slider').then(() => {
        cy.contains('.v-slider__tick', item.pain).click();
      });
      chooseFromDropdown('[data-testid="painFactor"]', item.painFactor);
      switch (item.painFrequency) {
        case 1:
          cy.get('[data-testid="painFrequency 1"]').click({ force: true });
          break;
        case 2:
          cy.get('[data-testid="painFrequency 2"]').click({ force: true });
          break;
      }
      cy.get('.pl-15').click();
      chooseFromDropdown('[data-testid="painLike"]', item.painLike);
      !item.painDuration ?? cy.get('[data-testid="painDuration 1"]').click();
      cy.get('.pl-15').click();
      !item.painRadiation ?? cy.get('[data-testid="painRadiation"]').click();
      cy.get('.pl-15').click();
      switch (item.severity) {
        case 1:
          cy.get('[data-testid="severity 1"]').click({ force: true });
          break;
        case 2:
          cy.get('[data-testid="severity 2"]').click({ force: true });
          break;
        case 3:
          cy.get('[data-testid="severity 3"]').click({ force: true });
          break;
      }
      cy.get('.pl-15').click();
      cy.get('[data-testid="description"]').type(item.desc);
      cy.get('[data-testid="simpan"]').click();
    });
  });

  it('Neonatus Assessment', () => {
    //fill SPRI
    fillInpatientOrder('Neonatus');
    //regist patient to inpatient
    inpatientRegistration();
    let sex = true;
    //go to neonatus assessment
    cy.fixture('outpatientRegisData').then(data => {
      cy.intercept(`http://localhost:4000/inpatient?search=${data.noRm}**`).as(
        'getSearchResult',
      );
      cy.intercept(
        'http://localhost:4000/inpatient/neonatus/get/**?type=information',
      ).as('getDataNeonatus');
      cy.get('[data-testid="Parent Pelayanan"]').click();
      cy.get('[data-testid="Pelayanan Rawat Inap"]').click();
      cy.get('[data-testid="search"]').type(data.noRm);
      cy.wait('@getSearchResult').then(data => {
        sex = data.response.body.data[0].social.gender;
      });
      cy.contains(data.noRm).click();

      //go to emr inpatient page
      cy.get('[data-testid="emr"]').click();
      cy.get('[data-testid="Assesmen Neonatus"]')
        .should('be.visible')
        .click();
      // cy.wait('@getDataNeonatus');
    });

    //fill mother & baby information
    cy.fixture('inpatientEMRData').then(data => {
      const item = data.neonatusAssessment.information;
      cy.get('[data-testid="staff"]').type(data.nurse);

      //informasi Ibu
      chooseFromDropdown('[data-testid="mother"]', item.motherName);
      cy.get('[data-testid="motherProfession"]').type(item.motherProfession);
      cy.get('[data-testid="motherStatusG"]').type(item.statusG);
      cy.get('[data-testid="motherStatusP"]').type(item.statusP);
      cy.get('[data-testid="motherStatusA"]').type(item.statusA);

      //INFORMASI AYAH
      cy.get('[data-testid="fatherName"]').type(item.fatherName);
      cy.get('[data-testid="fatherProfession"]').type(item.fatherProfession);

      //Informasi Bayi
      datePicker('[data-testid="babyBirthDate"]', item.birthDate);
      cy.get('[data-testid="babyBirthTime"]').type(
        `${item.birthTime[0]}:${item.birthTime[1]}`,
      );
      cy.get('[data-testid="babyLength"]').type(item.bodyLenght);
      cy.get('[data-testid="babyBirthType"]').type(item.birthType);
      cy.get('[data-testid="babyChestCircumference"]').type(
        item.chestCircumference,
      );
      cy.get('[data-testid="babyWeight"]').type(item.weight);
      cy.get('[data-testid="babyHeadCircumference"]').type(
        item.headCircumference,
      );
    });

    //fill physical assessment
    cy.fixture('inpatientEMRData').then(data => {
      cy.contains('Pengkajian Fisik ')
        .click()
        .wait(1000);
      const item = data.neonatusAssessment.physical;
      //eye
      item.eyeInfection
        ? cy.get('[data-testid="eyesInfection"]').click({ force: true })
        : cy.get('[data-testid="!eyesInfection"]').click({ force: true });

      //Mouth
      item.mouthSuctionReflex
        ? cy.get('[data-testid="mouthSuctionReflex"]').click({ force: true })
        : cy.get('[data-testid="!mouthSuctionReflex"]').click({ force: true });
      item.mouthHareLips
        ? cy.get('[data-testid="moutHareLips"]').click({ force: true })
        : cy.get('[data-testid="!mouthHareLips"]').click({ force: true });
      item.mouthCyanoticLips
        ? cy.get('[data-testid="mouthCyanoticLips"]').click({ force: true })
        : cy.get('[data-testid="!mouthCyanoticLips"]').click({ force: true });
      item.mouthPalatosic
        ? cy.get('[data-testid="mouthPalatosic"]').click({ force: true })
        : cy.get('[data-testid="!mouthPalatosic"]').click({ force: true });

      //movement
      item.limbMovement
        ? cy.get('[data-testid="limbMovement"]').click({ force: true })
        : cy.get('[data-testid="!limbMovement"]').click({ force: true });
      item.limbPolydactyly
        ? cy.get('[data-testid="limbPolydactyly"]').click({ force: true })
        : cy.get('[data-testid="!limbPolydactyly"]').click({ force: true });
      item.limbSyndactytl
        ? cy.get('[data-testid="limbSyndactytl"]').click({ force: true })
        : cy.get('[data-testid="!limbSyndactytl"]').click({ force: true });
      cy.get('[data-testid="limbOtherAbnormalitiesDesc"]').type(
        item.otherAbnormalities,
      );
      item.isOtherAbnormalities
        ? cy
            .get('[data-testid="limbOtherAbnormalities"]')
            .click({ force: true })
        : cy
            .get('[data-testid="!limbOtherAbnormalities"]')
            .click({ force: true });

      item.chestRespiratoryFrequencyCheck
        ? cy
            .get('[data-testid="chestRespiratoryFrequencyCheck"]')
            .click({ force: true })
        : cy
            .get('[data-testid="!chestRespiratoryFrequencyCheck"]')
            .click({ force: true });
      item.chestHeartRateCheck
        ? cy.get('[data-testid="chestHeartRateCheck"]').click({ force: true })
        : cy.get('[data-testid="!chestHeartRateCheck"]').click({ force: true });
      item.bellyUmbilical
        ? cy.get('[data-testid="bellyUmbilical"]').click({ force: true })
        : cy.get('[data-testid="!bellyUmbilical"]').click({ force: true });
      item.bellyProtrusion
        ? cy.get('[data-testid="bellyProtrusion"]').click({ force: true })
        : cy.get('[data-testid="!bellyProtrusion"]').click({ force: true });

      if (sex) {
        item.sexBoyScrotum
          ? cy.get('[data-testid="sexBoyScrotum"]').click({ force: true })
          : cy.get('[data-testid="!sexBoyScrotum"]').click({ force: true });
        item.sexBoyTesticles
          ? cy.get('[data-testid="sexBoyTesticles"]').click({ force: true })
          : cy.get('[data-testid="!sexBoyTesticles"]').click({ force: true });
        item.sexBoyPenisHole
          ? cy.get('[data-testid="sexBoyPenisHole"]').click({ force: true })
          : cy.get('[data-testid="!sexBoyPenisHole"]').click({ force: true });
      } else {
        item.bellyProtrusion
          ? cy.get('[data-testid="bellyProtrusion"]').click({ force: true })
          : cy.get('[data-testid="!bellyProtrusion"]').click({ force: true });
        item.sexGirlUretraHole
          ? cy.get('[data-testid="sexGirlUretraHole"]').click({ force: true })
          : cy.get('[data-testid="!sexGirlUretraHole"]').click({ force: true });
      }
      item.anusHole
        ? cy.get('[data-testid="anusHole"]').click({ force: true })
        : cy.get('[data-testid="!anusHole"]').click({ force: true });

      cy.get('[data-testid="abnormalities"]').type(item.abnormalities);
      cy.get('[data-testid="notePostScript"]').type(item.notePostScript);
      cy.get('[data-testid="NotesBuilInNote"]').type(item.NotesBuilInNote);
    });

    //fill apgar score
    const apgarList = ['a1', 'p', 'g', 'a2', 'r'];
    const time = [1, 5, 10];
    cy.fixture('inpatientEMRData').then(data => {
      cy.contains('Apgar Score')
        .click()
        .wait(1000);
      const item = data.neonatusAssessment.apgar;
      for (let i = 0; i < time.length; i++) {
        for (let j = 0; j < apgarList.length; j++) {
          cy.get(`[data-testid="${apgarList[j]} ${time[i]}"]`).click();
          cy.get('.menuable__content__active > .text-start')
            .contains(item[i][j])
            .click();
        }
      }
    });
  });

  it('Obsgyn Assessment', () => {
    //fill SPRI
    fillInpatientOrder('Obsgyn');
    //regist patient to inpatient
    inpatientRegistration();

    //go to obsgyn assessment
    cy.fixture('outpatientRegisData').then(data => {
      cy.intercept('http://localhost:4000/pregnancyassessment/**').as(
        'getDataPregnancy',
      );
      cy.intercept('http://localhost:4000/birthassessment/**').as(
        'getDataBirth',
      );
      cy.get('[data-testid="Parent Pelayanan"]').click();
      cy.get('[data-testid="Pelayanan Rawat Inap"]').click();
      cy.get('[data-testid="search"]').type(data.noRm);
      cy.contains(data.noRm).click();

      //go to emr inpatient page
      cy.get('[data-testid="emr"]').click();
      cy.get('[data-testid="Assesmen Kebidanan Ibu Hamil"]')
        .should('be.visible')
        .click();
    });

    //fill social history & mestruation
    cy.fixture('inpatientEMRData').then(data => {
      const item = data.obsgynAssessment.midwife.socialandPeriod;

      chooseFromDropdown('[data-testid="staff"]', data.nurse);
      chooseFromDropdown(
        '[data-testid="currentPregnancy"]',
        item.currentPregnancy,
      );
      cy.get('[data-testid="currentPregnancyFeeling"]').type(
        item.currentPregnancyFeeling,
      );
      chooseFromDropdown(
        `[data-testid="martialHistory status 0"]`,
        item.martialHistory.status,
      );
      cy.get(`[data-testid="martialHistory age 0"]`).type(
        item.martialHistory.age,
      );
      cy.get(`[data-testid="martialHistory durationMarriage 0"]`).type(
        item.martialHistory.duration,
      );
      cy.get(`[data-testid="martialHistory abortus 0"]`).type(
        item.martialHistory.abortus,
      );
      cy.get(`[data-testid="martialHistory husbanAge 0"]`).type(
        item.martialHistory.husbanAge,
      );
      cy.get(`[data-testid="martialHistory totalChildren 0"]`).type(
        item.martialHistory.totalChildren,
      );
      if (item.intensity === false)
        cy.get('[data-testid="!intensity"]').click({ force: true });
      cy.get('[data-testid="firstPeriod"]').type(item.firstPeriod);
      cy.get('[data-testid="periodCycle"]').type(item.periodCycle);
      cy.get('[data-testid="amount"]').type(item.periodAmount);
      console.log(item.dysmenorrhea);
      if (item.dysmenorrhea === true)
        cy.get('[data-testid="dysmenorrhea"]').click({ force: true });
    });

    cy.fixture('inpatientEMRData').then(data => {
      const item = data.obsgynAssessment.midwife.laborHistory;
      //fill pregnant history
      cy.get('[data-testid="Riwayat Kehamilan"]').click();
      datePicker('[data-testid="hpht"]', item.hpht);
      cy.get('[data-testid="firstFetalMovement"]').type(
        item.firstFetalMovement,
      );
      switch (item.totalFetalMovement) {
        case 2:
          cy.get('[data-testid="totalFetalMovement 2"]').click({ force: true });
          break;
        case 3:
          cy.get('[data-testid="totalFetalMovement 3"]').click({ force: true });
          break;
        case 4:
          cy.get('[data-testid="totalFetalMovement 4"]').click({ force: true });
          break;
      }
      cy.get('[data-testid="complaintsPerTrimester-0"]').type(item.complaints);
      cy.get(`[data-testid="ageYear-0"]`).type(item.ageYear);
      cy.get(`[data-testid="ageMonth-0"]`).type(item.ageMonth);
      cy.get(`[data-testid="bbl-0"]`).type(item.bbl);
      cy.get(`[data-testid="complication-0"]`).type(item.complaints);
      cy.get(`[data-testid="currentCondition-0"]`).type(item.currentConditions);
      chooseFromDropdown(`[data-testid="gender-0"]`, item.gender);
      chooseFromDropdown(`[data-testid="helper-0"]`, item.helper);
      chooseFromDropdown(`[data-testid="place-0"]`, item.place);
      if (item.helper == 'Lain-Lain')
        cy.get(`[data-testid="helperEtc-0"]`).type(item.helperDesc);
      if (item.place == 'Lain-Lain')
        cy.get(`[data-testid="placeEtc-0"]`).type(item.placeDesc);
    });

    //fill PK history
    cy.fixture('inpatientEMRData').then(data => {
      const item = data.obsgynAssessment.midwife.kbHistory;
      cy.get('[data-testid="Riwayat KB & Imunisasi"]').click();

      item.isKB
        ? (cy.get('[data-testid="kbStatus"]').click({ force: true }),
          cy.get(`[data-testid="kbMethod ${item.kb}"]`).click({ force: true }))
        : cy.get('[data-testid="form.!kbStatus"]').click({ force: true });

      cy.get('[data-testid="familyDiseaseHistory"]').type(item.familyDisease);
      cy.get('[data-testid="diseaseSurgeryHistory"]').type(item.surgeryDisease);
      cy.get('[data-testid="dietBeforePregrant"]').type(
        item.dietBeforePregrant,
      );
      cy.get('[data-testid="dietAfterPregrant"]').type(item.dietAfterPregrant);
      if (!item.isTT)
        cy.get('[data-testid="!imunizationTT"]').click({ force: true });
    });

    //fill obstry history
    cy.fixture('inpatientEMRData').then(data => {
      const item = data.obsgynAssessment.midwife.obstryHistory;
      cy.get('[data-testid="Riwayat Obstetri"]').click();

      cy.get('[data-testid="uterinePalpation"]').type(item.uterinePalpation);
      chooseFromDropdown(
        '[data-testid="fetalPresentation"]',
        item.fetalPresentation,
      );
      cy.get('[data-testid="fundusUteriHeight"]').type(item.fundusUteriHeight);
      cy.get('[data-testid="fetalWeightEstimation"]').type(
        item.fetalWeightEstimation,
      );
      cy.get('[data-testid="place"]').type(item.place);
      if (item.isContraction)
        cy.get('[data-testid="radioRules"]').click({ force: true });

      cy.get('[data-testid="simpan"]').click();
    });

    //fill labor assessment
    cy.fixture('inpatientEMRData').then(data => {
      const item = data.obsgynAssessment.labor.laborHistory;
      cy.intercept('http://localhost:4000/inpatient/pregnancyhistory/**').as(
        'getHistoryPregnancy',
      );
      cy.get('[data-testid="Assesmen Persalinan"]').click();
      cy.wait('@getHistoryPregnancy').then(x => {
        const i = x.response.body.data.length;
        console.log(i);

        chooseFromDropdown('[data-testid="staff"]', data.nurse);
        cy.get('[data-testid="diagnosa"]').type(item.diagnosa);
        datePicker('[data-testid="amnioticFluidOutDate"]', item.date);
        cy.get('[data-testid="HISDate"]')
          .click()
          .then(() => {
            cy.get(
              '.menuable__content__active > .v-picker > .v-picker__body > :nth-child(1) > .v-date-picker-table > table ',
            )
              .contains(item.date)
              .last()
              .click({ force: true });
          });
        cy.get('[data-testid="mucusOutDate"]')
          .click()
          .then(() => {
            cy.get(
              '.menuable__content__active > .v-picker > .v-picker__body > :nth-child(1) > .v-date-picker-table > table > tbody ',
            )
              .contains(item.date)
              .first()
              .click({ force: true });
          });
        cy.get('[data-testid="HISTime"]').type(
          `${item.time[0]}:${item.time[1]}`,
        );
        cy.get('[data-testid="amnioticFluidOutTime"]').type(
          `${item.time[0]}:${item.time[1]}`,
        );
        cy.get('[data-testid="mucusOutTime"]').type(
          `${item.time[0]}:${item.time[1]}`,
        );
        cy.get(`[data-testid="tambah ${+i - 1}"]`).click();
        cy.get(`[data-testid="ageYear ${i}"]`).type(item.ageYear);
        cy.get(`[data-testid="ageMonth ${i}"]`).type(item.ageMonth);
        cy.get(`[data-testid="bbl ${i}"]`).type(item.bbl);
        cy.get(`[data-testid="complication ${i}"]`).type(item.complications);
        cy.get(`[data-testid="currentCondition ${i}"]`).type(
          item.currentConditions,
        );
        chooseFromDropdown(`[data-testid="gender ${i}"]`, item.gender);
        chooseFromDropdown(`[data-testid="helper ${i}"]`, item.helper);
        chooseFromDropdown(`[data-testid="place ${i}"]`, item.place);
        if (item.helper == 'Lain-Lain')
          cy.get(`[data-testid="helperEtc ${i}"]`).type(item.helperDesc);
        if (item.place == 'Lain-Lain')
          cy.get(`[data-testid="placeEtc ${i}"]`).type(item.placeDesc);
      });
    });

    // fill kb history & imunization
    cy.fixture('inpatientEMRData').then(data => {
      cy.get('[data-testid="Riwayat KB & Menstruasi"]').click();
      const item = data.obsgynAssessment.labor.kbHistory;

      item.isKB
        ? (cy
            .get('[data-testid="kbStatus"]')
            .click({ force: true })
            .wait(500),
          cy.get(`[data-testid="kbMethod ${item.kb}"]`).click({ force: true }))
        : cy.get('[data-testid="!kbStatus"]').click({ force: true });

      cy.get('[data-testid="diseaseSurgeryHistory"]').type(item.complaints);
      item.isMenarche
        ? cy.get('[data-testid="menarche"]').click({ force: true })
        : cy.get('[data-testid="!menarche"]').click({ force: true });
      datePicker('[data-testid="dateHPHT"]', item.hpht);
      cy.get('[data-testid="periodCycle"]').type(item.periodCycle);
      cy.get('[data-testid="periodDuration"]').type(item.periodDuration);
      cy.get('[data-testid="uk"]').type(item.uk);
    });

    //fill labor note
    cy.fixture('inpatientEMRData').then(data => {
      cy.get('[data-testid="Catatan Persalinan & Nifas"]').click();
      const item = data.obsgynAssessment.labor.laborNote;

      datePicker(`[data-testid="dateRecord 0"]`, item.date);
      cy.get(`[data-testid="timeRecord 0"]`).type(
        `${item.time[0]}:${item.time[1]}`,
      );
      cy.get(`[data-testid="helper 0"]`)
        .last()
        .click()
        .clear()
        .type(data.nurse)
        .wait(1000)
        .then(() => {
          cy.get('.v-list-item__content > .v-list-item__title')
            .contains(data.nurse)
            .wait(1000)
            .click({ force: true });
        });
      datePicker(`[data-testid="timeRecord 0"]`, item.date);
      cy.get(`[data-testid="birthTwoToFour 0"]`).type(item.birthTwoToFour);
      cy.get(`[data-testid="therapy 0"]`).type(item.therapy);
      cy.get('[data-testid="noteDate"]')
        .click()
        .then(() => {
          cy.get(
            '.menuable__content__active > .v-picker > .v-picker__body > :nth-child(1) > .v-date-picker-table > table > tbody ',
          )
            .contains(item.date)
            .first()
            .click({ force: true });
        });
      cy.get(`[data-testid="noteTime"]`).type(
        `${item.time[0]}:${item.time[1]}`,
      );
      cy.get(`[data-testid="postpartum"]`).type(item.therapypostpartum);
      cy.get('[data-testid="simpan"]').click();
    });
  });
});
