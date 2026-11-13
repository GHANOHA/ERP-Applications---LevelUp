sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/core/routing/History",
  "levelup/shop/model/formatter"
], function (Controller, History, formatter) {
  "use strict";

  return Controller.extend("levelup.shop.controller.GameDetail", {
    formatter: formatter,

    onInit: function () {
      // Telkens de route "gameDetail" geraakt wordt, binden we de view aan die game
      this.getOwnerComponent().getRouter().getRoute("gameDetail")
        .attachPatternMatched(this._onRouteMatched, this);
    },

    _onRouteMatched: function (oEvent) {
      var sGameId = oEvent.getParameter("arguments").gameId;
      this.getView().bindElement({
        path: "/Games(" + sGameId + ")",
        parameters: { $expand: "genre,platform" }
      });
    },

    onNavBack: function () {
      // Terug in de browsergeschiedenis, of naar de lijst als er geen geschiedenis is
      if (History.getInstance().getPreviousHash() !== undefined) {
        window.history.go(-1);
      } else {
        this.getOwnerComponent().getRouter().navTo("gameList", {}, true);
      }
    }
  });
});
