import type {
  Container,
  ICoordinates,
  IDelta,
  IDimension,
  IHsl,
} from "../../Core";
import { Emitter } from "./Options/Classes/Emitter";
import type { Emitters } from "./Emitters";
import type { EmittersEngine } from "./EmittersEngine";
import type { IEmitter } from "./Options/Interfaces/IEmitter";
import type { IEmitterSize } from "./Options/Interfaces/IEmitterSize";
import type { RecursivePartial } from "../../Types";
/**
 * @category Emitters Plugin
 */
export declare class EmitterInstance {
  #private;
  private readonly emitters;
  private readonly container;
  position?: ICoordinates;
  size: IEmitterSize;
  options: Emitter;
  spawnColor?: IHsl;
  fill: boolean;
  readonly name?: string;
  private paused;
  private currentEmitDelay;
  private currentSpawnDelay;
  private currentDuration;
  private lifeCount;
  private duration?;
  private emitDelay?;
  private spawnDelay?;
  private readonly immortal;
  private readonly shape?;
  private readonly initialPosition?;
  private readonly particlesOptions;
  constructor(
    engine: EmittersEngine,
    emitters: Emitters,
    container: Container,
    options: RecursivePartial<IEmitter>,
    position?: ICoordinates
  );
  externalPlay(): void;
  externalPause(): void;
  play(): void;
  pause(): void;
  resize(): void;
  update(delta: IDelta): void;
  getPosition(): ICoordinates | undefined;
  getSize(): IDimension;
  private prepareToDie;
  private destroy;
  private calcPosition;
  private emit;
  private emitParticles;
  private setColorAnimation;
}
