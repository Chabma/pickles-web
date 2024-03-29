(function (factory) {
  if (typeof module === "object" && typeof module.exports === "object") {
    var v = factory(require, exports);
    if (v !== undefined) module.exports = v;
  } else if (typeof define === "function" && define.amd) {
    define(["require", "exports", "./StarDrawer"], factory);
  }
})(function (require, exports) {
  "use strict";
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.loadStarShape = void 0;
  const StarDrawer_1 = require("./StarDrawer");
  async function loadStarShape(engine) {
    await engine.addShape("star", new StarDrawer_1.StarDrawer());
  }
  exports.loadStarShape = loadStarShape;
});
