sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/model/Filter",
  "sap/ui/model/FilterOperator",
  "levelup/shop/model/formatter"
], function (Controller, Filter, FilterOperator, formatter) {
  "use strict";

  return Controller.extend("levelup.shop.controller.GameList", {
    // maakt de formatters bereikbaar in de view als ".formatter.xxx"
    formatter: formatter,

    // Zoeken: filter de items van de tabel op titel
    onSearch: function (oEvent) {
      var sQuery = oEvent.getParameter("newValue");
      var aFilters = sQuery
        ? [new Filter({ path: "title", operator: FilterOperator.Contains, value1: sQuery, caseSensitive: false })]
        : [];
      this.byId("gameTable").getBinding("items").filter(aFilters);
    },

    // Klik op een rij: navigeer naar de detailpagina met de ID van die game
    onGamePress: function (oEvent) {
      var sId = oEvent.getSource().getBindingContext().getProperty("ID");
      this.getOwnerComponent().getRouter().navTo("gameDetail", { gameId: sId });
    },

    onNavToOrders: function () {
      this.getOwnerComponent().getRouter().navTo("orderList");
    }
  });
});
