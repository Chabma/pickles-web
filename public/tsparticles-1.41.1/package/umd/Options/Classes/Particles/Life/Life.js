(function (factory) {
  if (typeof module === "object" && typeof module.exports === "object") {
    var v = factory(require, exports);
    if (v !== undefined) module.exports = v;
  } else if (typeof define === "function" && define.amd) {
    define(["require", "exports", "./LifeDelay", "./LifeDuration"], factory);
  }
})(function (require, exports) {
  "use strict";
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.Life = void 0;
  const LifeDelay_1 = require("./LifeDelay");
  const LifeDuration_1 = require("./LifeDuration");
  class Life {
    constructor() {
      this.count = 0;
      this.delay = new LifeDelay_1.LifeDelay();
      this.duration = new LifeDuration_1.LifeDuration();
    }
    load(data) {
      if (data === undefined) {
        return;
      }
      if (data.count !== undefined) {
        this.count = data.count;
      }
      this.delay.load(data.delay);
      this.duration.load(data.duration);
    }
  }
  exports.Life = Life;
});
