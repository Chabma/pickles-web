"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmitterLife = void 0;
class EmitterLife {
  constructor() {
    this.wait = false;
  }
  load(data) {
    if (data === undefined) {
      return;
    }
    if (data.count !== undefined) {
      this.count = data.count;
    }
    if (data.delay !== undefined) {
      this.delay = data.delay;
    }
    if (data.duration !== undefined) {
      this.duration = data.duration;
    }
    if (data.wait !== undefined) {
      this.wait = data.wait;
    }
  }
}
exports.EmitterLife = EmitterLife;
