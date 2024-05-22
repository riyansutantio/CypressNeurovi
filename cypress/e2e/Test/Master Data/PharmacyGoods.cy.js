/* eslint-disable no-undef */
/// <reference types="cypress" />

import { createMasterDataPharmacy } from '../../../support/dataHelper';
import {
  chooseFromDropdown,
  dropdownVlist,
  lastDropdown,
  loginUser,
} from '../../../support/helpers';

describe('Master data barang farmasi', () => {
  beforeEach(() => {
    cy.viewport(1920, 1080);
    cy.visit('http://localhost:8080/'); // Visit apps

    loginUser();
    //klik master data
    cy.get('[data-testid="Parent Master Data"]').click();
    //klik barang farmasi
    cy.get('[data-testid="Master Data Barang Farmasi"]').click();
  });
  it('Input new pharmacy goods', () => {
    createMasterDataPharmacy();
    //klik tombol +
    cy.get('[data-testid="tambah"]').click();
    cy.fixture('createMasterDataPharmacy').then(data => {
      //isi nama barang
      cy.get('[data-testid="nama"]').type(data.name);
      //isi barcode
      cy.get('[data-testid="barcode"]').type(data.barcode);
      //pilih kategori
      chooseFromDropdown('[data-testid="kategori"]', data.category);
      //isi rak
      cy.get('[data-testid="rak"]').type(data.shelf);
      //pilih sediaan
      chooseFromDropdown('[data-testid="sediaan"]', data.preparation);
      //pilih pabrik
      dropdownVlist('[data-testid="pabrik"]', data.factory);
      //pilih farmako terapi
      lastDropdown('[data-testid="farmakoterapi"]', data.pharmacotherapy);
      //min stok
      cy.get('[data-testid="minstok"]').type(data.minStock);
      //input indikasi
      cy.get('[data-testid="indikasi"]').type(data.other);
      //input efeksamping
      cy.get('[data-testid="efeksamping"]').type(data.other);
      //input kekuatan
      cy.get('[data-testid="kekuatan"]').type(data.strength);
      //pilih kekuatan unit
      chooseFromDropdown('[data-testid="unit"]', data.unit);
      //input hpp
      cy.get('#hpp').type(data.hpp);
      //input hna
      cy.get('#hna').type(data.hna);
      //input cara pakai
      chooseFromDropdown('[data-testid="carapakai"]', data.usage);
      //input golongan
      chooseFromDropdown('[data-testid="golongan"]', data.gol);
      //input kontraindikasi
      cy.get('[data-testid="kontraindikasi"]').type(data.other);
      //input bahanbaku
      cy.get('[data-testid="bahanbaku"]').type(data.other);
      //Generik?
      data.isGeneric
        ? cy.get('[data-testid="generic"]').click({ force: true })
        : cy.get('[data-testid="!generic"]').click({ force: true });
      //katastropik?
      data.isCatastropic
        ? cy.get('[data-testid="catastrophic"]').click({ force: true })
        : cy.get('[data-testid="!catastrophic"]').click({ force: true });
      //Aktif?
      data.isActive
        ? cy.get('[data-testid="active"]').click({ force: true })
        : cy.get('[data-testid="!active"]').click({ force: true });
      //Obat Keras?
      data.isHighAlertDrug
        ? cy.get('[data-testid="highalert"]').click({ force: true })
        : cy.get('[data-testid="!highalert"]').click({ force: true });
      //VEN?
      data.isVen
        ? cy.get('[data-testid="ven"]').click({ force: true })
        : cy.get('[data-testid="!ven"]').click({ force: true });
      //Formulari?
      data.isFormulary
        ? cy.get('[data-testid="formulary"]').click({ force: true })
        : cy.get('[data-testid="!formulary"]').click({ force: true });
      //Fornas?
      data.isFornas
        ? cy.get('[data-testid="fornas"]').click({ force: true })
        : cy.get('[data-testid="!fornas"]').click({ force: true });
      //Potent?
      data.isPotent
        ? cy.get('[data-testid="potent"]').click({ force: true })
        : cy.get('[data-testid="!potent"]').click({ force: true });
      //-----------TAMBAH KEMASAN------------//
      lastDropdown('[data-testid="package"]', data.package);
      if (data.isPackage) {
        //menakan tombol tambahkemasan jika isKemasan = true
        cy.get('[data-testid="add package"]').click();
        //menambahkan kemasan
        lastDropdown('[data-testid="kemasan0"]', data.package);
        //menambahkan jumlah dalam kemasan
        cy.get('[data-testid="jumlah0"]').type(data.amountPackage);
        //menambahkan satuan jumlah dalam kemasan
        lastDropdown('[data-testid="satuan0"]', data.unitPackage);
      }
    });
    //--------------------------SIMPAN BARANG FARMASI---------------------//
    cy.get('[data-testid="simpan"]').click();
  });

  it('Edit new pharmacy goods', () => {
    cy.fixture('createMasterDataPharmacy').then(data => {
      //mencari data farmasi yang baru
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
      cy.get('[data-testid="nama"]').type(' Edited');
      //isi barcode
      cy.get('[data-testid="barcode"]').type(' Edited');
      //pilih kategori
      chooseFromDropdown('[data-testid="kategori"]', data.category);
      //isi rak
      cy.get('[data-testid="rak"]').type(' Edited');
      //pilih sediaan
      chooseFromDropdown('[data-testid="sediaan"]', data.preparation);
      //pilih pabrik
      dropdownVlist('[data-testid="pabrik"]', data.factory);
      //pilih farmako terapi
      lastDropdown('[data-testid="farmakoterapi"]', data.pharmacotherapy);
      //min stok
      cy.get('[data-testid="minstok"]').type(data.minStock);
      //input indikasi
      cy.get('[data-testid="indikasi"]').type(' Edited');
      //input efeksamping
      cy.get('[data-testid="efeksamping"]').type(' Edited');
      //input kekuatan
      cy.get('[data-testid="kekuatan"]').type(data.strength);
      //pilih kekuatan unit
      chooseFromDropdown('[data-testid="unit"]', data.unit);
      //input hpp
      cy.get('#hpp').type('1');
      //input hna
      cy.get('#hna').type('1');
      //input cara pakai
      chooseFromDropdown('[data-testid="carapakai"]', data.usage);
      //input golongan
      chooseFromDropdown('[data-testid="golongan"]', data.gol);
      //input kontraindikasi
      cy.get('[data-testid="kontraindikasi"]').type(' Edited');
      //input bahanbaku
      cy.get('[data-testid="bahanbaku"]').type(' Edited');
      //Generik?
      !data.isGeneric
        ? cy.get('[data-testid="generic"]').click({ force: true })
        : cy.get('[data-testid="!generic"]').click({ force: true });
      //katastropik?
      !data.isCatastropic
        ? cy.get('[data-testid="catastrophic"]').click({ force: true })
        : cy.get('[data-testid="!catastrophic"]').click({ force: true });
      //Aktif?
      !data.isActive
        ? cy.get('[data-testid="active"]').click({ force: true })
        : cy.get('[data-testid="!active"]').click({ force: true });
      //Obat Keras?
      !data.isHighAlertDrug
        ? cy.get('[data-testid="highalert"]').click({ force: true })
        : cy.get('[data-testid="!highalert"]').click({ force: true });
      //VEN?
      !data.isVen
        ? cy.get('[data-testid="ven"]').click({ force: true })
        : cy.get('[data-testid="!ven"]').click({ force: true });
      //Formulari?
      !data.isFormulary
        ? cy.get('[data-testid="formulary"]').click({ force: true })
        : cy.get('[data-testid="!formulary"]').click({ force: true });
      //Fornas?
      !data.isFornas
        ? cy.get('[data-testid="fornas"]').click({ force: true })
        : cy.get('[data-testid="!fornas"]').click({ force: true });
      //Potent?
      !data.isPotent
        ? cy.get('[data-testid="potent"]').click({ force: true })
        : cy.get('[data-testid="!potent"]').click({ force: true });
      //-----------TAMBAH KEMASAN------------//
      lastDropdown('[data-testid="package"]', data.package);
      if (data.isPackage) {
        //menakan tombol tambahkemasan jika isKemasan = true
        cy.get('[data-testid="tambah pacakage0"]').click();
        //menambahkan kemasan
        lastDropdown('[data-testid="kemasan1"]', data.package);
        //menambahkan jumlah dalam kemasan
        cy.get('[data-testid="jumlah1"]').type(data.amountPackage);
        //menambahkan satuan jumlah dalam kemasan
        lastDropdown('[data-testid="satuan1"]', data.unitPackage);
      }
      //--------------------------SIMPAN BARANG FARMASI---------------------//
      cy.get('[data-testid="simpan"]').click();
    });
  });

  it('Delete new pharmacy goods', () => {
    //mencari data baru yang baru saja ditambahkan
    cy.fixture('createMasterDataPharmacy').then(data => {
      //mencari data farmasi yang baru
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
