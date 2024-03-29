(function (factory) {
  if (typeof module === "object" && typeof module.exports === "object") {
    var v = factory(require, exports);
    if (v !== undefined) module.exports = v;
  } else if (typeof define === "function" && define.amd) {
    define(["require", "exports", "./OutOfCanvasUpdater"], factory);
  }
})(function (require, exports) {
  "use strict";
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.loadOutModesUpdater = void 0;
  const OutOfCanvasUpdater_1 = require("./OutOfCanvasUpdater");
  async function loadOutModesUpdater(engine) {
    await engine.addParticleUpdater(
      "outModes",
      (container) => new OutOfCanvasUpdater_1.OutOfCanvasUpdater(container)
    );
  }
  exports.loadOutModesUpdater = loadOutModesUpdater;
});
