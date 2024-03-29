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
  exports.FrameManager = void 0;
  class FrameManager {
    constructor(container) {
      this.container = container;
    }
    async nextFrame(timestamp) {
      var _a;
      try {
        const container = this.container;
        if (
          container.lastFrameTime !== undefined &&
          timestamp < container.lastFrameTime + 1000 / container.fpsLimit
        ) {
          container.draw(false);
          return;
        }
        (_a = container.lastFrameTime) !== null && _a !== void 0
          ? _a
          : (container.lastFrameTime = timestamp);
        const deltaValue = timestamp - container.lastFrameTime;
        const delta = {
          value: deltaValue,
          factor: (60 * deltaValue) / 1000,
        };
        container.lifeTime += delta.value;
        container.lastFrameTime = timestamp;
        if (deltaValue > 1000) {
          container.draw(false);
          return;
        }
        await container.particles.draw(delta);
        if (container.duration > 0 && container.lifeTime > container.duration) {
          container.destroy();
          return;
        }
        if (container.getAnimationStatus()) {
          container.draw(false);
        }
      } catch (e) {
        console.error("tsParticles error in animation loop", e);
      }
    }
  }
  exports.FrameManager = FrameManager;
});
