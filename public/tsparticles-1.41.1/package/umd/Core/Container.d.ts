import { FrameManager, Vector } from "./Utils";
import type {
  IAttract,
  IBubble,
  IContainerInteractivity,
  IContainerPlugin,
  IMovePathGenerator,
  IRepulse,
  IShapeDrawer,
} from "./Interfaces";
import { Canvas } from "./Canvas";
import type { Engine } from "../engine";
import type { IOptions } from "../Options/Interfaces/IOptions";
import { Options } from "../Options/Classes/Options";
import { Particle } from "./Particle";
import { Particles } from "./Particles";
import type { RecursivePartial } from "../Types";
import { Retina } from "./Retina";
export declare class Container {
  #private;
  readonly id: string;
  started: boolean;
  destroyed: boolean;
  density: number;
  duration: number;
  pageHidden: boolean;
  lastFrameTime?: number;
  lifeTime: number;
  fpsLimit: number;
  interactivity: IContainerInteractivity;
  bubble: IBubble;
  repulse: IRepulse;
  attract: IAttract;
  zLayers: number;
  responsiveMaxWidth?: number;
  get options(): Options;
  get sourceOptions(): RecursivePartial<IOptions> | undefined;
  actualOptions: Options;
  readonly retina: Retina;
  readonly canvas: Canvas;
  readonly particles: Particles;
  readonly drawer: FrameManager;
  readonly drawers: Map<string, IShapeDrawer>;
  readonly plugins: Map<string, IContainerPlugin>;
  pathGenerator: IMovePathGenerator;
  private _options;
  private _sourceOptions;
  private readonly _initialSourceOptions;
  private paused;
  private firstStart;
  private currentTheme?;
  private drawAnimationFrame?;
  private readonly presets;
  private readonly eventListeners;
  private readonly intersectionObserver?;
  constructor(
    engine: Engine,
    id: string,
    sourceOptions?: RecursivePartial<IOptions>,
    ...presets: string[]
  );
  play(force?: boolean): void;
  pause(): void;
  draw(force: boolean): void;
  getAnimationStatus(): boolean;
  setNoise(
    noiseOrGenerator?: IMovePathGenerator | ((particle: Particle) => Vector),
    init?: () => void,
    update?: () => void
  ): void;
  setPath(
    pathOrGenerator?: IMovePathGenerator | ((particle: Particle) => Vector),
    init?: () => void,
    update?: () => void
  ): void;
  destroy(): void;
  exportImg(callback: BlobCallback): void;
  exportImage(callback: BlobCallback, type?: string, quality?: number): void;
  exportConfiguration(): string;
  refresh(): Promise<void>;
  reset(): Promise<void>;
  stop(): void;
  loadTheme(name?: string): Promise<void>;
  start(): Promise<void>;
  addClickHandler(callback: (evt: Event, particles?: Particle[]) => void): void;
  updateActualOptions(): boolean;
  init(): Promise<void>;
  private intersectionManager;
}
