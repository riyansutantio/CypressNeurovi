import { getRndInteger, noRmGenerator } from './helpers';

export const { faker } = require('@faker-js/faker');

const moment = require('moment');
const getUniqueId = () => Cypress._.uniqueId();
const uniqueId = getUniqueId();
const idRM = () => getRndInteger(1, 511);
const Sis = () => getRndInteger(40, 121);
const Dia = () => getRndInteger(30, 81);
const nad = () => getRndInteger(60, 101);
const Bb = () => getRndInteger(50, 81);
const Tb = () => getRndInteger(145, 201);
const Lp = () => getRndInteger(34, 41);
const Rr = () => getRndInteger(12, 21);
const Saturation = () => getRndInteger(90, 100);
const suhu = () => getRndInteger(30, 41);
const Kesadaran = ['Coma', 'Sopor', 'Somnolence', 'Compos Mentis'];
const yesterday = moment()
  .subtract(1, 'day')
  .format('DD');
const tomorrow = moment()
  .add(1, 'day')
  .format('DD');
const date = Date();
export const currentDate = moment().format('DD');

export function createPatientJson(data) {
  //generate file for outpatient
  const sex = getRndInteger(0, 2) < 0.5 ? 'male' : 'female';
  const statusList = ['Nyonya', 'Tuan', 'Nona', 'Saudara', 'Anak', 'Bayi'];
  const agamaList = ['Islam', 'Kristen', 'Budha', 'Hindu', 'Katolik'];
  const goldarList = ['A', 'B', 'O'];
  const PendidikanList = [
    'Tidak Sekolah',
    'TK',
    'SMP',
    'SMA',
    'Diploma I',
    'Diploma II',
  ];
  const StatusKawinList = ['Belum Kawin', 'Kawin', 'Duda', 'Janda'];
  const JenisJaminanList = ['Umum', 'Asuransi'];
  const asuransiList = [
    'ADMEDIKA',
    'DANA SEHAT AISYIYAH',
    'DANA SEHAT MUHAMMADIYAH',
    'JAMKESDA',
    'JAMPERSAL',
  ];
  const poliList = ['Poli Umum', 'Poli Gigi', 'Poli KIA'];
  const Dokter = 'Rahmat Budi Dermawan';
  const bpjsList = ['000382', '000327', '000383'];
  let today = new Date();
  let tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);
  const fakeDateOfBirth = faker.date.between('1950-01-01', '2022-12-31');
  const rm = idRM();
  const RM = noRmGenerator(rm);
  const listTypeInpatient = ['Neonatus', 'Bedah', 'Obsgyn', 'Anak'];
  const listTypeServiceInpatient = [
    'Preventif',
    'Kuratif',
    'Rehabilitatif',
    'Paliatif',
  ];

  const dataRegist = {
    noRm: RM,
    sistolik: Sis(),
    diastolik: Dia(),
    pulse: nad(),
    bb: Bb(),
    tb: Tb(),
    lp: Lp(),
    rr: Rr(),
    saturation: Saturation(),
    temperature: suhu(),
    ttv: getRndInteger(0, 2) < 0.3,
    anamnesis: 'Mual,Pusing',
    awareness: Kesadaran[getRndInteger(0, 4)],
    dateBirth: moment(fakeDateOfBirth).format('DDMMYYYY'),
    address: {
      street: faker.address.streetAddress(),
      city: faker.address.city(),
      state: faker.address.state(),
      zipcode: faker.address.zipCode(),
      country: faker.address.country(),
    },
    poly: data ? data : poliList[getRndInteger(0, 3)],
    doctor: Dokter,
    insurance: asuransiList[getRndInteger(0, 5)],
    insuranceNumer: faker.finance.creditCardNumber(),
    guaranteeType: JenisJaminanList[getRndInteger(0, 2)],
    martialStatus: StatusKawinList[getRndInteger(0, 4)],
    education: PendidikanList[getRndInteger(0, 6)],
    bloodType: goldarList[getRndInteger(0, 3)],
    religion: agamaList[getRndInteger(0, 5)],
    patientStatus: statusList[getRndInteger(0, 6)],
    isMale: getRndInteger(0, 2) < 0.5,
    name: faker.person.fullName({ sex: sex }),
    fatherName: faker.person.fullName({ sex: 'male' }),
    motherName: faker.person.fullName({ sex: 'female' }),
    bpjsNoRm: bpjsList[getRndInteger(0, 3)],
    bookingDate: tomorrow.toLocaleDateString('en-US', {
      day: 'numeric',
    }),
    yesterdayDate: yesterday,
    pasc: Cypress._.random(0, 3),
    triageAwareness: Cypress._.random(0, 3),
    pain: Cypress._.random(1, 10),
    itemLab: [
      'APTT',
      'HAV',
      'Albumin',
      'LDL Cholesterol',
      'HIV INPRES',
      'PP test',
    ],
    inpatientType: listTypeInpatient[Cypress._.random(0, 3)],
    serviceType: listTypeServiceInpatient[Cypress._.random(0, 3)],
  };
  cy.writeFile('cypress/fixtures/outpatientRegisData.json', dataRegist);
}
export function createAssessentData() {
  const anamnesis = ['Mual', 'Pusing'];
  const alergi = ['ikan', 'amoxicilin', 'debu'];
  const penyakit = ['Tifus', 'Demam berdarah'];
  const pengobatan = 'opname';
  const psikologi = ['Cemas', 'Takut', 'Marah', 'Sedih'];
  const sosial = 'aman';
  const spiritual = 'aman';
  const doctorAnamnesis = ['Mual', 'Pusing', 'capek'];
  const physicalTest = 'Hasil Pemeriksaan Normal';
  const other = 'Aman Normal';
  const mainDiagnose = 'K08.3';
  const secDiagnose = ['K08.3', 'N44'];
  const chronic = true;
  const returnStatusList = [
    'Berobat Jalan',
    'Meninggal',
    'Rujuk Vertikal',
    'Rujuk Horizontal',
    'Rawat Inap',
  ];
  const returnStatus = returnStatusList[getRndInteger(0, 5)];
  const actions = ['Rawat jalan', 'diskusi', 'konsultasi'];
  const icd9 = ['00.10', '00.03', '00.83'];
  const therapy = ['Paracetamol', 'Dexamethasone'];
  const deathCause = 'Retained placenta without haemorrhage';
  //data screening adult
  const unplanned = getRndInteger(1, 4);
  const unplannedAmount = getRndInteger(1, 5);
  const foodIntake = getRndInteger(0, 2) < 0.5;
  const seriousIllness = getRndInteger(0, 2) < 0.5;
  const fallHistory = getRndInteger(0, 2) < 0.5;
  const secondaryDiagnose = getRndInteger(0, 2) < 0.5;
  const walker = getRndInteger(1, 4);
  const walk = getRndInteger(1, 4);
  const heparin = getRndInteger(0, 2) < 0.5;
  const mentalStatus = getRndInteger(0, 2) < 0.5;
  //data screening child
  const isThin = getRndInteger(0, 2) < 0.5;
  const isLossWeight = getRndInteger(0, 2) < 0.5;
  const isHasCondition = getRndInteger(0, 2) < 0.5;
  const isMalnutrition = getRndInteger(0, 2) < 0.5;
  const diagnoseList = [
    'Diagnosis Neurologi',
    'Perubahan Okisgenasi',
    'Gangguan Perilaku/Psikiatri',
    'Diagnosis Lainnya',
  ];
  const diagnose = diagnoseList[getRndInteger(0, 4)];
  const cognitiveList = ['Tidak Menyadari ', 'Lupa Akan ', 'Orientasi '];
  const cognitive = cognitiveList[getRndInteger(0, 3)];
  const surgeryList = ['Dalam 24 Jam', 'Dalam 48 Jam', '>48 jam dan '];
  const surgery = surgeryList[getRndInteger(0, 3)];
  const medicamentosaList = [
    'Penggunaan Multiple ',
    'Penggunaan Obat Salah Satu di Atas',
    'Penggunaan Medikasi ',
  ];
  const medicamentosa = medicamentosaList[getRndInteger(0, 3)];

  const data = {
    nurse: {
      subjective: {
        anamnesis: anamnesis,
        alergy: alergi,
        illness: penyakit,
        treatment: pengobatan,
        psychology: psikologi,
        social: sosial,
        spiritual: spiritual,
      },
      objective: {
        sistolik: Sis(),
        diastolik: Dia(),
        pulse: nad(),
        bb: Bb(),
        tb: Tb(),
        lp: Lp(),
        rr: Rr(),
        saturation: Saturation(),
        temperature: suhu(),
        awareness: Kesadaran[getRndInteger(0, 4)],
      },
      screeningAdult: {
        unplanned: unplanned,
        unplannedAmount: unplannedAmount,
        foodIntake: foodIntake,
        seriousIllness: seriousIllness,
        fallHistory: fallHistory,
        secondaryDiagnose: secondaryDiagnose,
        walker: walker,
        heparin: heparin,
        walk: walk,
        mentalStatus: mentalStatus,
      },
      screeningChild: {
        isThin: isThin,
        isLossWeight: isLossWeight,
        isHasCondition: isHasCondition,
        isMalnutrition: isMalnutrition,
        diagnose: diagnose,
        cognitive: cognitive,
        surgery: surgery,
        medicamentosa: medicamentosa,
      },
    },
    doctor: {
      doctorAnamnesis: doctorAnamnesis,
      physical: physicalTest,
      other: other,
      assessment: {
        mainDiagnose: mainDiagnose,
        mainDiagnoseInfo: other,
        secDiagnose: secDiagnose,
        secDiagnoseInfo: physicalTest,
        chronic: chronic,
        returnStatus: returnStatus,
        deathCause: deathCause,
      },
      planning: {
        actions: actions,
        icd9: icd9,
        therapy: therapy,
      },
    },
  };
  cy.writeFile('cypress/fixtures/assessentData.json', data);
}
export function lettersData() {
  //data for outpatient warrant
  const returnStatus = getRndInteger(0, 2) < 0.5 ? 'Sembuh' : 'Belum Sembuh';
  const doctor = 'Ameera Syakira';
  const diagnose = ['K08.3', 'N44'];
  const therapies = ['Paracetamol', 'amoxicillin'];
  const suggestions = ['rawat jalan', 'kontrol dalam 5 hari'];
  //data for inpatient warrant
  const guarantorTypeList = ['Umum', 'BPJS', 'Asuransi'];
  const guarantorType = guarantorTypeList[getRndInteger(0, 3)];
  const caseTypeList = [
    'Bedah',
    'Non Bedah',
    'Trauma',
    'Non- trauma',
    'Obsgyn',
    'Interna',
    'Anak',
    'Syaraf',
    'Jantung',
  ];
  const caseType = caseTypeList[getRndInteger(0, 9)];
  const serviceTypeList = ['Preventif', 'Kuratif', 'Rehabilitatif', 'Paliatif'];
  const serviceType = serviceTypeList[getRndInteger(0, 4)];
  //data for hospital referral
  const isSpecialist = getRndInteger(0, 2) < 0.5 ? 'Spesialis' : 'khusus';
  const specialistList = [
    'Anak',
    'Anastesi',
    'Andrologi',
    'Btkv (bedah Thorax Kardiovaskuler)',
    'Gigi Bedah Mulut',
    'Bedah',
    'Bedah Plastik',
    'Bedah Saraf',
    'Bedah Anak',
    'Gigi',
    'Gigi Endodonsi',
    'Gizi Klinik',
    'Gigi Orthodonti',
    'Gigi Radiologi',
    'Penyakit Dalam',
    'Gigi Periodonti',
  ];
  const specialist = specialistList[getRndInteger(0, 16)];
  const specificList = [
    'Alih Rawat',
    'Sarana Radioterapi"',
    'Tb-mdr',
    'Hemodialisa',
    'Hemofili',
    'Sarana Kemoterapi',
    'Kusta',
    'Jiwa',
    'Thalasemia',
    'Hiv-odha',
    'Sarana Kemoterapi',
    'Hemofili',
  ];
  const specific = specificList[getRndInteger(0, 12)];
  const time = ['10', '20'];
  const disease = getRndInteger(0, 2) < 0.5 ? 'Menular' : 'Tidak Menular';
  const patientCondition = getRndInteger(0, 2) < 0.5 ? 'Sehat' : 'Sakit';
  const purpose = 'libur kantor';
  const data = {
    doctor: doctor,
    diagnose: diagnose,
    outpatientWarrant: {
      returnStatus: returnStatus,
      controlDate: tomorrow,
      therapies: therapies,
      suggestions: suggestions,
    },
    inpatientWarrant: {
      guarantorType: guarantorType,
      caseType: caseType,
      serviceType: serviceType,
    },
    hospitalReferral: {
      referralPurpose: isSpecialist,
      specialist: specialist,
      specific: specific,
      therapy: therapies[0],
      suggestions: suggestions[0],
    },
    deadLetter: {
      date: yesterday,
      time: time,
      disease: disease,
    },
    sickLetter: {
      endDate: tomorrow,
    },
    doctorLetter: {
      patientCondition: patientCondition,
      purpose: purpose,
      siastole: Sis(),
      diastole: Dia(),
      pulse: nad(),
      weight: Bb(),
      height: Tb(),
      respiration: Rr(),
    },
  };
  cy.writeFile('cypress/fixtures/lettersData.json', data);
}
export function createMasterDataPharmacy() {
  const uniqueSeed = moment().format('DD/MM/YYYY');
  const getUniqueId = () => Cypress._.uniqueId(uniqueSeed);
  const uniqueId = getUniqueId();
  const bar = () => getRndInteger(1, 1001);
  const barcode = bar();
  const kategorilist = [
    'Alat Fisioterapi',
    'Alat Kesehatan',
    'Bahan Baku Obat',
    'Bahan Radiologi',
    'BHP',
    'Embalase',
    'Gas Medis',
    'Obat',
    'Reagen Lab.',
  ];
  const kategori = kategorilist[getRndInteger(0, 9)];
  const Rak = () => getRndInteger(0, 1001);
  const rak = Rak();
  const sediaanlist = [
    'Concentrate',
    'Diskus',
    'dragee',
    'Drop',
    'Emulgel',
    'Emulsi',
    'Enema',
    'Enteric coated tablet',
    'Film coated caplet',
    'Film coated tablet',
    'Film coated talet',
    'Flex Pen',
    'Gel',
    'Infus',
  ];
  const sediaan = sediaanlist[getRndInteger(0, 14)];
  const pabriklist = [
    '3M',
    'ABBOTT',
    'ACCURATE',
    'ACON',
    'ACTAVIS',
    'ALKAPHARMA',
    'ALTECH',
    'AMBU',
    'Anios',
    'ANSWER',
    'AXIMED',
  ];
  const pabrikan = pabriklist[getRndInteger(0, 11)];
  const Min = () => getRndInteger(0, 31);
  const min = Min();
  const farmakolist = [
    '5 Alpha - Reductase Inhibitor',
    'Alpha Blocker',
    'Analgesik Narkotik',
    'Analgesik Non Narkotik',
    'Analgesik, Antipiretik, Antirematik, Antipirai',
    'Anestetik',
    'Anestetik Lokal',
    'Anestetik Umum',
    'Antasida dan Ulkus, Antibusa',
    'Antelmintik',
  ];
  const farmako = farmakolist[getRndInteger(0, 10)];
  const Kekuatan = () => getRndInteger(0, 401);
  const kekuatan = Kekuatan();
  const kekuatanUnit = ['%', 'Ampul', 'Batang', 'Biji', 'Blister', 'Botol'];
  const unit = kekuatanUnit[getRndInteger(0, 6)];
  const Hpp = () => getRndInteger(0, 500001);
  const hpp = Hpp();
  const Hna = () => getRndInteger(0, 500001);
  const hna = Hna();
  const carapakailist = [
    'Infus',
    'Injeksi',
    'Intraaurikuler',
    'Intrakutan',
    'Intramuskuler',
    'Intranasal',
    'Intraokuler',
  ];
  const carapakai = carapakailist[getRndInteger(0, 7)];
  const golonganlist = [
    'Bebas',
    'Bebas Terbatas',
    'Generik',
    'HV',
    'Keras',
    'non-group',
  ];
  const golongan = golonganlist[getRndInteger(0, 6)];
  const isGenerik = getRndInteger(0, 2) < 0.6;
  const isKatastropik = getRndInteger(0, 2) < 0.6;
  const isAktif = getRndInteger(0, 2) < 0.6;
  const isVen = getRndInteger(0, 2) < 0.6;
  const isFormulari = getRndInteger(0, 2) < 0.6;
  const isFornas = getRndInteger(0, 2) < 0.6;
  const isObatKeras = getRndInteger(0, 2) < 0.6;
  const isKemasan = getRndInteger(0, 2) < 0.6;
  const isPotent = getRndInteger(0, 2) < 0.6;
  const kemasanlist = ['%', 'Ampul', 'Batang', 'Biji', 'Box', 'Buah'];
  const kemasan = kemasanlist[getRndInteger(0, 6)];
  const Jumlah = () => getRndInteger(0, 21);
  const jumlah = Jumlah();
  const satuanlist = ['%', 'Ampul', 'Batang', 'Biji', 'Box', 'Buah'];
  const satuan = satuanlist[getRndInteger(0, 6)];
  const data = {
    name: `Automated${uniqueId}`,
    barcode: barcode,
    category: kategori,
    shelf: `Rak ${rak}`,
    preparation: sediaan,
    factory: pabrikan,
    pharmacotherapy: farmako,
    minStock: min,
    other: `Automated${uniqueId}`,
    strength: kekuatan,
    unit: unit,
    hpp: hpp,
    hna: hna,
    usage: carapakai,
    gol: golongan,
    isGeneric: isGenerik,
    isCatastropic: isKatastropik,
    isActive: isAktif,
    isVen: isVen,
    isFormulary: isFormulari,
    isFornas: isFornas,
    isHighAlertDrug: isObatKeras,
    isPackage: isKemasan,
    isPotent: isPotent,
    package: kemasan,
    amountPackage: jumlah,
    unitPackage: satuan,
  };
  cy.writeFile('cypress/fixtures/createMasterDataPharmacy.json', data);
}
export function createMasterDataGoods() {
  const moment = require('moment');
  const uniqueSeed = moment().format('DD/MM/YYYY');
  const getUniqueId = () => Cypress._.uniqueId(uniqueSeed);
  const uniqueId = getUniqueId();
  const bar = () => getRndInteger(1, 1001);
  const barcode = bar();
  const kategorilist = [
    'Alat Kebersihan',
    'Alat Listrik',
    'Alat Rumah Tangga',
    'Alat Tulis Kantor',
    'Bahan Habis Pakai',
    'Bahan Kebersihan',
    'Barang Cetakan',
    'Elektronik Komputer',
    'Kendaraan',
    'Lain-lain',
    'Linen',
    'Penunjang Alkes',
    'Peralatan Medis',
    'Perbekalan Rumah Tangga',
    'Perkantoran',
  ];
  const kategori = kategorilist[getRndInteger(0, 15)];
  const Hpp = () => getRndInteger(0, 50001);
  const hpp = Hpp();
  const Hna = () => getRndInteger(0, 50001);
  const hna = Hna();
  const pabriklist = [
    '14  KT',
    '3G KT',
    '3M',
    'ABBOTT',
    'ABC  KT',
    'ABN KT',
    'ACCURATE',
    'Acer  KT',
    'ACON',
    'ACT KT',
    'ACTAVIS',
  ];
  const pabrikan = pabriklist[getRndInteger(0, 11)];
  const Min = () => getRndInteger(0, 30);
  const min = Min();
  const isAktif = getRndInteger(0, 2) < 0.6; //if don't want to randomized ttv change this with true/false
  const isKemasan = getRndInteger(0, 2) < 0.4; //if don't want to randomized ttv change this with true/false
  const kemasanlist = ['%', 'Ampul', 'Batang', 'Biji', 'Botol', 'Buah'];
  const kemasan = kemasanlist[getRndInteger(0, 6)];
  const Jumlah = () => getRndInteger(1, 26);
  const jumlah = Jumlah();
  const satuanlist = ['%', 'Ampul', 'Batang', 'Biji', 'Botol', 'Buah'];
  const satuan = satuanlist[getRndInteger(0, 6)];
  const isSatuanTerkecil = getRndInteger(0, 2) < 0.6;
  const data = {
    name: `Automated${uniqueId}`,
    barcode: `Barcode${uniqueId}`,
    category: kategori,
    hpp: hpp,
    hna: hna,
    factory: pabrikan,
    minStok: min,
    isActive: isAktif,
    isPackage: isKemasan,
    package: kemasan,
    amount: jumlah,
    unit: satuan,
    isSmalestUnit: isSatuanTerkecil,
  };
  cy.writeFile('cypress/fixtures/createMasterDatagoods.json', data);
}
export function createMasterDataBed() {
  const edit = getRndInteger(0, 11);
  const isBroken = getRndInteger(0, 2) < 0.6;
  const data = {
    number: uniqueId,
    isBroken: isBroken,
    edit: edit,
  };
  cy.writeFile('cypress/fixtures/createMasterDataBed.json', data);
}
export function createMasterDataServiceData() {
  const code = '-' + getUniqueId();
  const unitList = [
    'Farmasi',
    'Farmasi IGD',
    'Farmasi Rawat Inap',
    'Farmasi Rawat Jalan',
    'Gudang',
    'IGD',
    'Laboratorium',
  ];
  const unit = unitList[getRndInteger(0, 7)];
  const category = 'Administrasi';
  const sublistadministrasi = [
    'Administrasi Pasien Baru',
    'Administrasi Ruang',
    'Administrasi Pasien Lama',
    'Pendaftaran Rawat Inap',
    'Laboratorium',
  ];
  const sub = sublistadministrasi[getRndInteger(0, 5)];
  const codeLis = getRndInteger(0, 1501);
  const penjaminlist = ['Umum', 'Asuransi', 'BPJS'];
  const penjamin = penjaminlist[getRndInteger(0, 3)];
  const jasaMedis = getRndInteger(5000, 100000);
  const beban = getRndInteger(5000, 100000);
  const margin = getRndInteger(5000, 100000);
  const alatList = [
    'ACTIMOVE CERVICAL COLLAR MEDIUM DENSITY - L',
    'ACTIMOVE CERVICAL COLLAR MEDIUM DENSITY - M',
    'ACTIMOVE CERVICAL COLLAR MEDIUM DENSITY - S',
    'AMP narrow no 41',
    'Abbocath / IV.Cath 16G',
    'Abbocath / IV.Cath 18G',
    'Abbocath / IV.Cath 18G Surflo',
    'Abbocath / IV.Cath 20G',
  ];
  const alatmedis = alatList[getRndInteger(0, 8)];
  const bahanlist = [
    'AV Fistulla',
    'Alkohol Antiseptik',
    'Anios Spesial DJP',
    'Aniosyme DD1',
    'Apron One',
    'Apron Plastik Tangan Panjang',
    'Aseptan Liquid',
    'Aseptanios HP-50',
  ];
  const bahanmedis = bahanlist[getRndInteger(0, 8)];
  const data = {
    code: 'Automated' + code,
    unit: unit,
    category: category,
    codeLis: codeLis,
    subAdministration: sub,
    warrant: penjamin,
    medicalServiceFee: jasaMedis,
    medicalTool: alatmedis,
    medicalMaterial: bahanmedis,
    charge: beban,
    margin: margin,
  };
  cy.writeFile('cypress/fixtures/createMasterDataServiceData.json', data);
}
export function createMasterDataStaff() {
  const nik = getRndInteger(0, 100000000000000);
  const gender = getRndInteger(0, 2) < 0.5; //if don't want to randomized ttv change this with true/false
  const accountNumber = getRndInteger(0, 100000000000000);
  const religionlist = [
    'Budha',
    'Hindu',
    'Islam',
    'Katolik',
    'Konghucu',
    'Kristen',
  ];
  const religion = religionlist[getRndInteger(0, 6)];
  const banklist = [
    'AMERICAN EXPRESS BANK LTD',
    'ANGLOMAS INTERNASIONAL BANK',
    'ANZ PANIN BANK',
    'BANK ABN AMRO',
    'BANK AGRO NIAGA',
    'BANK AKITA',
    'BANK ALFINDO',
  ];
  const goldarlist = ['AB', 'A Rh+', 'A Rh-', 'AB Rh+'];
  const bloodType = goldarlist[getRndInteger(0, 4)];
  const bank = banklist[getRndInteger(0, 6)];
  const str = getRndInteger(0, 10000);
  const sip = getRndInteger(0, 10000);
  const sik = getRndInteger(0, 10000);
  const spesialisList = [
    'Akupuntur Medik',
    'Anak',
    'Anestesiologi dan Terapi Intensif',
    'Bedah Anak',
    'Bedah Digestif',
    'Bedah Plastik, Rekonstruksi dan Estetik',
    'Bedah Saraf',
  ];
  const specialist = spesialisList[getRndInteger(0, 7)];
  const roleList = [
    'Ahli Gizi',
    'Analis Kesehatan',
    'Analis Laboratorium',
    'Apoteker',
    'Asisten Apoteker',
    'Bidan',
  ];
  const role = roleList[getRndInteger(0, 6)];
  const unitList = [
    'Pendaftaran Instalasi Gawat Darurat',
    'Poli KIA',
    'Gudang',
    'Poli Umum',
    'Poli Gigi',
  ];
  const unit = unitList[getRndInteger(0, 5)];
  const isActive = getRndInteger(0, 2) < 0.5;
  const data = {
    currentDate: currentDate,
    nip: 'Automated' + currentDate + uniqueId,
    name: 'Automated' + uniqueId,
    nik: nik,
    gender: gender,
    placeBirth: faker.location.country(),
    phoneNumber: faker.phone.number('+62 82 ### ## ##'),
    accountNumber: accountNumber,
    religion: religion,
    bank: bank,
    bloodType: bloodType,
    str: str,
    sip: sip,
    sik: sik,
    specialist: specialist,
    role: role,
    unit: unit,
    isActive: isActive,
  };
  cy.writeFile('cypress/fixtures/createMasterDataStaff.json', data);
}
export function createMasterDataLaboratory() {
  const name = faker.internet.domainWord();
  const codeLIS = faker.number.int(100);
  const parentServiceList = [
    'Pemeriksaan Hematologi',
    'Pemeriksaan Kimia Klinik',
    'Pemeriksaan Imuno - Serologi',
    'Pemeriksaan Urinalisa',
    'Pemeriksaan Faeces',
    'Pemeriksaan Elektrolit',
  ];
  const parentService = parentServiceList[getRndInteger(0, 6)];
  const unit = 'Laboratorium';
  const codeIHSList = ['ABO group', 'Platelet', 'Erythrocyte'];
  const codeIHS = codeIHSList[getRndInteger(0, 3)];
  const itemName = [faker.hacker.noun(), faker.hacker.noun()];
  const gender = getRndInteger(0, 3);
  const lowerLimit = getRndInteger(0, 51);
  const upperLimit = getRndInteger(50, 101);
  const limitType = ['Tahun', 'Bulan', 'Hari'];
  const normalValue = getRndInteger(0, 6);
  const method = 'Injeksi';

  const data = {
    service: {
      codeLIS: codeLIS,
      category: 'Laboratorium',
      parentService: parentService,
      margin: 10000,
    },
    name: name,
    unit: unit,
    laboratory: {
      codeIHS: codeIHS,
      itemName: itemName,
      gender: gender,
      lowerLimit: lowerLimit,
      upperLimit: upperLimit,
      limitType: limitType[getRndInteger(0, 3)],
      normalValue: normalValue,
      method: method,
    },
  };
  cy.writeFile('cypress/fixtures/createMasterDataLaboratory.json', data);
}
export function createERecipeData() {
  const chipList = ['1/8', '1/5', '1/4', '1/3', '1/2', '2/3'];
  const packagingList = ['Bungkus', 'Kapsul', 'Salep', 'Sirup'];
  const data = {
    drug: {
      name: 'QA',
      route: 'Per Oral',
      generalRule: 'Sebelum makan',
      otherRule: 'Dihabiskan',
      recipe: {
        amount: 5,
        manualUsage: getRndInteger(0, 2) < 0.5,
        usageManualDay: '1x3',
        usageManualPackaging: 'Bungkus',
        usageDay: 1,
        usage: 3,
      },
      mixRecipe: {
        amountDrug: 5,
        chip: chipList[getRndInteger(0, 6)],
        amount: 5,
        packaging: packagingList[getRndInteger(0, 4)],
        usageDay: 1,
        usage: 3,
      },
    },
    medTool: {
      name: 'Equispon',
      amount: 5,
    },
  };
  cy.writeFile('cypress/fixtures/createERecipeData.json', data);
}

