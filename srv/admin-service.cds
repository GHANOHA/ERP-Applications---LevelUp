using { levelup as db } from '../db/schema';

/**
 * W5 · Beheerder Mode: de backoffice van LevelUp.
 * Eén service voor de medewerkers die de catalogus beheren.
 * /odata/v4/admin
 */
service AdminService @(path: 'admin') {

  // Draft: wijzigingen worden eerst als concept bewaard, pas bij "Opslaan" echt doorgevoerd
  @odata.draft.enabled
  entity Games as projection on db.Games;

  // Reviews en tags horen bij een game (composition): ze gaan mee in de draft
  entity Reviews  as projection on db.Reviews;

  // Klantnaam tonen bij een review (enkel lezen, enkel de naam)
  @readonly
  entity Customers as projection on db.Customers { ID, firstName, lastName };

  // Een view is geen "vervanger" voor Reviews: zeg CAP dat hij hier niet naar moet omleiden
  @readonly @cds.redirection.target: false
  entity GameLeaderboard as projection on db.GameLeaderboard;
}
