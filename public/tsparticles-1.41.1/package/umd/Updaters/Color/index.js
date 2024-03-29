(function (factory) {
  if (typeof module === "object" && typeof module.exports === "object") {
    var v = factory(require, exports);
    if (v !== undefined) module.exports = v;
  } else if (typeof define === "function" && define.amd) {
    define(["require", "exports", "./ColorUpdater"], factory);
  }
})(function (require, exports) {
  "use strict";
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.loadColorUpdater = void 0;
  const ColorUpdater_1 = require("./ColorUpdater");
  async function loadColorUpdater(engine) {
    await engine.addParticleUpdater(
      "color",
      (container) => new ColorUpdater_1.ColorUpdater(container)
    );
  }
  exports.loadColorUpdater = loadColorUpdater;
});
