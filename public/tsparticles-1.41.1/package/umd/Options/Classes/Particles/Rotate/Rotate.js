(function (factory) {
  if (typeof module === "object" && typeof module.exports === "object") {
    var v = factory(require, exports);
    if (v !== undefined) module.exports = v;
  } else if (typeof define === "function" && define.amd) {
    define([
      "require",
      "exports",
      "./RotateAnimation",
      "../../ValueWithRandom",
    ], factory);
  }
})(function (require, exports) {
  "use strict";
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.Rotate = void 0;
  const RotateAnimation_1 = require("./RotateAnimation");
  const ValueWithRandom_1 = require("../../ValueWithRandom");
  class Rotate extends ValueWithRandom_1.ValueWithRandom {
    constructor() {
      super();
      this.animation = new RotateAnimation_1.RotateAnimation();
      this.direction = "clockwise";
      this.path = false;
      this.value = 0;
    }
    load(data) {
      if (!data) {
        return;
      }
      super.load(data);
      if (data.direction !== undefined) {
        this.direction = data.direction;
      }
      this.animation.load(data.animation);
      if (data.path !== undefined) {
        this.path = data.path;
      }
    }
  }
  exports.Rotate = Rotate;
});
