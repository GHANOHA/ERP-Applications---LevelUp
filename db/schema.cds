namespace levelup;

using {
  cuid,
  managed,
  Currency,
  Country,
  sap.common.CodeList
} from '@sap/cds/common';

// Landen, valuta en talen (incl. vertalingen) als kant-en-klare data
using from '@sap/cds-common-content';

// =====================================================================
// Catalogus (W2)
// =====================================================================

entity Games : cuid, managed {
  title         : String(100) @mandatory;
  description   : String(1000);
  genre         : Association to Genres @assert.target;    // N:1
  platform      : Association to Platforms @assert.target; // N:1
  price         : Decimal(9, 2);
  currency      : Currency;
  stock         : Integer default 0;
  releaseDate   : Date;
  studioCountry : Country;
  publisher     : Association to Publishers;                // side quest W3
  virtual isNew : Boolean;                                  // side quest W4: berekend, niet opgeslagen

  // W3 · 1:N composition: een review bestaat niet zonder zijn game
  reviews       : Composition of many Reviews on reviews.game = $self;

  // W3 · N:M via de link-entity GameTags
  tags          : Composition of many GameTags on tags.game = $self;
}

entity Genres : CodeList {
  key code : String(20);
}

entity Platforms : CodeList {
  key code : String(20);
}

// =====================================================================
// Klanten en orders (W3)
// =====================================================================

entity Customers : cuid, managed {
  firstName : String(80)  @mandatory;
  lastName  : String(80)  @mandatory;
  email     : String(120) @mandatory;
  country   : Country;

  // 1:N association (backlink): een klant "bezit" zijn orders niet,
  // een order bestaat ook als boekhoudkundig document
  orders    : Association to many Orders on orders.customer = $self;
  reviews   : Association to many Reviews on reviews.customer = $self;
}

entity Orders : cuid, managed {
  orderDate   : DateTime @cds.on.insert: $now;
  customer    : Association to Customers @mandatory @assert.target; // N:1
  currency    : Currency;

  // W4 · status als code list (geen vrije tekst) + berekend totaal
  status      : Association to OrderStatus default 'OPEN';
  totalAmount : Decimal(9, 2);

  // 1:N composition: orderregels bestaan niet zonder hun order
  items     : Composition of many OrderItems on items.order = $self;
}

entity OrderItems : cuid {
  order     : Association to Orders;                         // backlink naar de ouder
  game      : Association to Games @mandatory @assert.target; // N:1
  quantity  : Integer @mandatory;
  unitPrice : Decimal(9, 2);
}

entity Reviews : cuid, managed {
  game     : Association to Games @assert.target;  // ouder (composition vanuit Games); ook controleren, want /Reviews is rechtstreeks bereikbaar
  customer : Association to Customers @assert.target;
  rating   : Integer @mandatory @assert.range: [1, 5]; // W4 · declaratieve validatie
  comment  : String(1000);
}

// W4 · status van een order
entity OrderStatus : CodeList {
  key code        : String(10);
      criticality : Integer; // 1 = rood, 2 = oranje, 3 = groen (gebruikt in W5 voor kleuren)
}

// =====================================================================
// N:M · Games <-> Tags (main quest W3)
// =====================================================================

entity Tags : CodeList {
  key code  : String(20);
      games : Association to many GameTags on games.tag = $self;
}

entity GameTags {
  key game : Association to Games;
  key tag  : Association to Tags;
}

// =====================================================================
// Side quest W3 · bidirectionele association
// =====================================================================

entity Publishers : cuid, managed {
  name    : String(100) @mandatory;
  country : Country;
  website : String(200);
  games   : Association to many Games on games.publisher = $self;
}
