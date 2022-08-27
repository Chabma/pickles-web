(function (factory) {
  if (typeof module === "object" && typeof module.exports === "object") {
    var v = factory(require, exports);
    if (v !== undefined) module.exports = v;
  } else if (typeof define === "function" && define.amd) {
    define(["require", "exports", "./RollUpdater"], factory);
  }
})(function (require, exports) {
  "use strict";
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.loadRollUpdater = void 0;
  const RollUpdater_1 = require("./RollUpdater");
  async function loadRollUpdater(engine) {
    await engine.addParticleUpdater(
      "roll",
      () => new RollUpdater_1.RollUpdater()
    );
  }
  exports.loadRollUpdater = loadRollUpdater;
});
