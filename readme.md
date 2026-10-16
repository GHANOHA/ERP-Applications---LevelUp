# LevelUp – referentieoplossing W3 (Inventaris II: relaties)

Bouwt verder op W2. Nieuw: `Customers`, `Orders`, `OrderItems` (composition), `Reviews` (composition onder Games),
N:M `Games` ↔ `Tags` via `GameTags`, een tweede service `OrderService` (/odata/v4/orders) en side quest `Publishers` (bidirectioneel).

```bash
npm install
cds watch
```

Open `test.http`: queries 10–18 zijn nieuw in W3 (deep insert, cascade delete, geneste $expand). Getest met @sap/cds 10.1 (2 oktober 2026).
