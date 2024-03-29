(function (factory) {
  if (typeof module === "object" && typeof module.exports === "object") {
    var v = factory(require, exports);
    if (v !== undefined) module.exports = v;
  } else if (typeof define === "function" && define.amd) {
    define(["require", "exports", "../../../../Utils"], factory);
  }
})(function (require, exports) {
  "use strict";
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.Spin = void 0;
  const Utils_1 = require("../../../../Utils");
  class Spin {
    constructor() {
      this.acceleration = 0;
      this.enable = false;
    }
    load(data) {
      if (!data) {
        return;
      }
      if (data.acceleration !== undefined) {
        this.acceleration = (0, Utils_1.setRangeValue)(data.acceleration);
      }
      if (data.enable !== undefined) {
        this.enable = data.enable;
      }
      this.position = data.position
        ? (0, Utils_1.deepExtend)({}, data.position)
        : undefined;
    }
  }
  exports.Spin = Spin;
});
