sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "levelup/shop/model/formatter"
], function (Controller, formatter) {
  "use strict";

  return Controller.extend("levelup.shop.controller.OrderList", {
    formatter: formatter,

    // Side quest: details van een order in een dialoog (fragment)
    onOrderPress: function (oEvent) {
      var oContext = oEvent.getSource().getBindingContext("orders");
      // het fragment één keer laden en daarna hergebruiken
      if (!this._pDialog) {
        this._pDialog = this.loadFragment({ name: "levelup.shop.view.fragment.OrderDetail" });
      }
      this._pDialog.then(function (oDialog) {
        oDialog.bindElement({ path: oContext.getPath(), model: "orders", parameters: { $expand: "customer" } });
        oDialog.open();
      });
    },

    onCloseDialog: function () {
      this.byId("orderDialog").close();
    },

    onNavBack: function () {
      this.getOwnerComponent().getRouter().navTo("gameList", {}, true);
    }
  });
});
