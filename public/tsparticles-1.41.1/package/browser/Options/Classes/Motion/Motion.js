import { MotionReduce } from "./MotionReduce";
/**
 * [[include:Options/Motion.md]]
 * @category Options
 */
export class Motion {
  constructor() {
    this.disable = false;
    this.reduce = new MotionReduce();
  }
  load(data) {
    if (!data) {
      return;
    }
    if (data.disable !== undefined) {
      this.disable = data.disable;
    }
    this.reduce.load(data.reduce);
  }
}
