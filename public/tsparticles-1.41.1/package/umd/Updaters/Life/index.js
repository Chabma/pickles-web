(function (factory) {
  if (typeof module === "object" && typeof module.exports === "object") {
    var v = factory(require, exports);
    if (v !== undefined) module.exports = v;
  } else if (typeof define === "function" && define.amd) {
    define(["require", "exports", "./LifeUpdater"], factory);
  }
})(function (require, exports) {
  "use strict";
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.loadLifeUpdater = void 0;
  const LifeUpdater_1 = require("./LifeUpdater");
  async function loadLifeUpdater(engine) {
    await engine.addParticleUpdater(
      "life",
      (container) => new LifeUpdater_1.LifeUpdater(container)
    );
  }
  exports.loadLifeUpdater = loadLifeUpdater;
});
