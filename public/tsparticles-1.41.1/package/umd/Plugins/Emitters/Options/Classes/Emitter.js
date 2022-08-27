(function (factory) {
  if (typeof module === "object" && typeof module.exports === "object") {
    var v = factory(require, exports);
    if (v !== undefined) module.exports = v;
  } else if (typeof define === "function" && define.amd) {
    define([
      "require",
      "exports",
      "../../../../Options/Classes/AnimatableColor",
      "./EmitterLife",
      "./EmitterRate",
      "./EmitterSize",
      "../../../../Utils",
    ], factory);
  }
})(function (require, exports) {
  "use strict";
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.Emitter = void 0;
  const AnimatableColor_1 = require("../../../../Options/Classes/AnimatableColor");
  const EmitterLife_1 = require("./EmitterLife");
  const EmitterRate_1 = require("./EmitterRate");
  const EmitterSize_1 = require("./EmitterSize");
  const Utils_1 = require("../../../../Utils");
  class Emitter {
    constructor() {
      this.autoPlay = true;
      this.fill = true;
      this.life = new EmitterLife_1.EmitterLife();
      this.rate = new EmitterRate_1.EmitterRate();
      this.shape = "square";
      this.startCount = 0;
    }
    load(data) {
      if (data === undefined) {
        return;
      }
      if (data.autoPlay !== undefined) {
        this.autoPlay = data.autoPlay;
      }
      if (data.size !== undefined) {
        if (this.size === undefined) {
          this.size = new EmitterSize_1.EmitterSize();
        }
        this.size.load(data.size);
      }
      if (data.direction !== undefined) {
        this.direction = data.direction;
      }
      this.domId = data.domId;
      if (data.fill !== undefined) {
        this.fill = data.fill;
      }
      this.life.load(data.life);
      this.name = data.name;
      if (data.particles !== undefined) {
        this.particles = (0, Utils_1.deepExtend)({}, data.particles);
      }
      this.rate.load(data.rate);
      if (data.shape !== undefined) {
        this.shape = data.shape;
      }
      if (data.position !== undefined) {
        this.position = {
          x: data.position.x,
          y: data.position.y,
        };
      }
      if (data.spawnColor !== undefined) {
        if (this.spawnColor === undefined) {
          this.spawnColor = new AnimatableColor_1.AnimatableColor();
        }
        this.spawnColor.load(data.spawnColor);
      }
      if (data.startCount !== undefined) {
        this.startCount = data.startCount;
      }
    }
  }
  exports.Emitter = Emitter;
});
