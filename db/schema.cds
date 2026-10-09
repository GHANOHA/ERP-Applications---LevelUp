namespace levelup;

using {
  cuid,
  managed,
  Currency,
  Country,
  sap.common.CodeList
} from '@sap/cds/common';

using from '@sap/cds-common-content';


/**
 * Een game in de catalogus van LevelUp.
 * cuid    -> key ID : UUID (automatisch gegenereerd)
 * managed -> createdAt, createdBy, modifiedAt, modifiedBy
 */
entity Games : cuid, managed {
  title         : String(100) @mandatory;
  description   : String(1000);
  genre         : Association to Genres @assert.target;    // code list + side quest: onbestaande code weigeren
  platform      : Association to Platforms @assert.target; // code list + side quest
  price         : Decimal(9, 2);
  currency      : Currency;                   // -> currency_code
  stock         : Integer default 0;
  releaseDate   : Date;
  studioCountry : Country;                    // -> studioCountry_code
}

/** Code lists: key 'code' + 'name' en 'descr' (vertaalbaar) */
entity Genres : CodeList {
  key code : String(20);
}

entity Platforms : CodeList {
  key code : String(20);
}
