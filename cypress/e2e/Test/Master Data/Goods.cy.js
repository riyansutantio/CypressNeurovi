/* eslint-disable no-undef */
/// <reference types="cypress" />
import { createMasterDataGoods } from '../../../support/dataHelper';
import {
  chooseFromDropdown,
  lastDropdown,
  loginUser,
} from '../../../support/helpers';
describe('Master Data Goods', () => {
  beforeEach(() => {
    cy.viewport(1920, 1080);
    cy.visit('http://localhost:8080/'); // Visit apps

    loginUser();
    //klik master data
    cy.get('[data-testid="Parent Master Data"]').click();
    //klik barang rumah tangga
    cy.get('[data-testid="Master Data Barang Rumah Tangga"]').click();
  });

  it('Input new data goods', () => {
    createMasterDataGoods();
    cy.fixture('createMasterDatagoods').then(data => {
      //klik button +
      cy.get('[data-testid="tambah"]').click();
      //input nama barang
      cy.get('[data-testid="name"]').type(data.name);
      //input barcode
      cy.get('[data-testid="barcode"]').type(data.barcode);
      //pilih kategori
      chooseFromDropdown('[data-testid="category"]', data.category);
      //input hpp
      cy.get('#hpp').type(data.hpp);
      //input hna
      cy.get('#hna').type(data.hna);
      //pilih pabrik
      chooseFromDropdown('[data-testid="factory"]', data.factory);
      //menambahkan minimal stok
      cy.get('[data-testid="minStock"]').type(data.minStok);
      //konfirmasi barang aktif/tidak
      data.isActive ??
        cy.get('[data-testid="isActive"]').click({ force: true });
      //jika isKemasan true maka alur menambahkan kemasan akan aktif
      if (data.isPackage) {
        //menakan tombol tambahkemasan jika isKemasan = true
        cy.get('[data-testid="addPackaging"]').click();
        //menambahkan kemasan
        chooseFromDropdown('[data-testid="package"]', data.package);
        //menambahkan jumlah dalam kemasan'
        cy.get('[data-testid="quantity"]').type(data.amount);
        //menambahkan satuan jumlah dalam kemasan
        chooseFromDropdown('[data-testid="packageUnit"]', data.unit);
        //membuat kemasan menjadi satuan terkecil
        cy.get('[data-testid="isDefault"]').click({ force: true });
        //menyimpan kemasan
        cy.get('[data-testid="save"]').click({ force: true });
      }
    });
    //menyimpan data barang rumah tangga
    cy.get('[data-testid="simpan"]').click();
  });

  it('Edit new data goods', () => {
    cy.fixture('createMasterDatagoods').then(data => {
      //mencari data baru yang baru saja ditambahkan
      cy.get('[data-testid="search"]').type(data.name);
      //menekan data yang muncul
      cy.contains(data.name).click();
      //mencoba mengubah status aktif barang
      cy.get('[data-testid="aktif"]').click({ force: true });
      cy.get('.swal2-confirm').click();
      //menekan data yang muncul
      cy.contains(data.name).click();
      //menekan tombol edit
      cy.get('[data-testid="ubah"]').click();
      //Menambahkan kata edited pada nama barang
      cy.get('[data-testid="name"]').type(' Edited');
      //input barcode
      cy.get('[data-testid="barcode"]').type(' Edited');
      //pilih kategori
      chooseFromDropdown('[data-testid="category"]', data.category);
      //input hpp
      cy.get('#hpp').type('1');
      //input hna
      cy.get('#hna').type('1');
      //pilih pabrik
      chooseFromDropdown('[data-testid="factory"]', data.factory);
      //menambahkan minimal stok
      cy.get('[data-testid="minStock"]').type('0');
      //konfirmasi barang aktif/tidak
      cy.get('[data-testid="isActive"]').click({ force: true });
      //jika isKemasan true maka alur menambahkan kemasan akan aktif
      if (data.isPackage) {
        //menakan tombol tambahkemasan jika isKemasan = true
        cy.get('[data-testid="addPackaging"]').click();
        //menambahkan kemasan
        chooseFromDropdown('[data-testid="package"]', data.package);
        //menambahkan jumlah dalam kemasan
        cy.get('[data-testid="quantity"]').type(data.amount);
        //menambahkan satuan jumlah dalam kemasan
        chooseFromDropdown('[data-testid="packageUnit"]', data.unit);
        //membuat kemasan menjadi satuan terkecil
        cy.get('[data-testid="isDefault"]').click({ force: true });
        //menyimpan kemasan
        cy.get('[data-testid="save"]').click();
      }
    });
    //menyimpan data barang rumah tangga
    cy.get('[data-testid="simpan"]').click();
  });

  it('Delete new data goods', () => {
    cy.fixture('createMasterDatagoods').then(data => {
      //mencari data baru yang baru saja ditambahkan
      cy.get('[data-testid="search"]').type(data.name);
      //menekan data yang muncul
      cy.contains(data.name).click();
      //menekan ikon delete
      cy.get('[data-testid="hapus"]').click();
      //menekan ya
      cy.get('.swal2-confirm').click();
    });
  });
});
