import { AnimationOptions } from "../../AnimationOptions";
/**
 * @category Options
 */
export class OpacityAnimation extends AnimationOptions {
  constructor() {
    super();
    this.destroy = "none" /* none */;
    this.enable = false;
    this.speed = 2;
    this.startValue = "random" /* random */;
    this.sync = false;
  }
  /**
   *
   * @deprecated this property is obsolete, please use the new minimumValue
   */
  get opacity_min() {
    return this.minimumValue;
  }
  /**
   *
   * @deprecated this property is obsolete, please use the new minimumValue
   * @param value
   */
  set opacity_min(value) {
    this.minimumValue = value;
  }
  load(data) {
    var _a;
    if (data === undefined) {
      return;
    }
    super.load(data);
    if (data.destroy !== undefined) {
      this.destroy = data.destroy;
    }
    if (data.enable !== undefined) {
      this.enable = data.enable;
    }
    this.minimumValue =
      (_a = data.minimumValue) !== null && _a !== void 0
        ? _a
        : data.opacity_min;
    if (data.speed !== undefined) {
      this.speed = data.speed;
    }
    if (data.startValue !== undefined) {
      this.startValue = data.startValue;
    }
    if (data.sync !== undefined) {
      this.sync = data.sync;
    }
  }
}
