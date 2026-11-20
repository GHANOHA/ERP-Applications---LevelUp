sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/core/routing/History",
  "sap/m/MessageToast",
  "sap/m/MessageBox",
  "sap/ui/core/Messaging",
  "levelup/shop/model/formatter"
], function (Controller, History, MessageToast, MessageBox, Messaging, formatter) {
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
    },

    // ---------------------------------------------------------------
    // W7 · Review-dialog uit een fragment
    // ---------------------------------------------------------------
    onOpenReviewDialog: function () {
      // loadFragment maakt de dialog één keer aan en hangt hem aan deze view
      // (zelfde modellen, ids met byId bereikbaar, handlers in deze controller)
      if (!this._pReviewDialog) {
        this._pReviewDialog = this.loadFragment({ name: "levelup.shop.view.fragment.ReviewDialog" });
      }
      this._pReviewDialog.then(function (oDialog) {
        this.byId("reviewCustomer").setSelectedKey(null);
        this.byId("reviewRating").setValue(5);
        this.byId("reviewComment").setValue("");
        oDialog.open();
      }.bind(this));
    },

    onCloseReviewDialog: function () {
      this.byId("reviewDialog").close();
    },

    onSaveReview: function () {
      var sCustomer = this.byId("reviewCustomer").getSelectedKey();
      var sComment = this.byId("reviewComment").getValue().trim();

      // Snelle controle in de UI (de echte regels staan in de backend, W4)
      if (!sCustomer || !sComment) {
        MessageToast.show(this._text("fillAll"));
        return;
      }

      // Nieuwe review in de lijst van deze game: POST /Games(<ID>)/reviews
      var oBinding = this.byId("reviewList").getBinding("items");
      oBinding.attachEventOnce("createCompleted", function (oEvent) {
        if (oEvent.getParameter("success")) {
          MessageToast.show(this._text("reviewSaved"));
          this.byId("reviewDialog").close();
        } else {
          // De backend weigerde (bv. minder dan 10 tekens, of klant kocht de game niet).
          // Toon de melding en verwijder de mislukte review uit de lijst.
          var aMessages = Messaging.getMessageModel().getData();
          var sMessage = aMessages.length ? aMessages[aMessages.length - 1].getMessage() : this._text("reviewError");
          MessageBox.error(sMessage);
          oEvent.getParameter("context").delete();
        }
      }, this);
      var oContext = oBinding.create({
        customer_ID: sCustomer,
        rating: this.byId("reviewRating").getValue(),
        comment: sComment
      });
      // created() faalt ook als we de mislukte review verwijderen: dat is geen fout
      oContext.created().catch(function () {});
    },

    _text: function (sKey) {
      return this.getOwnerComponent().getModel("i18n").getResourceBundle().getText(sKey);
    }
  });
});
