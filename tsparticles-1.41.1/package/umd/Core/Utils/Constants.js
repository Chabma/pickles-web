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
  exports.Constants = void 0;
  class Constants {}
  exports.Constants = Constants;
  Constants.generatedAttribute = "generated";
  Constants.randomColorValue = "random";
  Constants.midColorValue = "mid";
  Constants.touchEndEvent = "touchend";
  Constants.mouseDownEvent = "mousedown";
  Constants.mouseUpEvent = "mouseup";
  Constants.mouseMoveEvent = "mousemove";
  Constants.touchStartEvent = "touchstart";
  Constants.touchMoveEvent = "touchmove";
  Constants.mouseLeaveEvent = "mouseleave";
  Constants.mouseOutEvent = "mouseout";
  Constants.touchCancelEvent = "touchcancel";
  Constants.resizeEvent = "resize";
  Constants.visibilityChangeEvent = "visibilitychange";
  Constants.noPolygonDataLoaded = "No polygon data loaded.";
  Constants.noPolygonFound =
    "No polygon found, you need to specify SVG url in config.";
});
