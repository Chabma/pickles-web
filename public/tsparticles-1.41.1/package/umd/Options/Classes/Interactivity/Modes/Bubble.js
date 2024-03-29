(function (factory) {
  if (typeof module === "object" && typeof module.exports === "object") {
    var v = factory(require, exports);
    if (v !== undefined) module.exports = v;
  } else if (typeof define === "function" && define.amd) {
    define(["require", "exports", "./BubbleBase", "./BubbleDiv"], factory);
  }
})(function (require, exports) {
  "use strict";
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.Bubble = void 0;
  const BubbleBase_1 = require("./BubbleBase");
  const BubbleDiv_1 = require("./BubbleDiv");
  class Bubble extends BubbleBase_1.BubbleBase {
    load(data) {
      super.load(data);
      if (!(data !== undefined && data.divs !== undefined)) {
        return;
      }
      if (data.divs instanceof Array) {
        this.divs = data.divs.map((s) => {
          const tmp = new BubbleDiv_1.BubbleDiv();
          tmp.load(s);
          return tmp;
        });
      } else {
        if (this.divs instanceof Array || !this.divs) {
          this.divs = new BubbleDiv_1.BubbleDiv();
        }
        this.divs.load(data.divs);
      }
    }
  }
  exports.Bubble = Bubble;
});
