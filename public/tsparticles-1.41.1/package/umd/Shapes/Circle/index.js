(function (factory) {
  if (typeof module === "object" && typeof module.exports === "object") {
    var v = factory(require, exports);
    if (v !== undefined) module.exports = v;
  } else if (typeof define === "function" && define.amd) {
    define(["require", "exports", "./CircleDrawer"], factory);
  }
})(function (require, exports) {
  "use strict";
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.loadCircleShape = void 0;
  const CircleDrawer_1 = require("./CircleDrawer");
  async function loadCircleShape(engine) {
    await engine.addShape("circle", new CircleDrawer_1.CircleDrawer());
  }
  exports.loadCircleShape = loadCircleShape;
});
