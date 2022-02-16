(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./ImageDrawer"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.loadImageShape = void 0;
    const ImageDrawer_1 = require("./ImageDrawer");
    async function loadImageShape(engine) {
        const imageDrawer = new ImageDrawer_1.ImageDrawer();
        await engine.addShape("image", imageDrawer);
        await engine.addShape("images", imageDrawer);
    }
    exports.loadImageShape = loadImageShape;
});
