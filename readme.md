# LevelUp – referentieoplossing W6 (Etalage: SAPUI5 freestyle)

Bouwt verder op W5. Nieuw: `app/shop`, een freestyle SAPUI5-app (MVC) op de CatalogService en OrderService.

- `webapp/manifest.json`: twee OData V4-modellen (catalog = standaard, `orders`), i18n, routing (lijst → detail → orders)
- `view/GameList.view.xml`: tabel met aggregation binding, zoeken (Filter), formatter en expression binding voor de voorraad
- `view/GameDetail.view.xml`: element binding op één game (`bindElement`), reviews met sterren
- `view/OrderList.view.xml`: tweede model met prefix `orders>`, statuskleur via expression binding
- Side quest: `view/fragment/OrderDetail.fragment.xml`: orderregels in een dialoog
- `i18n/i18n.properties` (Nederlands) en `i18n_en.properties` (Engels)

```bash
npm install
cds watch
```

Open http://localhost:4004/shop/webapp/index.html. Getest met @sap/cds 10.1 en SAPUI5 1.136 in een browser (30 oktober 2026).
