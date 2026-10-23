using { levelup as db } from '../db/schema';

/**
 * De etalage van LevelUp: games, hun reviews en tags.
 * /odata/v4/catalog
 */
service CatalogService @(path: 'catalog') {
  entity Games      as projection on db.Games;
  entity Genres     as projection on db.Genres;
  entity Platforms  as projection on db.Platforms;
  entity Tags       as projection on db.Tags;
  entity Reviews    as projection on db.Reviews;
  entity Publishers as projection on db.Publishers;   // side quest W3

  // Zonder deze projectie verdwijnt Reviews.customer uit de service:
  // een association naar een entity die niet in de service zit, wordt weggelaten.
  @readonly
  entity Customers  as projection on db.Customers { ID, firstName, lastName };

  // W4 · unbound function: hoort bij geen enkele entity  →  GET /topGames(limit=3)
  type TopGame {
    ID        : UUID;
    title     : String;
    avgRating : Decimal(3, 2);
    reviews   : Integer;
  }
  function topGames(limit : Integer) returns array of TopGame;
}
