sap.ui.define([
  "sap/ui/core/mvc/Controller"
], function (Controller) {
  "use strict";

  return Controller.extend("levelup.orders.controller.ItemDetail", {
    onInit: function () {
      this.getOwnerComponent().getRouter().getRoute("itemDetail")
        .attachPatternMatched(this._onRouteMatched, this);
    },

    _onRouteMatched: function (oEvent) {
      var oArgs = oEvent.getParameter("arguments");
      this._sOrderId = oArgs.orderId;
      // Orderregels zijn een composition: je bereikt ze via hun order
      this.getView().bindElement("/Orders(" + oArgs.orderId + ")/items(" + oArgs.itemId + ")");
    },

    onClose: function () {
      this.getOwnerComponent().getRouter().navTo("orderDetail", { orderId: this._sOrderId });
    }
  });
});
