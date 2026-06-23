import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const companies = [
  {
    raisonSociale: "OCP SA", nomCommercial: "OCP", ice: "001234567000001",
    rc: "40637", if_: "01234567", cnss: "1000001",
    dateCreation: new Date("1920-01-01"), secteurActivite: "Mines & Chimie",
    activitePrincipale: "Extraction et valorisation de phosphate",
    detailActivite: "Production d'acide phosphorique, d'engrais et de produits chimiques",
    formeJuridique: "SA", tailleEntreprise: "Grande", chiffreAffaires: 95000000000,
    groupe: "OCP Group", ville: "Casablanca", region: "Casablanca-Settat",
    adressePrincipale: "2 rue Al Abtal, Hay Erraha, Casablanca 20220",
    telephonePrincipal: "+212 5 22 23 10 00", emailPrincipal: "contact@ocpgroup.ma",
    siteWeb: "www.ocpgroup.ma", qualityScore: 96, contratsActifs: 5,
    sourceData: "Telecontact DB", statutVerification: "Vérifié",
    derniereMiseAJour: new Date(), contacts: { create: [
      { nom: "Mostafa Terrab", prenom: "Mostafa", fonction: "Président Directeur Général", type: "dirigeant", telephone: "+212 5 22 23 11 00", email: "m.terrab@ocpgroup.ma", isPrincipal: true },
      { nom: "Hafid El Idrissi", prenom: "Hafid", fonction: "Directeur Financier", type: "financier", telephone: "+212 5 22 23 12 00", email: "h.elidrissi@ocpgroup.ma" },
    ]},
    alerts: { create: [{ type: "DIRECTOR_CHANGE", message: "Nouveau membre au conseil d'administration", oldValue: "Mohamed Benchaaboun", newValue: "Nadia Fettah Alaoui", isRead: false }] },
  },
  {
    raisonSociale: "Maroc Telecom", nomCommercial: "IAM", ice: "001234567000002",
    rc: "46343", if_: "02345678", cnss: "1000002",
    dateCreation: new Date("1998-02-26"), secteurActivite: "Télécommunications",
    activitePrincipale: "Opérateur de télécommunications",
    detailActivite: "Services de téléphonie fixe, mobile, internet et cloud",
    formeJuridique: "SA", tailleEntreprise: "Grande", chiffreAffaires: 36000000000,
    groupe: "Etisalat Group", ville: "Rabat", region: "Rabat-Salé-Kénitra",
    adressePrincipale: "Avenue Annakhil, Hay Riad, Rabat 10000",
    telephonePrincipal: "+212 5 37 71 90 00", emailPrincipal: "contact@iam.ma",
    siteWeb: "www.iam.ma", qualityScore: 94, contratsActifs: 8,
    sourceData: "Telecontact DB", statutVerification: "Vérifié", derniereMiseAJour: new Date(),
    contacts: { create: [
      { nom: "Abdeslam Ahizoune", prenom: "Abdeslam", fonction: "Président du Directoire", type: "dirigeant", telephone: "+212 5 37 71 91 00", email: "a.ahizoune@iam.ma", isPrincipal: true },
    ]},
  },
  {
    raisonSociale: "Attijariwafa Bank", nomCommercial: "AWB", ice: "001234567000003",
    rc: "333", if_: "03456789", cnss: "1000003",
    dateCreation: new Date("1904-01-01"), secteurActivite: "Finance & Bancaire",
    activitePrincipale: "Banque commerciale et d'investissement",
    detailActivite: "Services bancaires, assurance, immobilier et parabancaire",
    formeJuridique: "SA", tailleEntreprise: "Grande", chiffreAffaires: 22000000000,
    groupe: "SNI - Al Mada", ville: "Casablanca", region: "Casablanca-Settat",
    adressePrincipale: "2 Boulevard Moulay Youssef, Casablanca 20000",
    telephonePrincipal: "+212 5 22 22 87 00", emailPrincipal: "contact@attijariwafa.com",
    siteWeb: "www.attijariwafabank.com", qualityScore: 97, contratsActifs: 12,
    sourceData: "Telecontact DB", statutVerification: "Vérifié", derniereMiseAJour: new Date(),
    contacts: { create: [
      { nom: "Mohamed El Kettani", prenom: "Mohamed", fonction: "PDG", type: "dirigeant", telephone: "+212 5 22 22 88 00", email: "m.elkettani@attijariwafa.com", isPrincipal: true },
      { nom: "Omar Bounjou", prenom: "Omar", fonction: "DGA", type: "dirigeant", telephone: "+212 5 22 22 89 00", email: "o.bounjou@attijariwafa.com" },
    ]},
    alerts: { create: [{ type: "LEGAL_STATUS_CHANGE", message: "Augmentation de capital social", oldValue: "20,364,300,000 MAD", newValue: "21,000,000,000 MAD", isRead: false }] },
  },
  {
    raisonSociale: "BMCE Bank of Africa", nomCommercial: "BOA", ice: "001234567000004",
    rc: "27129", if_: "04567890", cnss: "1000004",
    dateCreation: new Date("1959-07-01"), secteurActivite: "Finance & Bancaire",
    activitePrincipale: "Banque universelle",
    formeJuridique: "SA", tailleEntreprise: "Grande", chiffreAffaires: 14000000000,
    groupe: "Finance.com", ville: "Casablanca", region: "Casablanca-Settat",
    adressePrincipale: "140 Avenue Hassan II, Casablanca 20000",
    telephonePrincipal: "+212 5 22 20 04 52", emailPrincipal: "contact@bmcebank.ma",
    siteWeb: "www.bmcebank.ma", qualityScore: 89, contratsActifs: 7,
    sourceData: "Telecontact DB", statutVerification: "Vérifié", derniereMiseAJour: new Date(),
    contacts: { create: [
      { nom: "Othman Benjelloun", prenom: "Othman", fonction: "PDG", type: "dirigeant", telephone: "+212 5 22 20 05 00", email: "o.benjelloun@bmcebank.ma", isPrincipal: true },
    ]},
  },
  {
    raisonSociale: "Banque Populaire du Maroc", nomCommercial: "BP Maroc", ice: "001234567000005",
    rc: "1316", if_: "05678901", cnss: "1000005",
    dateCreation: new Date("1926-05-25"), secteurActivite: "Finance & Bancaire",
    activitePrincipale: "Banque coopérative et mutualiste",
    formeJuridique: "SA", tailleEntreprise: "Grande", chiffreAffaires: 18000000000,
    ville: "Casablanca", region: "Casablanca-Settat",
    adressePrincipale: "101 Boulevard Mohamed Zerktouni, Casablanca 20100",
    telephonePrincipal: "+212 5 22 20 25 00", emailPrincipal: "contact@gbp.ma",
    siteWeb: "www.gbp.ma", qualityScore: 91, contratsActifs: 9,
    sourceData: "Telecontact DB", statutVerification: "Vérifié", derniereMiseAJour: new Date(),
    contacts: { create: [
      { nom: "Mohamed Karim Mounir", prenom: "Mohamed Karim", fonction: "DG", type: "dirigeant", isPrincipal: true },
    ]},
  },
  {
    raisonSociale: "Lafarge Holcim Maroc", nomCommercial: "Lafarge Maroc", ice: "001234567000006",
    rc: "37564", if_: "06789012", cnss: "1000006",
    dateCreation: new Date("1928-01-01"), secteurActivite: "BTP & Matériaux",
    activitePrincipale: "Production de ciment et matériaux de construction",
    formeJuridique: "SA", tailleEntreprise: "Grande", chiffreAffaires: 6400000000,
    groupe: "Holcim Group", ville: "Casablanca", region: "Casablanca-Settat",
    adressePrincipale: "Route de Rabat, Casablanca 20250",
    telephonePrincipal: "+212 5 22 23 13 00", emailPrincipal: "contact@lafarge.ma",
    siteWeb: "www.lafarge.ma", qualityScore: 88, contratsActifs: 4,
    sourceData: "Telecontact DB", statutVerification: "Vérifié", derniereMiseAJour: new Date(),
    contacts: { create: [
      { nom: "Vittorio Peretti", prenom: "Vittorio", fonction: "PDG", type: "dirigeant", isPrincipal: true },
    ]},
    alerts: { create: [{ type: "ADDRESS_CHANGE", message: "Changement d'adresse du siège social", oldValue: "Route de Rabat, Casablanca", newValue: "Tour Casablanca Finance City, Bureau 14", isRead: false }] },
  },
  {
    raisonSociale: "ONCF", nomCommercial: "ONCF", ice: "001234567000007",
    rc: "200007", if_: "07890123", cnss: "1000007",
    dateCreation: new Date("1963-08-05"), secteurActivite: "Transport",
    activitePrincipale: "Transport ferroviaire",
    detailActivite: "Gestion et exploitation du réseau ferroviaire national",
    formeJuridique: "SA", tailleEntreprise: "Grande", chiffreAffaires: 4200000000,
    ville: "Rabat", region: "Rabat-Salé-Kénitra",
    adressePrincipale: "8 bis rue Abderrahman El Ghafiki, Agdal, Rabat",
    telephonePrincipal: "+212 5 37 77 47 47", emailPrincipal: "contact@oncf.ma",
    siteWeb: "www.oncf.ma", qualityScore: 82, contratsActifs: 3,
    sourceData: "Telecontact DB", statutVerification: "Vérifié", derniereMiseAJour: new Date(),
    contacts: { create: [
      { nom: "Mohamed Rabie Khlie", prenom: "Mohamed Rabie", fonction: "DG", type: "dirigeant", isPrincipal: true },
    ]},
  },
  {
    raisonSociale: "Royal Air Maroc", nomCommercial: "RAM", ice: "001234567000008",
    rc: "28611", if_: "08901234", cnss: "1000008",
    dateCreation: new Date("1957-06-28"), secteurActivite: "Transport aérien",
    activitePrincipale: "Transport aérien de passagers et fret",
    formeJuridique: "SA", tailleEntreprise: "Grande", chiffreAffaires: 12000000000,
    ville: "Casablanca", region: "Casablanca-Settat",
    adressePrincipale: "Aéroport Mohammed V, Casablanca",
    telephonePrincipal: "+212 5 22 48 97 97", emailPrincipal: "contact@royalairmaroc.com",
    siteWeb: "www.royalairmaroc.com", qualityScore: 86, contratsActifs: 6,
    sourceData: "Telecontact DB", statutVerification: "Vérifié", derniereMiseAJour: new Date(),
    contacts: { create: [
      { nom: "Abdelhamid Addou", prenom: "Abdelhamid", fonction: "PDG", type: "dirigeant", isPrincipal: true },
    ]},
  },
  {
    raisonSociale: "Cosumar SA", nomCommercial: "Cosumar", ice: "001234567000009",
    rc: "2658", if_: "09012345", cnss: "1000009",
    dateCreation: new Date("1929-06-25"), secteurActivite: "Agroalimentaire",
    activitePrincipale: "Raffinage et conditionnement du sucre",
    formeJuridique: "SA", tailleEntreprise: "Grande", chiffreAffaires: 8900000000,
    groupe: "SNI - Al Mada", ville: "Casablanca", region: "Casablanca-Settat",
    adressePrincipale: "8 rue el Araar, Casablanca 20200",
    telephonePrincipal: "+212 5 22 67 83 00", emailPrincipal: "contact@cosumar.co.ma",
    siteWeb: "www.cosumar.co.ma", qualityScore: 93, contratsActifs: 4,
    sourceData: "Telecontact DB", statutVerification: "Vérifié", derniereMiseAJour: new Date(),
    contacts: { create: [
      { nom: "Mohammed Fikrat", prenom: "Mohammed", fonction: "PDG", type: "dirigeant", isPrincipal: true },
    ]},
  },
  {
    raisonSociale: "Managem Group", nomCommercial: "Managem", ice: "001234567000010",
    rc: "55260", if_: "10123456", cnss: "1000010",
    dateCreation: new Date("1930-01-01"), secteurActivite: "Mines & Métaux",
    activitePrincipale: "Exploration et exploitation minière",
    detailActivite: "Or, argent, cuivre, cobalt, zinc",
    formeJuridique: "SA", tailleEntreprise: "Grande", chiffreAffaires: 5600000000,
    groupe: "SNI - Al Mada", ville: "Casablanca", region: "Casablanca-Settat",
    adressePrincipale: "Avenue des FAR, Twin Center Tower A, Casablanca",
    telephonePrincipal: "+212 5 22 23 39 00", emailPrincipal: "contact@managemgroup.com",
    siteWeb: "www.managemgroup.com", qualityScore: 85, contratsActifs: 3,
    sourceData: "Telecontact DB", statutVerification: "Vérifié", derniereMiseAJour: new Date(),
    contacts: { create: [
      { nom: "Imad Toumi", prenom: "Imad", fonction: "DG", type: "dirigeant", isPrincipal: true },
    ]},
  },
  {
    raisonSociale: "LYDEC", nomCommercial: "LYDEC", ice: "001234567000011",
    rc: "76777", if_: "11234567", cnss: "1000011",
    dateCreation: new Date("1997-07-01"), secteurActivite: "Eau & Électricité",
    activitePrincipale: "Distribution d'eau, électricité et assainissement",
    formeJuridique: "SA", tailleEntreprise: "Grande", chiffreAffaires: 9200000000,
    groupe: "Suez Group", ville: "Casablanca", region: "Casablanca-Settat",
    adressePrincipale: "48 rue Mohamed Diouri, Casablanca 20000",
    telephonePrincipal: "+212 5 22 50 35 00", emailPrincipal: "contact@lydec.ma",
    siteWeb: "www.lydec.ma", qualityScore: 78, contratsActifs: 5,
    sourceData: "Telecontact DB", statutVerification: "Vérifié", derniereMiseAJour: new Date(),
    contacts: { create: [
      { nom: "Eric Bazin", prenom: "Eric", fonction: "DG", type: "dirigeant", isPrincipal: true },
    ]},
  },
  {
    raisonSociale: "Label Vie SA", nomCommercial: "Carrefour Maroc", ice: "001234567000012",
    rc: "88342", if_: "12345678", cnss: "1000012",
    dateCreation: new Date("1985-01-01"), secteurActivite: "Commerce & Distribution",
    activitePrincipale: "Grande distribution alimentaire et non-alimentaire",
    formeJuridique: "SA", tailleEntreprise: "Grande", chiffreAffaires: 14500000000,
    ville: "Rabat", region: "Rabat-Salé-Kénitra",
    adressePrincipale: "Km 4.5 Route de Casablanca, Rabat",
    telephonePrincipal: "+212 5 37 75 45 00", emailPrincipal: "contact@labelvie.ma",
    siteWeb: "www.labelvie.ma", qualityScore: 72, contratsActifs: 2,
    sourceData: "Telecontact DB", statutVerification: "Vérifié", derniereMiseAJour: new Date(),
    contacts: { create: [
      { nom: "Zouhair Bennani", prenom: "Zouhair", fonction: "PDG", type: "dirigeant", isPrincipal: true },
    ]},
  },
  {
    raisonSociale: "Inwi", nomCommercial: "inwi", ice: "001234567000013",
    rc: "133333", if_: "13456789", cnss: "1000013",
    dateCreation: new Date("2009-01-01"), secteurActivite: "Télécommunications",
    activitePrincipale: "Opérateur de télécommunications mobile et fixe",
    formeJuridique: "SA", tailleEntreprise: "Grande", chiffreAffaires: 7400000000,
    groupe: "SNI - Al Mada", ville: "Casablanca", region: "Casablanca-Settat",
    adressePrincipale: "1 Rue Kadiria, Casablanca 20800",
    telephonePrincipal: "+212 8 00 00 50 00", emailPrincipal: "contact@inwi.ma",
    siteWeb: "www.inwi.ma", qualityScore: 80, contratsActifs: 3,
    sourceData: "Telecontact DB", statutVerification: "Vérifié", derniereMiseAJour: new Date(),
    contacts: { create: [
      { nom: "Nadia Fassi Fihri", prenom: "Nadia", fonction: "DG", type: "dirigeant", isPrincipal: true },
    ]},
  },
  {
    raisonSociale: "CIH Bank", nomCommercial: "CIH", ice: "001234567000014",
    rc: "29027", if_: "14567890", cnss: "1000014",
    dateCreation: new Date("1920-01-01"), secteurActivite: "Finance & Bancaire",
    activitePrincipale: "Banque immobilière et de détail",
    formeJuridique: "SA", tailleEntreprise: "Grande", chiffreAffaires: 4100000000,
    ville: "Casablanca", region: "Casablanca-Settat",
    adressePrincipale: "187 Avenue Hassan II, Casablanca 20000",
    telephonePrincipal: "+212 5 22 47 90 00", emailPrincipal: "contact@cih.co.ma",
    siteWeb: "www.cih.co.ma", qualityScore: 83, contratsActifs: 4,
    sourceData: "Telecontact DB", statutVerification: "Vérifié", derniereMiseAJour: new Date(),
    contacts: { create: [
      { nom: "Ahmed Rahhou", prenom: "Ahmed", fonction: "PDG", type: "dirigeant", isPrincipal: true },
    ]},
  },
  {
    raisonSociale: "Sonasid SA", nomCommercial: "Sonasid", ice: "001234567000015",
    rc: "40000", if_: "15678901", cnss: "1000015",
    dateCreation: new Date("1974-06-13"), secteurActivite: "Métallurgie & Sidérurgie",
    activitePrincipale: "Production de produits longs en acier",
    formeJuridique: "SA", tailleEntreprise: "Grande", chiffreAffaires: 3800000000,
    groupe: "ArcelorMittal", ville: "Jorf Lasfar", region: "Casablanca-Settat",
    adressePrincipale: "Zone Industrielle Jorf Lasfar, El Jadida",
    telephonePrincipal: "+212 5 23 34 12 00", emailPrincipal: "contact@sonasid.ma",
    siteWeb: "www.sonasid.ma", qualityScore: 67, contratsActifs: 2,
    sourceData: "Telecontact DB", statutVerification: "À vérifier", derniereMiseAJour: new Date(),
    contacts: { create: [
      { nom: "Mehdi Benbachir", prenom: "Mehdi", fonction: "DG", type: "dirigeant", isPrincipal: true },
    ]},
  },
  {
    raisonSociale: "Marsa Maroc", nomCommercial: "Marsa Maroc", ice: "001234567000016",
    rc: "110000", if_: "16789012", cnss: "1000016",
    dateCreation: new Date("2006-07-01"), secteurActivite: "Logistique & Portuaire",
    activitePrincipale: "Gestion et exploitation des terminaux portuaires",
    formeJuridique: "SA", tailleEntreprise: "Grande", chiffreAffaires: 3200000000,
    ville: "Casablanca", region: "Casablanca-Settat",
    adressePrincipale: "169 Boulevard Zerktouni, Casablanca 20000",
    telephonePrincipal: "+212 5 22 23 33 00", emailPrincipal: "contact@marsamaroc.ma",
    siteWeb: "www.marsamaroc.ma", qualityScore: 74, contratsActifs: 1,
    sourceData: "Telecontact DB", statutVerification: "Vérifié", derniereMiseAJour: new Date(),
    contacts: { create: [
      { nom: "Hassan Abkari", prenom: "Hassan", fonction: "PDG", type: "dirigeant", isPrincipal: true },
    ]},
  },
  {
    raisonSociale: "ADM - Autoroutes du Maroc", nomCommercial: "ADM", ice: "001234567000017",
    rc: "77777", if_: "17890123", cnss: "1000017",
    dateCreation: new Date("1989-03-01"), secteurActivite: "Infrastructure & BTP",
    activitePrincipale: "Construction et exploitation du réseau autoroutier",
    formeJuridique: "SA", tailleEntreprise: "Grande", chiffreAffaires: 3600000000,
    ville: "Rabat", region: "Rabat-Salé-Kénitra",
    adressePrincipale: "Angle routes d'El Jadida et de Nouasseur, Casablanca",
    telephonePrincipal: "+212 5 22 23 10 10", emailPrincipal: "contact@adm.co.ma",
    siteWeb: "www.adm.co.ma", qualityScore: 79, contratsActifs: 2,
    sourceData: "Telecontact DB", statutVerification: "Vérifié", derniereMiseAJour: new Date(),
    contacts: { create: [
      { nom: "Mohamed Addou", prenom: "Mohamed", fonction: "DG", type: "dirigeant", isPrincipal: true },
    ]},
  },
  {
    raisonSociale: "Crédit Agricole du Maroc", nomCommercial: "CAM", ice: "001234567000018",
    rc: "5874", if_: "18901234", cnss: "1000018",
    dateCreation: new Date("1961-01-01"), secteurActivite: "Finance & Bancaire",
    activitePrincipale: "Banque agricole et rurale",
    formeJuridique: "SA", tailleEntreprise: "Grande", chiffreAffaires: 6800000000,
    ville: "Rabat", region: "Rabat-Salé-Kénitra",
    adressePrincipale: "Place des Alaouites, Rabat",
    telephonePrincipal: "+212 5 37 68 90 00", emailPrincipal: "contact@creditagricole.ma",
    siteWeb: "www.creditagricole.ma", qualityScore: 81, contratsActifs: 6,
    sourceData: "Telecontact DB", statutVerification: "Vérifié", derniereMiseAJour: new Date(),
    contacts: { create: [
      { nom: "Tariq Sijilmassi", prenom: "Tariq", fonction: "PDG", type: "dirigeant", isPrincipal: true },
    ]},
  },
  {
    raisonSociale: "Ciments du Maroc", nomCommercial: "CimMaroc", ice: "001234567000019",
    rc: "35600", if_: "19012345", cnss: "1000019",
    dateCreation: new Date("1951-01-01"), secteurActivite: "BTP & Matériaux",
    activitePrincipale: "Production et commercialisation de ciment",
    formeJuridique: "SA", tailleEntreprise: "Grande", chiffreAffaires: 4100000000,
    groupe: "HeidelbergCement", ville: "Casablanca", region: "Casablanca-Settat",
    adressePrincipale: "Twin Center Tour Ouest, Angle Bd Zerktouni & Al Massira, Casablanca",
    telephonePrincipal: "+212 5 22 95 79 00", emailPrincipal: "contact@cimentsdumaroc.com",
    siteWeb: "www.cimentsdumaroc.com", qualityScore: 76, contratsActifs: 2,
    sourceData: "Telecontact DB", statutVerification: "Vérifié", derniereMiseAJour: new Date(),
    contacts: { create: [
      { nom: "Hamid Benbrahim El Andaloussi", prenom: "Hamid", fonction: "PDG", type: "dirigeant", isPrincipal: true },
    ]},
  },
  {
    raisonSociale: "SAMIR SA", nomCommercial: "SAMIR", ice: "001234567000020",
    rc: "56789", if_: "20123456", cnss: "1000020",
    dateCreation: new Date("1959-01-01"), secteurActivite: "Énergie & Pétrole",
    activitePrincipale: "Raffinage de pétrole",
    detailActivite: "Production de produits pétroliers raffinés",
    formeJuridique: "SA", tailleEntreprise: "Grande", chiffreAffaires: 0,
    ville: "Mohammedia", region: "Casablanca-Settat",
    adressePrincipale: "Route de l'usine, Mohammedia 28810",
    telephonePrincipal: "+212 5 23 32 24 50", emailPrincipal: "contact@samir.ma",
    siteWeb: "www.samir.ma", qualityScore: 45, contratsActifs: 0,
    status: "SUSPENDED" as const,
    sourceData: "Telecontact DB", statutVerification: "Alerte", derniereMiseAJour: new Date(),
    contacts: { create: [
      { nom: "Hicham Snousi", prenom: "Hicham", fonction: "Administrateur Judiciaire", type: "dirigeant", isPrincipal: true },
    ]},
    alerts: { create: [
      { type: "LEGAL_STATUS_CHANGE" as const, message: "Mise en liquidation judiciaire", oldValue: "En activité", newValue: "Liquidation judiciaire", isRead: false },
    ]},
  },
]

