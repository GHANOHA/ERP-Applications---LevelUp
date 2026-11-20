sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/m/MessageToast",
  "sap/m/MessageBox"
], function (Controller, MessageToast, MessageBox) {
  "use strict";

  return Controller.extend("levelup.orders.controller.OrderDetail", {
    onInit: function () {
      var oRouter = this.getOwnerComponent().getRouter();
      // Zowel bij orders/<ID> als bij orders/<ID>/items/<ID> toont deze kolom de order
      oRouter.getRoute("orderDetail").attachPatternMatched(this._onRouteMatched, this);
      oRouter.getRoute("itemDetail").attachPatternMatched(this._onRouteMatched, this);
    },

    _onRouteMatched: function (oEvent) {
      this._sOrderId = oEvent.getParameter("arguments").orderId;
      // autoExpandSelect in manifest.json: UI5 vraagt zelf customer, status en items op
      this.getView().bindElement("/Orders(" + this._sOrderId + ")");
    },

    onItemPress: function (oEvent) {
      var sItemId = oEvent.getSource().getBindingContext().getProperty("ID");
      this.getOwnerComponent().getRouter().navTo("itemDetail", { orderId: this._sOrderId, itemId: sItemId });
    },

    onToggleFullScreen: function () {
      var oAppView = this.getOwnerComponent().getModel("appView");
      var bFull = oAppView.getProperty("/layout") === "MidColumnFullScreen";
      oAppView.setProperty("/layout", bFull ? "TwoColumnsMidExpanded" : "MidColumnFullScreen");
    },

    onClose: function () {
      this.getOwnerComponent().getRouter().navTo("orderList");
    },

    onPay: function () {
      this._invoke("pay", this._text("paid"));
    },

    onCancel: function () {
      // Eerst bevestigen: annuleren zet de voorraad terug en kan niet ongedaan gemaakt worden
      MessageBox.confirm(this._text("confirmCancel"), {
        onClose: function (sAction) {
          if (sAction === MessageBox.Action.OK) {
            this._invoke("cancel", this._text("cancelled"));
          }
        }.bind(this)
      });
    },

    // Bound action uit W4 oproepen: POST /Orders(<ID>)/OrderService.cancel
    _invoke: function (sAction, sSuccess) {
      var oContext = this.getView().getBindingContext();
      var oModel = this.getView().getModel();
      var oOperation = oModel.bindContext("OrderService." + sAction + "(...)", oContext);

      oOperation.invoke().then(function () {
        MessageToast.show(sSuccess);
        oModel.refresh();   // lijst en detail opnieuw ophalen (nieuwe status)
      }, function (oError) {
        // De melding van req.reject() in de backend
        MessageBox.error(oError.message);
      });
    },

    _text: function (sKey) {
      return this.getOwnerComponent().getModel("i18n").getResourceBundle().getText(sKey);
    }
  });
});
