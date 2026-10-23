using { levelup as db } from '../db/schema';

/**
 * De kassa van LevelUp: klanten en hun orders.
 * /odata/v4/orders
 */
service OrderService @(path: 'orders') {
  entity Customers as projection on db.Customers;

  entity Orders    as projection on db.Orders actions {
    // W4 · bound action: werkt op één order  →  POST /Orders(<ID>)/OrderService.cancel
    action cancel() returns Orders;
    action pay()    returns Orders;   // side quest C
  };

  @readonly
  entity Games     as projection on db.Games;
}

// W4 · vertrouw de client niet: deze velden berekent de server zelf
annotate OrderService.Orders with {
  totalAmount @readonly;
  status      @readonly;
};
annotate OrderService.OrderItems with {
  unitPrice   @readonly;
};

// W4 · een order wijzig je niet meer na het aanmaken: enkel via de actions cancel() en pay()
annotate OrderService.Orders with @(Capabilities: {
  UpdateRestrictions: { Updatable: false },
  DeleteRestrictions: { Deletable: false }
});
annotate OrderService.OrderItems with @(Capabilities: {
  InsertRestrictions: { Insertable: false },
  UpdateRestrictions: { Updatable: false },
  DeleteRestrictions: { Deletable: false }
});