const mergeSuggestions = [
  {
    sourceRaisonSociale: "BMCE Bank of Africa",
    targetRaisonSociale: "Banque Marocaine du Commerce Extérieur",
    confidenceScore: 0.97,
    matchedFields: ["ICE", "RC", "Téléphone", "Adresse"],
  },
  {
    sourceRaisonSociale: "Crédit Agricole du Maroc",
    targetRaisonSociale: "CAM",
    confidenceScore: 0.94,
    matchedFields: ["IF", "CNSS", "Ville", "Email"],
  },
]

async function main() {
  console.log('🌱 Starting seed...')

  // Clear existing data
  await prisma.alert.deleteMany()
  await prisma.mergeSuggestion.deleteMany()
  await prisma.contact.deleteMany()
  await prisma.auditLog.deleteMany()
  await prisma.company.deleteMany()
  await prisma.importBatch.deleteMany()

  console.log('🗑️  Cleared existing data')

  // Seed companies with contacts and alerts
  for (const company of companies) {
    const { contacts, alerts, ...companyData } = company
    const created = await prisma.company.create({
      data: { ...companyData, contacts, alerts },
    })
    console.log(`✅ Created: ${created.raisonSociale}`)
  }

  // Seed merge suggestions
  const allCompanies = await prisma.company.findMany({ take: 4 })
  if (allCompanies.length >= 4) {
    await prisma.mergeSuggestion.create({
      data: {
        sourceCompanyId: allCompanies[0].id,
        targetCompanyId: allCompanies[1].id,
        confidenceScore: 0.97,
        matchedFields: { fields: ["ICE", "RC", "Téléphone principal", "Adresse"] },
        status: "PENDING",
      }
    })
    await prisma.mergeSuggestion.create({
      data: {
        sourceCompanyId: allCompanies[2].id,
        targetCompanyId: allCompanies[3].id,
        confidenceScore: 0.89,
        matchedFields: { fields: ["IF", "CNSS", "Ville", "Secteur"] },
        status: "PENDING",
      }
    })
  }

  const finalCount = await prisma.company.count()
  console.log(`\n🎉 Seed complete! ${finalCount} companies created.`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
