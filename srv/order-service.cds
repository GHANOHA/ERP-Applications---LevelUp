using { levelup as db } from '../db/schema';

/**
 * De kassa van LevelUp: klanten en hun orders.
 * /odata/v4/orders
 */
service OrderService @(path: 'orders') {
  entity Customers as projection on db.Customers;
  entity Orders    as projection on db.Orders;
  @readonly
  entity Games     as projection on db.Games;
}
