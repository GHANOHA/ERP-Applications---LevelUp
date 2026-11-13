sap.ui.define([
  "sap/ui/core/UIComponent"
], function (UIComponent) {
  "use strict";

  return UIComponent.extend("levelup.shop.Component", {
    metadata: {
      manifest: "json",
      interfaces: ["sap.ui.core.IAsyncContentCreation"]
    },

    init: function () {
      // eerst de standaard-initialisatie (leest manifest.json, maakt de modellen)
      UIComponent.prototype.init.apply(this, arguments);
      // dan de router starten: die kijkt naar de URL en toont de juiste view
      this.getRouter().initialize();
    }
  });
});
