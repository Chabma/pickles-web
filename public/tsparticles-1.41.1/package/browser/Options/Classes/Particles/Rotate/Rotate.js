import { RotateAnimation } from "./RotateAnimation";
import { ValueWithRandom } from "../../ValueWithRandom";
/**
 * [[include:Options/Particles/Rotate.md]]
 * @category Options
 */
export class Rotate extends ValueWithRandom {
  constructor() {
    super();
    this.animation = new RotateAnimation();
    this.direction = "clockwise" /* clockwise */;
    this.path = false;
    this.value = 0;
  }
  load(data) {
    if (!data) {
      return;
    }
    super.load(data);
    if (data.direction !== undefined) {
      this.direction = data.direction;
    }
    this.animation.load(data.animation);
    if (data.path !== undefined) {
      this.path = data.path;
    }
  }
}
