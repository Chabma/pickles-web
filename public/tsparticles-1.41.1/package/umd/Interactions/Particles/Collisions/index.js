(function (factory) {
  if (typeof module === "object" && typeof module.exports === "object") {
    var v = factory(require, exports);
    if (v !== undefined) module.exports = v;
  } else if (typeof define === "function" && define.amd) {
    define(["require", "exports", "./Collider"], factory);
  }
})(function (require, exports) {
  "use strict";
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.loadParticlesCollisionsInteraction = void 0;
  const Collider_1 = require("./Collider");
  async function loadParticlesCollisionsInteraction(engine) {
    await engine.addInteractor(
      "particlesCollisions",
      (container) => new Collider_1.Collider(container)
    );
  }
  exports.loadParticlesCollisionsInteraction =
    loadParticlesCollisionsInteraction;
});
