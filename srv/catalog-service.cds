using { levelup as db } from '../db/schema';

/**
 * Single-purpose service: de etalage van LevelUp.
 * Bereikbaar op /odata/v4/catalog
 */
service CatalogService @(path: 'catalog') {
  entity Games     as projection on db.Games;
  entity Genres    as projection on db.Genres;
  entity Platforms as projection on db.Platforms;
}
