(function (factory) {
  if (typeof module === "object" && typeof module.exports === "object") {
    var v = factory(require, exports);
    if (v !== undefined) module.exports = v;
  } else if (typeof define === "function" && define.amd) {
    define(["require", "exports", "./SizeUpdater"], factory);
  }
})(function (require, exports) {
  "use strict";
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.loadSizeUpdater = void 0;
  const SizeUpdater_1 = require("./SizeUpdater");
  async function loadSizeUpdater(engine) {
    await engine.addParticleUpdater(
      "size",
      () => new SizeUpdater_1.SizeUpdater()
    );
  }
  exports.loadSizeUpdater = loadSizeUpdater;
});