export function inpatientEMRData() {
  const relationList = ['Ayah', 'Ibu', 'Saudara Kandung', 'Kakek', 'Nenek'];
  const entryMethodList = [
    'Jalan tanpa bantuan',
    'Jalan dengan bantuan',
    'Menggunakan kursi roda',
    'Menggunakan stretcher',
  ];
  const familyDiseaseList = [
    'Diabete',
    'Asthma',
    'Kanker',
    'Hipertensi',
    'Jantung',
  ];
  const painLikeList = ['Ditusuk', 'Dipukul', 'Berdenyut', 'Ditikam'];
  const painFactorList = ['Cahaya', 'Gelap', 'Gerakan', 'Berbaring'];
  const psychologyStatus = ['Cemas', 'Takut', 'Marah', 'Sedih'];
  const originPolyList = ['umum', 'igd', 'VK'];
  const sex = getRndInteger(0, 2) < 0.5 ? 'male' : 'female';
  const isFamilyDisease = getRndInteger(0, 2) < 0.5;
  const lorem = faker.lorem.sentence(5);
  const day = new Date();
  const minutes = day.getMinutes();
  const currentPregnancyList = [
    'Direncanakan',
    'Tidak Direncanakan',
    'Diterima',
    'Tidak Direncanakan dan Tidak Diterima',
  ];
  const martialHistoryStatusList = ['Kawin', 'Cerai Hidup', 'Cerai Mati'];
  const helperList = ['Bidan', 'Dokter', 'Dukun', 'Lain-Lain'];
  const placeList = ['Rumah', 'RS', 'BPS', 'Puskesmas', 'Lain-Lain'];
  const kbList = [
    'Suntik',
    'IUD',
    'Pil',
    'Kondom',
    'Kalender',
    'MOW',
    'MOP',
    'Implan',
  ];
  const genderList = ['Laki-laki', 'Perempuan', 'Tidak Ada'];
  const finishTypeNameList = [
    'Sembuh',
    'PAPS',
    'Merujuk',
    'Meninggal',
    'Lain-lain',
  ];
  const treatmentContinuedList = [
    'Poliklinik',
    'Rumah Sakit',
    'Puskesmas',
    'Lain-lain',
  ];
  const fetalPresentationList = [
    'Normal',
    'Shoulder/Transverse',
    'Face/Brow',
    'Breech (Complete)',
    'Breech (Flooting)',
    'Breech (Frank)',
  ];
  const timeout = new moment().add(1, 'hours').format('HH:mm');
  const data = {
    nurse: 'Perawat Ony',
    earlyAssessment: {
      initialAssessment: {
        arrivedDate: moment().format('D'),
        arrivedTime: [
          new Date().getHours(),
          minutes < 10 ? '0' + minutes : minutes,
        ],
        relation: relationList[Cypress._.random(0, 4)],
        clearName: faker.person.fullName({ sex: sex }),
        entryMethod: entryMethodList[Cypress._.random(0, 3)],
        originPoly: originPolyList[Cypress._.random(0, 2)],
      },
      anamnesa: {
        presentHealtyHistory: lorem,
        pastHealtyHistory: lorem,
        isFamilyDisease: isFamilyDisease,
        familyDisease: familyDiseaseList[Cypress._.random(0, 4)],
        treatmentHistory: lorem,
        psychologyStatus: psychologyStatus[Cypress._.random(0, 3)],
        allergyHistory: ['Qoim', 'Ikan Pari', 'Fakta'],
      },
      objectiveData: {
        sistolik: Sis(),
        diastolik: Dia(),
        pulse: nad(),
        bb: Bb(),
        tb: Tb(),
        lp: Lp(),
        rr: Rr(),
        saturation: Saturation(),
        temperature: suhu(),
        awareness: Kesadaran[getRndInteger(0, 4)],
      },
      painAssessment: {
        pain: Cypress._.random(1, 10),
        painFactor: painFactorList[Cypress._.random(0, 3)],
        painFrequency: Cypress._.random(0, 2),
        painDuration: Cypress._.random() < 0.5,
        painLike: painLikeList[Cypress._.random(0, 3)],
        painRadiation: Cypress._.random() < 0.5,
        severity: Cypress._.random(0, 3),
        desc: lorem,
      },
    },
    neonatusAssessment: {
      information: {
        motherName: noRmGenerator(idRM()),
        motherProfession: faker.person.jobTitle(),
        statusG: Cypress._.random(0, 10),
        statusP: Cypress._.random(0, 10),
        statusA: Cypress._.random(0, 10),
        fatherName: faker.person.fullName({ sex: 'male' }),
        fatherProfession: faker.person.jobTitle(),
        birthDate: moment().format('D'),
        birthTime: [
          new Date().getHours(),
          minutes < 10 ? '0' + minutes : minutes,
        ],
        bodyLenght: Cypress._.random(49, 60),
        birthType: Cypress._.random() < 0.5 ? 'Cesarean' : 'Normal',
        chestCircumference: Cypress._.random(30, 40),
        weight: Cypress._.random(2500, 4000),
        headCircumference: Cypress._.random(31, 37),
      },
      physical: {
        eyeInfection: Cypress._.random() < 0.5,
        mouthSuctionReflex: Cypress._.random() < 0.5,
        mouthCyanoticLips: Cypress._.random() < 0.5,
        mouthHareLips: Cypress._.random() < 0.5,
        mouthPalatosic: Cypress._.random() < 0.5,
        limbMovement: Cypress._.random() < 0.5,
        limbPolydactyly: Cypress._.random() < 0.5,
        limbSyndactytl: Cypress._.random() < 0.5,
        otherAbnormalities: lorem,
        isOtherAbnormalities: Cypress._.random() < 0.5,
        chestRespiratoryFrequencyCheck: Cypress._.random() < 0.5,
        chestHeartRateCheck: Cypress._.random() < 0.5,
        bellyUmbilical: Cypress._.random() < 0.5,
        bellyProtrusion: Cypress._.random() < 0.5,
        sexBoyScrotum: Cypress._.random() < 0.5,
        sexBoyTesticles: Cypress._.random() < 0.5,
        sexBoyPenisHole: Cypress._.random() < 0.5,
        sexGirlVaginaHole: Cypress._.random() < 0.5,
        sexGirlUretraHole: Cypress._.random() < 0.5,
        anusHole: Cypress._.random() < 0.5,
        abnormalities: lorem,
        notePostScript: lorem,
        NotesBuilInNote: lorem,
      },
      apgar: [
        ['Biru Putih', '0', 'Tidak Ada', 'Lemah', 'Tidak Ada'],
        ['Ujung-Ujung Putih', '< 100', 'Meringis', 'Sedang', 'Baik'],
        ['Merah Jambu', '> 100', 'Menangis', 'Baik', 'Baik'],
      ],
    },
    obsgynAssessment: {
      midwife: {
        socialandPeriod: {
          currentPregnancy: currentPregnancyList[Cypress._.random(0, 3)],
          currentPregnancyFeeling: lorem,
          martialHistory: {
            status: martialHistoryStatusList[Cypress._.random(0, 2)],
            age: Cypress._.random(20, 40),
            duration: Cypress._.random(0, 30),
            abortus: Cypress._.random(0, 10),
            husbanAge: Cypress._.random(20, 50),
            totalChildren: Cypress._.random(0, 5),
          },
          intensity: Cypress._.random() < 0.5,
          firstPeriod: Cypress._.random(0, 20),
          periodCycle: Cypress._.random(0, 3),
          periodAmount: Cypress._.random(0, 4),
          dysmenorrhea: Cypress._.random() < 0.5,
        },
        laborHistory: {
          hpht: moment().format('D'),
          firstFetalMovement: Cypress._.random(0, 15),
          totalFetalMovement: Cypress._.random(0, 10),
          complaints: lorem,
          ageYear: Cypress._.random(15, 50),
          ageMonth: Cypress._.random(1, 12),
          deadorAlive: Cypress._.random() < 0.5,
          bbl: Cypress._.random(0, 100),
          gender: genderList[Cypress._.random(0, 2)],
          complications: lorem,
          currentConditions: lorem,
          helper: helperList[Cypress._.random(0, 3)],
          helperDesc: faker.person.firstName(),
          place: placeList[Cypress._.random(0, 4)],
          placeDesc: faker.location.city,
        },
        kbHistory: {
          isKB: Cypress._.random() < 0.5,
          kb: kbList[Cypress._.random(0, 7)],
          familyDisease: lorem,
          surgeryDisease: lorem,
          dietBeforePregrant: lorem,
          dietAfterPregrant: lorem,
          isTT: Cypress._.random() < 0.5,
        },
        obstryHistory: {
          uterinePalpation: lorem,
          fundusUteriHeight: Cypress._.random(0, 10),
          place: lorem,
          fetalPresentation: fetalPresentationList[Cypress._.random(0, 5)],
          fetalWeightEstimation: Cypress._.random(0, 4000),
          isContraction: Cypress._.random() < 0.5,
        },
      },
      labor: {
        laborHistory: {
          diagnosa: lorem,
          date: moment().format('D'),
          time: [new Date().getHours(), minutes < 10 ? '0' + minutes : minutes],
          ageYear: Cypress._.random(15, 50),
          ageMonth: Cypress._.random(1, 12),
          deadorAlive: Cypress._.random() < 0.5,
          bbl: Cypress._.random(0, 100),
          complications: lorem,
          currentConditions: lorem,
          helper: helperList[Cypress._.random(0, 3)],
          helperDesc: lorem,
          place: placeList[Cypress._.random(0, 4)],
          placeDesc: lorem,
          gender: genderList[Cypress._.random(0, 2)],
        },
        kbHistory: {
          isKB: Cypress._.random() < 0.5,
          kb: kbList[Cypress._.random(0, 7)],
          isMenarche: Cypress._.random() < 0.5,
          complaints: lorem,
          periodCycle: Cypress._.random(0, 10),
          periodDuration: Cypress._.random(0, 10),
          hpht: moment().format('D'),
          uk: Cypress._.random(0, 10),
        },
        laborNote: {
          date: moment().format('D'),
          time: [new Date().getHours(), minutes < 10 ? '0' + minutes : minutes],
          birthTwoToFour: lorem,
          therapy: lorem,
          therapypostpartum: lorem,
        },
      },
    },
    CPPT: {
      subjective: {
        anamnesis: lorem,
      },
      objective: {
        sistolik: Sis(),
        diastolik: Dia(),
        heartRate: nad(),
        rr: Rr(),
        saturation: Saturation(),
        temperature: suhu(),
        gds: Cypress._.random(0, 100),
        objectiveData: lorem,
      },
      assessment: {
        diagnose: 'Ansietas',
        action: 'Ciptakan suasana terapeutik untuk menumbuhkan kepercayaan',
        note: lorem,
      },
      PPA: {
        instruction: lorem,
      },
    },
    medicalResume: {
      date: moment().format('D'),
      time: timeout,
      doctor: 'Rahmat Budi Dermawan',
      room: 'Mawar',
      lorem: lorem,
      icd10: 'N44',
      icd9: '99.99',
      finishTypeName: finishTypeNameList[Cypress._.random(0, 4)],
      treatmentContinued: treatmentContinuedList[Cypress._.random(0, 3)],
    },
    informedConsent: {
      doctor: 'drg. Dudy',
      staffInformation: 'drg. Dudy',
      staffExecutor: 'drg. Dudy',
      informationReceiver: 'Pembaca',
      diagnose: 'K01.0',
      lorem: lorem,
      isWali: Cypress._.random() < 0.5,
      action: 'Pemeriksaan Dokter Gigi',
      wali: 'Pembaca',
      signerAs: 'Ibu',
      signerAge: Cypress._.random(20, 100),
      familyName: faker.person.firstName(),
      familyAs: 'Ibu',
      staffCompanion: 'drg. Dudy',
      patientAgreement: Cypress._.random() < 0.5,
      baseDiagnose: lorem,
      actionIndication: lorem,
      actionRisk: lorem,
      procedure: lorem,
      purpose: lorem,
      complication: lorem,
      prognosis: lorem,
      altRisk: lorem,
      cost: lorem,
      others: lorem,
    },
  };
  cy.writeFile('cypress/fixtures/inpatientEMRData.json', data);
}

