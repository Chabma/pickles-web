(function (factory) {
  if (typeof module === "object" && typeof module.exports === "object") {
    var v = factory(require, exports);
    if (v !== undefined) module.exports = v;
  } else if (typeof define === "function" && define.amd) {
    define(["require", "exports", "../../ValueWithRandom"], factory);
  }
})(function (require, exports) {
  "use strict";
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.OrbitRotation = void 0;
  const ValueWithRandom_1 = require("../../ValueWithRandom");
  class OrbitRotation extends ValueWithRandom_1.ValueWithRandom {
    constructor() {
      super();
      this.value = 45;
      this.random.enable = false;
      this.random.minimumValue = 0;
    }
    load(data) {
      if (data === undefined) {
        return;
      }
      super.load(data);
    }
  }
  exports.OrbitRotation = OrbitRotation;
});
