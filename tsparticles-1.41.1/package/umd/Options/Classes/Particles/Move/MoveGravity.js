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
  exports.MoveGravity = void 0;
  class MoveGravity {
    constructor() {
      this.acceleration = 9.81;
      this.enable = false;
      this.inverse = false;
      this.maxSpeed = 50;
    }
    load(data) {
      if (!data) {
        return;
      }
      if (data.acceleration !== undefined) {
        this.acceleration = data.acceleration;
      }
      if (data.enable !== undefined) {
        this.enable = data.enable;
      }
      if (data.inverse !== undefined) {
        this.inverse = data.inverse;
      }
      if (data.maxSpeed !== undefined) {
        this.maxSpeed = data.maxSpeed;
      }
    }
  }
  exports.MoveGravity = MoveGravity;
});