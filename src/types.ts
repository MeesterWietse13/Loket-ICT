/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserRole = 'admin' | 'directie' | 'leerkracht';

export type School = 'De Grasmus' | 'De Klare Bron' | 'Matadi' | 'Klaverblad';

export type Priority = 'laag' | 'normaal' | 'dringend';
export type Status = 'nieuw' | 'ingepland' | 'alternatief voorgesteld' | 'opgelost' | 'geannuleerd';

export interface ICTRequest {
  id: string;
  school: School;
  aanvrager: string;
  email: string;
  datum: string;
  categorie: string;
  omschrijving: string;
  prioriteit: Priority;
  status: Status;
  geplandeDatumSite?: string;
  isRemote: boolean;
  geplandeDatumRemote?: string;
  interneNota: string;
  beschikbareDagen?: string[];
}

export type PersonnelNotificationType = 'nieuwe medewerker' | 'vertrekkende medewerker';
export type PersonnelStatus = 'nieuw' | 'bezig' | 'afgerond';

export interface ChecklistItem {
  id: string;
  label: string;
  isCompleted: boolean;
}

export interface PersonnelNotification {
  id: string;
  school: School;
  naam: string;
  voornaam: string;
  email: string;
  functie: string;
  datum: string; // start- or departure date
  type: PersonnelNotificationType;
  opmerkingen: string;
  status: PersonnelStatus;
  interneNota: string;
  datumAfgerond?: string;
  checklist: ChecklistItem[];
  laptopNodig: boolean;
  bingelAccount: boolean;
  scoodleAccount: boolean;
}

export interface EmailLog {
  id: string;
  requestId: string;
  to: string;
  subject: string;
  body: string;
  sentAt: string;
}

export interface CalendarEntry {
  date: string; // YYYY-MM-DD
  location: School | 'Thuiswerk' | 'Bureaudag' | 'Ziek' | 'Verlof';
}

export interface Settings {
  scholen: string[];
  categorieen: string[];
  standaardChecklistNieuw: string[];
  standaardChecklistVertrek: string[];
  calendarEntries: CalendarEntry[];
}
