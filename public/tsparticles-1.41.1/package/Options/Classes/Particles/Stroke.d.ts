import { AnimatableColor } from "../AnimatableColor";
import type { IOptionLoader } from "../../Interfaces/IOptionLoader";
import type { IStroke } from "../../Interfaces/Particles/IStroke";
import type { RecursivePartial } from "../../../Types";
export declare class Stroke implements IStroke, IOptionLoader<IStroke> {
  color?: AnimatableColor;
  width: number;
  opacity?: number;
  constructor();
  load(data?: RecursivePartial<IStroke>): void;
}
