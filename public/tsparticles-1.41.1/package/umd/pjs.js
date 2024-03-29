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
  exports.initPjs = void 0;
  const initPjs = (engine) => {
    const particlesJS = (tagId, options) => {
      return engine.load(tagId, options);
    };
    particlesJS.load = (tagId, pathConfigJson, callback) => {
      engine
        .loadJSON(tagId, pathConfigJson)
        .then((container) => {
          if (container) {
            callback(container);
          }
        })
        .catch(() => {
          callback(undefined);
        });
    };
    particlesJS.setOnClickHandler = (callback) => {
      engine.setOnClickHandler(callback);
    };
    const pJSDom = engine.dom();
    return { particlesJS, pJSDom };
  };
  exports.initPjs = initPjs;
});
