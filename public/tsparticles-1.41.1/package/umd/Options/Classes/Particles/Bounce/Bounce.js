(function (factory) {
  if (typeof module === "object" && typeof module.exports === "object") {
    var v = factory(require, exports);
    if (v !== undefined) module.exports = v;
  } else if (typeof define === "function" && define.amd) {
    define(["require", "exports", "./BounceFactor"], factory);
  }
})(function (require, exports) {
  "use strict";
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.Bounce = void 0;
  const BounceFactor_1 = require("./BounceFactor");
  class Bounce {
    constructor() {
      this.horizontal = new BounceFactor_1.BounceFactor();
      this.vertical = new BounceFactor_1.BounceFactor();
    }
    load(data) {
      if (!data) {
        return;
      }
      this.horizontal.load(data.horizontal);
      this.vertical.load(data.vertical);
    }
  }
  exports.Bounce = Bounce;
});
