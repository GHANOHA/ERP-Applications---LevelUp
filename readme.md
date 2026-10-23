# LevelUp – referentieoplossing W4 (Spelregels: business logica)

Bouwt verder op W3. Nieuw:

- `srv/order-service.js`: order valideren (minstens 1 regel, aantal > 0, voorraad), prijs en totaal server-side, voorraad verminderen, bound action `cancel()`
- `srv/catalog-service.js`: review-commentaar valideren, unbound function `topGames(limit)`, side quests `isNew` en "enkel kopers mogen reviewen"
- `OrderStatus` als code list met `criticality`; `@assert.range` op rating; `@readonly` op berekende velden

```bash
npm install
cds watch
```

Open `test.http`: queries 20–29 zijn nieuw in W4. Getest met @sap/cds 10.1 (2 oktober 2026).
