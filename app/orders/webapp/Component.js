sap.ui.define([
  "sap/ui/core/UIComponent",
  "sap/ui/model/json/JSONModel"
], function (UIComponent, JSONModel) {
  "use strict";

  return UIComponent.extend("levelup.orders.Component", {
    metadata: {
      manifest: "json",
      interfaces: ["sap.ui.core.IAsyncContentCreation"]
    },

    init: function () {
      UIComponent.prototype.init.apply(this, arguments);
      // Klein JSON-model voor de toestand van de schermen: hoeveel kolommen toont de FCL?
      this.setModel(new JSONModel({ layout: "OneColumn" }), "appView");
      this.getRouter().initialize();
    }
  });
});
