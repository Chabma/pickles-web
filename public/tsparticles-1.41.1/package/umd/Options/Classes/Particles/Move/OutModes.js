(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.OutModes = void 0;
    class OutModes {
        constructor() {
            this.default = "out";
        }
        load(data) {
            var _a, _b, _c, _d;
            if (!data) {
                return;
            }
            if (data.default !== undefined) {
                this.default = data.default;
            }
            this.bottom = (_a = data.bottom) !== null && _a !== void 0 ? _a : data.default;
            this.left = (_b = data.left) !== null && _b !== void 0 ? _b : data.default;
            this.right = (_c = data.right) !== null && _c !== void 0 ? _c : data.default;
            this.top = (_d = data.top) !== null && _d !== void 0 ? _d : data.default;
        }
    }
    exports.OutModes = OutModes;
});