export const physicalList = [
  {
    label: 'Kepala',
    value: 'head',
  },
  {
    label: 'Punggung',
    value: 'back',
  },
  {
    label: 'Mata',
    value: 'eye',
  },
  {
    label: 'Perut',
    value: 'stomach',
  },
  {
    label: 'Telinga',
    value: 'ear',
  },
  {
    label: 'Genitalia',
    value: 'genitalia',
  },
  {
    label: 'Hidung',
    value: 'nose',
  },
  {
    label: 'Anus/Dubur',
    value: 'anus',
  },
  {
    label: 'Mulut',
    value: 'mouth',
  },
  {
    label: 'Lengan Atas',
    value: 'upperArm',
  },
  {
    label: 'Leher',
    value: 'neck',
  },
  {
    label: 'Lengan Bawah',
    value: 'forearm',
  },
  {
    label: 'Rambut',
    value: 'hair',
  },
  {
    label: 'Jari Tangan',
    value: 'fingers',
  },
  {
    label: 'Bibir',
    value: 'lips',
  },
  {
    label: 'Kuku Tangan',
    value: 'handNail',
  },
  {
    label: 'Gigi Geligi',
    value: 'teeth',
  },
  {
    label: 'Persendian Tangan',
    value: 'handJoints',
  },
  {
    label: 'Lidah',
    value: 'tongue',
  },
  {
    label: 'Tungkai Atas',
    value: 'upperLimbs',
  },
  {
    label: 'Langit-langit',
    value: 'palate',
  },
  {
    label: 'Tungkai Bawah',
    value: 'lowerLimbs',
  },
  {
    label: 'Tenggorokan',
    value: 'throat',
  },
  {
    label: 'Jari Kaki',
    value: 'toes',
  },
  {
    label: 'Tonsil',
    value: 'tonsil',
  },
  {
    label: 'Kuku Kaki',
    value: 'toeNails',
  },
  {
    label: 'Dada',
    value: 'breast',
  },
  {
    label: 'Persendian Kaki',
    value: 'legJoints',
  },
  {
    label: 'Payudara',
    value: 'breasts',
  },
];
