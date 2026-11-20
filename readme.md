# LevelUp – referentieoplossing W7 (Klanten & Orders I: Flexible Column Layout)

Bouwt verder op W6. Nieuw:

**`app/orders`**, een freestyle SAPUI5-app op de OrderService met een Flexible Column Layout (FCL)
- `view/App.view.xml`: `sap.f.FlexibleColumnLayout` met drie kolommen; de layout komt uit het JSON-model `appView`
- `manifest.json`: `sap.f.routing.Router`; elke route toont één, twee of drie targets (`beginColumnPages`, `midColumnPages`, `endColumnPages`)
- `controller/App.controller.js`: kiest per route de layout (`OneColumn`, `TwoColumnsMidExpanded`, `ThreeColumnsMidExpanded`)
- `view/OrderList.view.xml`: zoeken op klantnaam, filter op status (code list), sorteren op datum
- `view/OrderDetail.view.xml`: order met klant, orderregels, knoppen Betalen/Annuleren (bound actions uit W4, MessageBox + MessageToast)
- `view/fragment/CustomerInfo.fragment.xml`: fragment met de klantgegevens
- Side quest: `view/ItemDetail.view.xml`, derde kolom met één orderregel

**`app/shop`**: review schrijven via een dialog uit `view/fragment/ReviewDialog.fragment.xml`. Fouten van de backend (W4) verschijnen in een MessageBox.

```bash
npm install
cds watch
```

Open http://localhost:4004/orders/webapp/index.html en http://localhost:4004/shop/webapp/index.html.
De URL bevat de geselecteerde order (`#/orders/<ID>`): na een refresh blijft de selectie staan.
Getest met @sap/cds 10.1 en SAPUI5 1.136 in een browser (13 november 2026).
