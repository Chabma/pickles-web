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
  exports.EmitterSize = void 0;
  class EmitterSize {
    constructor() {
      this.mode = "percent";
      this.height = 0;
      this.width = 0;
    }
    load(data) {
      if (data === undefined) {
        return;
      }
      if (data.mode !== undefined) {
        this.mode = data.mode;
      }
      if (data.height !== undefined) {
        this.height = data.height;
      }
      if (data.width !== undefined) {
        this.width = data.width;
      }
    }
  }
  exports.EmitterSize = EmitterSize;
});
