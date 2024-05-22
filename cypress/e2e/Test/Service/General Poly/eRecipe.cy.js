/// <reference types="cypress" />

import { createERecipeData } from '../../../../support/dataHelper';
import {
  chooseFromDropdown,
  loginUser,
  newPatientOutpatient,
} from '../../../../support/helpers';
const getStore = () => cy.window().its('app.$store');

describe('Test E-recipe', () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.viewport(1920, 1080);
    cy.visit('http://localhost:8080/'); // Visit apps
    loginUser();
  });

  it('Add outpatient registration', () => {
    createERecipeData();
    newPatientOutpatient('Poli Umum');
  });

  it('add non mix recipe', () => {
    toERecipe();

    cy.fixture('createERecipeData').then(data => {
      const item = data.drug;
      chooseFromDropdown('[data-testid="nonMixDrugName"]', item.name);
      cy.get('[data-testid="nonRacikQuantity"]').type(item.recipe.amount);
      if (item.recipe.manualUsage) {
        chooseFromDropdown('[data-testid="usageDay"]', item.recipe.usage);
        chooseFromDropdown('[data-testid="usage"]', item.recipe.usageDay);
      } else {
        cy.get('[data-testid="manualUsage"]').click({ force: true });
        cy.get('[data-testid="manualUsageInput"]').type(
          item.recipe.usageManualDay,
        );
        chooseFromDropdown(
          '[data-testid="manualPackage"]',
          item.recipe.usageManualPackaging,
        );
      }
      chooseFromDropdown('[data-testid="nonMixRoute"]', item.route);
      chooseFromDropdown('[data-testid="nonMixGeneralRule"]', item.generalRule);
      cy.get('[data-testid="nonMixDesc"]').type(item.otherRule);
    });
    cy.get('[data-testid="nonMixSave"]').click();
    cy.get('[data-testid="save"]').click();
    cy.get('#swal2-title').should($item => {
      expect($item[0].innerText).to.equal('Data E-Resep Berhasil Disimpan!');
    });
  });

  it('add mix recipe', () => {
    toERecipe();

    cy.get('[data-testid="racik"]').click({ force: true });

    cy.fixture('createERecipeData').then(item => {
      const data = item.drug;
      chooseFromDropdown('[data-testid="mixDrugName"]', data.name);
      cy.window()
        .its('app')
        .then(app => {
          switch (app.getters.userLoggedIn.config.pharmacy_mix_recipe_input) {
            case 'auto':
              cy.get(`'[data-testid="${data.mixRecipe.chip}"]'`).click();
              break;
            default:
              cy.get('[data-testid="mixRecipeAmount"]').type(
                data.mixRecipe.amount,
              );
              break;
          }
        });
      cy.get('[data-testid="addComponentDrug"]').click();
      cy.get('[data-testid="mixRecipeQuantity"]').type(data.mixRecipe.amount);
      chooseFromDropdown(
        '[data-testid="mixRecipePackaing"]',
        data.mixRecipe.packaging,
      );
      chooseFromDropdown(
        '[data-testid="mixRecipeUsageDay"]',
        data.mixRecipe.usage,
      );
      chooseFromDropdown(
        '[data-testid="mixRecipeUsage"]',
        data.mixRecipe.usageDay,
      );
      chooseFromDropdown('[data-testid="mixRecipeRoute"]', data.route);
      chooseFromDropdown(
        '[data-testid="mixRecipeGeneralRule"]',
        data.generalRule,
      );
      cy.get('[data-testid="mixDesc"]').type(data.otherRule);
    });
    cy.get('[data-testid="mixRecipeSave"]').click();
    cy.get('[data-testid="save"]').click();
    cy.get('#swal2-title').should($item => {
      expect($item[0].innerText).to.contain('Data E-Resep Berhasil Disimpan!');
    });
  });

  it('add medical tool', () => {
    toERecipe();

    cy.get('[data-testid="alkes"]').click({ force: true });

    cy.fixture('createERecipeData').then(data => {
      chooseFromDropdown('[data-testid="alkesName"]', data.medTool.name);
      cy.get('[data-testid="quantityMedTool"]').type(data.medTool.amount);
    });

    cy.get('[data-testid="addMedTools"]').click();
    cy.get('[data-testid="save"]').click();
    cy.get('#swal2-title').should($item => {
      expect($item[0].innerText).to.contain('Data E-Resep Berhasil Disimpan!');
    });
  });
});

function toERecipe() {
  cy.get('[data-testid="Parent Pelayanan"]').click();
  cy.get('[data-testid="Pelayanan Poli Umum"]').click();

  cy.fixture('outpatientRegisData').then(patient => {
    cy.get('[data-testid="search"]').type(patient.name);
    cy.get('tr').then(() => {
      cy.get('td')
        .contains(patient.name)
        .click();
    });
    cy.get('[data-testid="E-Resep"]')
      .first()
      .click();
  });
}
