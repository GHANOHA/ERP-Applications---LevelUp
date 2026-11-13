sap.ui.define([], function () {
  "use strict";

  /**
   * Formatters: kleine functies die een waarde uit het model omzetten
   * naar wat de gebruiker moet zien.
   */
  return {
    // 0 → "Uitverkocht", 3 → "Nog 3", 12 → "Op voorraad (12)"
    // Let op: in de view binden we met targetType: 'any', zodat we het getal krijgen
    // en niet de al opgemaakte tekst van OData V4.
    stockText: function (stock) {
      var bundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
      if (stock === 0) { return bundle.getText("soldOut"); }
      if (stock < 5) { return bundle.getText("fewLeft", [stock]); }
      return bundle.getText("inStock", [stock]);
    }
  };
});
