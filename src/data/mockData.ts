import { ICTRequest, PersonnelNotification, Settings } from '../types';

export const INITIAL_REQUESTS: ICTRequest[] = [
  {
    id: '1',
    school: 'De Grasmus',
    aanvrager: 'Jan Peeters',
    email: 'jan@degrasmus.be',
    datum: '2024-05-01',
    categorie: 'Hardware',
    omschrijving: 'Laptop start niet meer op na update.',
    prioriteit: 'dringend',
    status: 'nieuw',
    isRemote: false,
    interneNota: 'Waarschijnlijk batterijprobleem.',
  },
  {
    id: '2',
    school: 'De Klare Bron',
    aanvrager: 'An Janssens',
    email: 'an@deklarebron.be',
    datum: '2024-05-02',
    categorie: 'Software',
    omschrijving: 'Smartschool login lukt niet voor klas 3B.',
    prioriteit: 'normaal',
    status: 'ingepland',
    geplandeDatumSite: '2024-05-10',
    isRemote: false,
    interneNota: 'Nagaan of het aan de browserinstellingen ligt.',
  },
  {
    id: '3',
    school: 'Matadi',
    aanvrager: 'Dirk Sterckx',
    email: 'dirk@matadi.be',
    datum: '2024-05-03',
    categorie: 'Netwerk',
    omschrijving: 'Wifi valt weg in de turnzaal.',
    prioriteit: 'normaal',
    status: 'alternatief voorgesteld',
    isRemote: true,
    geplandeDatumRemote: '2024-05-09T14:00:00',
    interneNota: 'Gevraagd om een herstart van het access point te proberen.',
  },
  {
    id: '4',
    school: 'Klaverblad',
    aanvrager: 'Sofie Mertens',
    email: 'sofie@klaverblad.be',
    datum: '2024-05-04',
    categorie: 'Printer',
    omschrijving: 'Printer op de eerste verdieping geeft strepen.',
    prioriteit: 'laag',
    status: 'opgelost',
    isRemote: false,
    interneNota: 'Toner vervangen en gereinigd.',
  }
];

export const INITIAL_PERSONNEL: PersonnelNotification[] = [
  {
    id: 'p1',
    school: 'De Grasmus',
    naam: 'De Backer',
    voornaam: 'Bart',
    email: 'bart.debacker@degrasmus.be',
    functie: 'Leerkracht L5',
    datum: '2024-06-01',
    type: 'nieuwe medewerker',
    opmerkingen: 'Heeft nood aan een nieuwe laptop.',
    status: 'bezig',
    interneNota: 'Laptop is besteld.',
    laptopNodig: true,
    bingelAccount: true,
    scoodleAccount: false,
    checklist: [
      { id: 'c1', label: 'E-mailadres aanmaken', isCompleted: true },
      { id: 'c2', label: 'Smartschool aanmaken', isCompleted: true },
      { id: 'c3', label: 'Laptop voorzien', isCompleted: false },
      { id: 'c4', label: 'Account Bingel', isCompleted: false },
    ]
  },
  {
    id: 'p2',
    school: 'Matadi',
    naam: 'Vandevelde',
    voornaam: 'Lieve',
    email: 'lieve.v@matadi.be',
    functie: 'Zorgleerkracht',
    datum: '2024-05-31',
    type: 'vertrekkende medewerker',
    opmerkingen: 'Draag bestanden over naar collega Els.',
    status: 'nieuw',
    interneNota: '',
    laptopNodig: false,
    bingelAccount: true,
    scoodleAccount: true,
    checklist: [
      { id: 'c1', label: 'E-mailadres afsluiten', isCompleted: false },
      { id: 'c2', label: 'Smartschool afsluiten', isCompleted: false },
      { id: 'c3', label: 'Account Bingel stopzetten', isCompleted: false },
      { id: 'c4', label: 'Account Scoodle stopzetten', isCompleted: false },
    ]
  }
];

export const DEFAULT_SETTINGS: Settings = {
  scholen: ['De Grasmus', 'De Klare Bron', 'Matadi', 'Klaverblad'],
  categorieen: ['Hardware', 'Software', 'Netwerk', 'Printer', 'Smartschool', 'Andere'],
  standaardChecklistNieuw: [
    'mailadres aanmaken',
    'smartschool aanmaken',
    'laptop',
    'account Bingel',
    'account Scoodle'
  ],
  standaardChecklistVertrek: [
    'mailadres afsluiten',
    'smartschool afsluiten',
    'laptop inleveren',
    'account Bingel stopzetten',
    'account Scoodle stopzetten'
  ],
  calendarEntries: [
    { date: '2026-05-04', location: 'Klaverblad' },
    { date: '2026-05-05', location: 'De Klare Bron' },
    { date: '2026-05-06', location: 'Matadi' },
    { date: '2026-05-07', location: 'De Grasmus' },
    { date: '2026-05-08', location: 'Matadi' },
    { date: '2026-05-11', location: 'Klaverblad' },
    { date: '2026-05-12', location: 'De Klare Bron' },
    { date: '2026-05-13', location: 'Matadi' },
    { date: '2026-05-14', location: 'De Grasmus' },
    { date: '2026-05-15', location: 'Matadi' },
    { date: '2026-05-18', location: 'Klaverblad' },
    { date: '2026-05-19', location: 'De Klare Bron' },
    { date: '2026-05-20', location: 'Matadi' },
    { date: '2026-05-21', location: 'De Grasmus' },
    { date: '2026-05-22', location: 'Matadi' },
  ]
};
