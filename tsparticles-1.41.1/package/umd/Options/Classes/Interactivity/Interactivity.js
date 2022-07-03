(function (factory) {
  if (typeof module === "object" && typeof module.exports === "object") {
    var v = factory(require, exports);
    if (v !== undefined) module.exports = v;
  } else if (typeof define === "function" && define.amd) {
    define(["require", "exports", "./Events/Events", "./Modes/Modes"], factory);
  }
})(function (require, exports) {
  "use strict";
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.Interactivity = void 0;
  const Events_1 = require("./Events/Events");
  const Modes_1 = require("./Modes/Modes");
  class Interactivity {
    constructor() {
      this.detectsOn = "window";
      this.events = new Events_1.Events();
      this.modes = new Modes_1.Modes();
    }
    get detect_on() {
      return this.detectsOn;
    }
    set detect_on(value) {
      this.detectsOn = value;
    }
    load(data) {
      var _a, _b, _c;
      if (data === undefined) {
        return;
      }
      const detectsOn =
        (_a = data.detectsOn) !== null && _a !== void 0 ? _a : data.detect_on;
      if (detectsOn !== undefined) {
        this.detectsOn = detectsOn;
      }
      this.events.load(data.events);
      this.modes.load(data.modes);
      if (
        ((_c =
          (_b = data.modes) === null || _b === void 0 ? void 0 : _b.slow) ===
          null || _c === void 0
          ? void 0
          : _c.active) === true
      ) {
        if (this.events.onHover.mode instanceof Array) {
          if (this.events.onHover.mode.indexOf("slow") < 0) {
            this.events.onHover.mode.push("slow");
          }
        } else if (this.events.onHover.mode !== "slow") {
          this.events.onHover.mode = [this.events.onHover.mode, "slow"];
        }
      }
    }
  }
  exports.Interactivity = Interactivity;
});
