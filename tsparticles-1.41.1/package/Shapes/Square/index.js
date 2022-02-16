"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadSquareShape = void 0;
const SquareDrawer_1 = require("./SquareDrawer");
async function loadSquareShape(engine) {
    const drawer = new SquareDrawer_1.SquareDrawer();
    await engine.addShape("edge", drawer);
    await engine.addShape("square", drawer);
}
exports.loadSquareShape = loadSquareShape;
