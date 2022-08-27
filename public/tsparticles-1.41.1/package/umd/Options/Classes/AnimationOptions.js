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
  exports.AnimationOptions = void 0;
  class AnimationOptions {
    constructor() {
      this.count = 0;
      this.enable = false;
      this.speed = 1;
      this.sync = false;
    }
    load(data) {
      if (!data) {
        return;
      }
      if (data.count !== undefined) {
        this.count = data.count;
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
  exports.AnimationOptions = AnimationOptions;
});
