(function (factory) {
  if (typeof module === "object" && typeof module.exports === "object") {
    var v = factory(require, exports);
    if (v !== undefined) module.exports = v;
  } else if (typeof define === "function" && define.amd) {
    define(["require", "exports"], factory);
  }
})(function (require, exports) {
  "use strict";
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.Remove = void 0;
  class Remove {
    constructor() {
      this.quantity = 2;
    }
    get particles_nb() {
      return this.quantity;
    }
    set particles_nb(value) {
      this.quantity = value;
    }
    load(data) {
      var _a;
      if (data === undefined) {
        return;
      }
      const quantity =
        (_a = data.quantity) !== null && _a !== void 0 ? _a : data.particles_nb;
      if (quantity !== undefined) {
        this.quantity = quantity;
      }
    }
  }
  exports.Remove = Remove;
});
