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
  exports.RotateAnimation = void 0;
  class RotateAnimation {
    constructor() {
      this.enable = false;
      this.speed = 0;
      this.sync = false;
    }
    load(data) {
      if (data === undefined) {
        return;
      }
      if (data.enable !== undefined) {
        this.enable = data.enable;
      }
      if (data.speed !== undefined) {
        this.speed = data.speed;
      }
      if (data.sync !== undefined) {
        this.sync = data.sync;
      }
    }
  }
  exports.RotateAnimation = RotateAnimation;
});
