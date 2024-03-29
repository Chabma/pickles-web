import type {
  IContainerPlugin,
  ICoordinates,
  IDelta,
  IDimension,
  IParticle,
  IRgb,
} from "./Interfaces";
import type { Container } from "./Container";
import type { Particle } from "./Particle";
export declare class Canvas {
  private readonly container;
  element?: HTMLCanvasElement;
  readonly size: IDimension;
  resizeFactor?: IDimension;
  private context;
  private generatedCanvas;
  private coverColor?;
  private trailFillColor?;
  private originalStyle?;
  constructor(container: Container);
  init(): void;
  loadCanvas(canvas: HTMLCanvasElement): void;
  destroy(): void;
  paint(): void;
  clear(): void;
  windowResize(): Promise<void>;
  resize(): void;
  drawConnectLine(p1: IParticle, p2: IParticle): void;
  drawGrabLine(
    particle: IParticle,
    lineColor: IRgb,
    opacity: number,
    mousePos: ICoordinates
  ): void;
  drawParticle(particle: Particle, delta: IDelta): void;
  drawPlugin(plugin: IContainerPlugin, delta: IDelta): void;
  drawParticlePlugin(
    plugin: IContainerPlugin,
    particle: Particle,
    delta: IDelta
  ): void;
  initBackground(): void;
  draw<T>(cb: (context: CanvasRenderingContext2D) => T): T | undefined;
  private initCover;
  private initTrail;
  private getPluginParticleColors;
  private initStyle;
  private paintBase;
  private lineStyle;
}
