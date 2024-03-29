import { ShapeType } from "../Enums";
import type {
  IBubbleParticleData,
  ICoordinates,
  ICoordinates3d,
  IDelta,
  IHsl,
  IParticle,
  IParticleGradientAnimation,
  IParticleHslAnimation,
  IParticleLife,
  IParticleNumericValueAnimation,
  IParticleRetinaProps,
  IParticleRoll,
  IParticleSpin,
  IParticleTiltValueAnimation,
  IParticleValueAnimation,
  IParticleWobble,
  IRgb,
  IShapeValues,
} from "./Interfaces";
import { Vector, Vector3d } from "./Utils";
import type { Container } from "./Container";
import type { Engine } from "../engine";
import type { IParticles } from "../Options/Interfaces/Particles/IParticles";
import { ParticlesOptions } from "../Options/Classes/Particles/ParticlesOptions";
import type { RecursivePartial } from "../Types";
import type { Stroke } from "../Options/Classes/Particles/Stroke";
export declare class Particle implements IParticle {
  #private;
  readonly id: number;
  readonly container: Container;
  readonly group?: string | undefined;
  destroyed: boolean;
  lastPathTime: number;
  misplaced: boolean;
  spawning: boolean;
  splitCount: number;
  unbreakable: boolean;
  readonly pathDelay: number;
  readonly sides: number;
  readonly options: ParticlesOptions;
  readonly life: IParticleLife;
  roll?: IParticleRoll;
  wobble?: IParticleWobble;
  backColor?: IHsl;
  close: boolean;
  fill: boolean;
  randomIndexData?: number;
  gradient?: IParticleGradientAnimation;
  rotate?: IParticleValueAnimation<number>;
  tilt?: IParticleTiltValueAnimation;
  color?: IParticleHslAnimation;
  opacity?: IParticleNumericValueAnimation;
  strokeWidth?: number;
  stroke?: Stroke;
  strokeColor?: IParticleHslAnimation;
  readonly moveDecay: number;
  readonly direction: number;
  readonly position: Vector3d;
  readonly offset: Vector;
  readonly shadowColor: IRgb | undefined;
  readonly size: IParticleNumericValueAnimation;
  readonly velocity: Vector;
  readonly shape: ShapeType | string;
  readonly spin?: IParticleSpin;
  readonly initialPosition: Vector;
  readonly initialVelocity: Vector;
  readonly shapeData?: IShapeValues;
  readonly bubble: IBubbleParticleData;
  readonly zIndexFactor: number;
  readonly retina: IParticleRetinaProps;
  constructor(
    engine: Engine,
    id: number,
    container: Container,
    position?: ICoordinates,
    overrideOptions?: RecursivePartial<IParticles>,
    group?: string | undefined
  );
  isVisible(): boolean;
  isInsideCanvas(): boolean;
  draw(delta: IDelta): void;
  getPosition(): ICoordinates3d;
  getRadius(): number;
  getMass(): number;
  getFillColor(): IHsl | undefined;
  getStrokeColor(): IHsl | undefined;
  destroy(override?: boolean): void;
  reset(): void;
  private split;
  private calcPosition;
  private checkOverlap;
  private calculateVelocity;
  private loadShapeData;
  private loadLife;
}
