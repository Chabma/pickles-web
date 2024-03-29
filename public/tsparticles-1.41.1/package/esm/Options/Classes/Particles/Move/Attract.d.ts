import type { IAttract } from "../../../Interfaces/Particles/Move/IAttract";
import type { ICoordinates } from "../../../../Core";
import type { IOptionLoader } from "../../../Interfaces/IOptionLoader";
import type { RecursivePartial } from "../../../../Types";
export declare class Attract implements IAttract, IOptionLoader<IAttract> {
  get rotateX(): number;
  set rotateX(value: number);
  get rotateY(): number;
  set rotateY(value: number);
  distance: number;
  enable: boolean;
  rotate: ICoordinates;
  constructor();
  load(data?: RecursivePartial<IAttract>): void;
}
