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
  exports.RollLight = void 0;
  class RollLight {
    constructor() {
      this.enable = false;
      this.value = 0;
    }
    load(data) {
      if (!data) {
        return;
      }
      if (data.enable !== undefined) {
        this.enable = data.enable;
      }
      if (data.value !== undefined) {
        this.value = data.value;
      }
    }
  }
  exports.RollLight = RollLight;
});
