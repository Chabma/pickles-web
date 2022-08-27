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
  exports.ClickEvent = void 0;
  class ClickEvent {
    constructor() {
      this.enable = false;
      this.mode = [];
    }
    load(data) {
      if (data === undefined) {
        return;
      }
      if (data.enable !== undefined) {
        this.enable = data.enable;
      }
      if (data.mode !== undefined) {
        this.mode = data.mode;
      }
    }
  }
  exports.ClickEvent = ClickEvent;
});
