import type {
  Container,
  IContainerPlugin,
  ICoordinates,
  IDelta,
  IDimension,
  Particle,
} from "../../Core";
import type { IPolygonMaskOptions } from "./Types";
import type { ISvgPath } from "./Interfaces/ISvgPath";
import { OutModeDirection } from "../../Enums";
import { PolygonMask } from "./Options/Classes/PolygonMask";
import type { RecursivePartial } from "../../Types";
export declare class PolygonMaskInstance implements IContainerPlugin {
  private readonly container;
  redrawTimeout?: number;
  raw?: ICoordinates[];
  paths?: ISvgPath[];
  dimension: IDimension;
  offset?: ICoordinates;
  readonly path2DSupported: boolean;
  readonly options: PolygonMask;
  private polygonMaskMoveRadius;
  constructor(container: Container);
  initAsync(options?: RecursivePartial<IPolygonMaskOptions>): Promise<void>;
  resize(): void;
  stop(): void;
  particlesInitialization(): boolean;
  particlePosition(position?: ICoordinates): ICoordinates | undefined;
  particleBounce(
    particle: Particle,
    delta: IDelta,
    direction: OutModeDirection
  ): boolean;
  clickPositionValid(position: ICoordinates): boolean;
  draw(context: CanvasRenderingContext2D): void;
  private polygonBounce;
  private checkInsidePolygon;
  private parseSvgPath;
  private downloadSvgPath;
  private drawPoints;
  private randomPoint;
  private getRandomPoint;
  private getRandomPointByLength;
  private getEquidistantPointByIndex;
  private getPointByIndex;
  private createPath2D;
  private initRawData;
}
