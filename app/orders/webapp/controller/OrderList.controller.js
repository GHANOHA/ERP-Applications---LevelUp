sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/model/Filter",
  "sap/ui/model/FilterOperator",
  "sap/ui/model/Sorter"
], function (Controller, Filter, FilterOperator, Sorter) {
  "use strict";

  return Controller.extend("levelup.orders.controller.OrderList", {
    onInit: function () {
      this._bDescending = true;   // nieuwste eerst, zoals de sorter in de view
    },

    // Zoeken én status filteren: beide filters samen (AND) op de binding zetten
    onFilter: function () {
      var aFilters = [];

      var sQuery = this.byId("searchField").getValue();
      if (sQuery) {
        // Voornaam OF familienaam bevat de zoekterm
        aFilters.push(new Filter({
          filters: [
            new Filter({ path: "customer/firstName", operator: FilterOperator.Contains, value1: sQuery, caseSensitive: false }),
            new Filter({ path: "customer/lastName",  operator: FilterOperator.Contains, value1: sQuery, caseSensitive: false })
          ],
          and: false
        }));
      }

      var sStatus = this.byId("statusFilter").getSelectedKey();
      if (sStatus) {
        aFilters.push(new Filter("status_code", FilterOperator.EQ, sStatus));
      }

      this.byId("orderTable").getBinding("items").filter(aFilters);
    },

    // Sorteren op datum: telkens omdraaien
    onSort: function () {
      this._bDescending = !this._bDescending;
      this.byId("orderTable").getBinding("items").sort(new Sorter("orderDate", this._bDescending));
    },

    // Klik op een order: de URL wordt orders/<ID>, de router opent de tweede kolom
    onOrderPress: function (oEvent) {
      var sOrderId = oEvent.getSource().getBindingContext().getProperty("ID");
      this.getOwnerComponent().getRouter().navTo("orderDetail", { orderId: sOrderId });
    }
  });
});
