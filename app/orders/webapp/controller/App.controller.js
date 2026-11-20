sap.ui.define([
  "sap/ui/core/mvc/Controller"
], function (Controller) {
  "use strict";

  // Welke route toont hoeveel kolommen?
  var LAYOUT = {
    orderList:   "OneColumn",
    orderDetail: "TwoColumnsMidExpanded",
    itemDetail:  "ThreeColumnsMidExpanded"
  };

  return Controller.extend("levelup.orders.controller.App", {
    onInit: function () {
      // Telkens de URL verandert, zetten we eerst de layout van de FCL
      this.getOwnerComponent().getRouter().attachBeforeRouteMatched(function (oEvent) {
        var sLayout = LAYOUT[oEvent.getParameter("name")];
        this.getOwnerComponent().getModel("appView").setProperty("/layout", sLayout);
      }, this);
    }
  });
});
