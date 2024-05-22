/* eslint-disable no-undef */
/// <reference types="cypress" />

import { createMasterDataLaboratory } from '../../../support/dataHelper';
import {
  loginUser,
  chooseFromDropdown,
  lastDropdown,
} from '../../../support/helpers';

describe('Master Data Laboratory', () => {
  beforeEach(() => {
    cy.viewport(1920, 1080);
    cy.visit('http://localhost:8080/'); // Visit apps

    loginUser();
  });

  it('Input new service for lab', () => {
    createMasterDataLaboratory();
    //klik master data
    cy.get('[data-testid="Parent Master Data"]').click();
    //klik layanan
    cy.get('[data-testid="Master Data Layanan"]').click();

    cy.get('[data-testid="tambah"]').click();

    cy.fixture('createMasterDataLaboratory').then(data => {
      cy.get('[data-testid="nama"]').type(data.name);
      lastDropdown('[data-testid="kategori"]', data.service.category);
      cy.get('[data-testid="lis"]').type(data.service.codeLIS);
      chooseFromDropdown('[data-testid="layanan"]', data.service.parentService);
      lastDropdown('[data-testid="unit"]', data.unit);
      cy.get('[data-testid="margin-0"]')
        .first()
        .type(data.service.margin);
      cy.get('[data-testid="simpan"]').click();
    });
  });

  it('Input new data laboratory', () => {
    //klik master data
    cy.get('[data-testid="Parent Master Data"]').click();
    //klik layanan
    cy.get('[data-testid="Master Data Laboratorium"]').click();

    cy.fixture('createMasterDataLaboratory').then(data => {
      cy.intercept('http://localhost:4000/master/service/laboratory').as(
        'getInspectionName',
      );
      //klik button +
      cy.get('[data-testid="add"]')
        .click()
        .wait('@getInspectionName');
      chooseFromDropdown('[data-testid="name"]', data.name);
      chooseFromDropdown('[data-testid="ihscode"]', data.laboratory.codeIHS);

      //Input item
      const itemName = data.laboratory.itemName;
      for (let i in itemName) {
        cy.get('[data-testid="itemName"]').type(itemName[i]);
        switch (data.laboratory.gender) {
          case 0:
            cy.get('[data-testid="gender0"]').click({ force: true });
            break;
          case 1:
            cy.get('[data-testid="gender1"]').click({ force: true });
            break;
          case 2:
            cy.get('[data-testid="gender2"]').click({ force: true });
            break;
        }
        cy.get('[data-testid="lowerAgeLimit"]').type(
          data.laboratory.lowerLimit,
        );
        cy.get('[data-testid="upperAgeLimit"]').type(
          data.laboratory.upperLimit,
        );
        chooseFromDropdown('[data-testid="age"]', data.laboratory.limitType);
        cy.get('[data-testid="unit"]').type(data.unit);
        cy.get('[data-testid="normalValue"]').type(data.laboratory.normalValue);
        cy.get('[data-testid="method"]').type(data.laboratory.method);
        cy.get('[data-testid="add"]')
          .last()
          .click();
      }
      cy.get('[data-testid="save change"]').click();
    });
  });

  it('Edit laboratory data', () => {
    //klik master data
    cy.get('[data-testid="Parent Master Data"]').click();
    //klik layanan
    cy.get('[data-testid="Master Data Laboratorium"]').click();

    cy.fixture('createMasterDataLaboratory').then(data => {
      cy.get('[data-testid="search"]').type(data.name);
      cy.wait(1000);
      cy.get('[data-testid="active 1"]').click({ force: true });
      cy.get('[data-testid="detail 1"]').click();
      chooseFromDropdown('[data-testid="ihscode"]', 'Rh ');
      //edit item lab
      cy.get('[data-testid="edit 1"]')
        .click()
        .then(() => {
          cy.get('[data-testid="itemName"]').type('Edited');
          cy.get('[data-testid="lowerAgeLimit"]').type(1);
          cy.get('[data-testid="upperAgeLimit"]').type(1);
          cy.get('[data-testid="unit"]').type('Edited');
          cy.get('[data-testid="normalValue"]').type(1);
          cy.get('[data-testid="method"]').type('Edited');
        });
      cy.get('[data-testid="save"]').click();
    });
    cy.get('[data-testid="save change"]').click();
  });

  it('Delete laboratory data', () => {
    //klik master data
    cy.get('[data-testid="Parent Master Data"]').click();
    //klik layanan
    cy.get('[data-testid="Master Data Laboratorium"]').click();

    cy.fixture('createMasterDataLaboratory').then(data => {
      cy.get('[data-testid="search"]').type(data.name);
      cy.wait(1000);
      cy.get('[data-testid="delete 1"]').click();
    });
    cy.get('.swal2-confirm').click();
  });
});
