import {
  MoveDirection,
  MoveDirectionAlt,
  OutMode,
  OutModeAlt,
} from "../../../../Enums";
import type { RangeValue, RecursivePartial } from "../../../../Types";
import { Attract } from "./Attract";
import type { IDistance } from "../../../../Core";
import type { IMove } from "../../../Interfaces/Particles/Move/IMove";
import type { IOptionLoader } from "../../../Interfaces/IOptionLoader";
import { MoveAngle } from "./MoveAngle";
import { MoveGravity } from "./MoveGravity";
import { OutModes } from "./OutModes";
import { Path } from "./Path/Path";
import { Spin } from "./Spin";
import { Trail } from "./Trail";
export declare class Move implements IMove, IOptionLoader<IMove> {
  get collisions(): boolean;
  set collisions(value: boolean);
  get bounce(): boolean;
  set bounce(value: boolean);
  get out_mode(): OutMode | keyof typeof OutMode | OutModeAlt;
  set out_mode(value: OutMode | keyof typeof OutMode | OutModeAlt);
  get outMode(): OutMode | keyof typeof OutMode | OutModeAlt;
  set outMode(value: OutMode | keyof typeof OutMode | OutModeAlt);
  get noise(): Path;
  set noise(value: Path);
  angle: MoveAngle;
  attract: Attract;
  direction:
    | MoveDirection
    | keyof typeof MoveDirection
    | MoveDirectionAlt
    | number;
  distance: Partial<IDistance>;
  decay: number;
  drift: RangeValue;
  enable: boolean;
  gravity: MoveGravity;
  path: Path;
  outModes: OutModes;
  random: boolean;
  size: boolean;
  speed: RangeValue;
  spin: Spin;
  straight: boolean;
  trail: Trail;
  vibrate: boolean;
  warp: boolean;
  constructor();
  load(data?: RecursivePartial<IMove>): void;
}
