import type { IParticle, IShapeDrawer } from "../../Core";
/**
 * @category Shape Drawers
 */
export declare class SquareDrawer implements IShapeDrawer {
  getSidesCount(): number;
  draw(
    context: CanvasRenderingContext2D,
    particle: IParticle,
    radius: number
  ): void;
}
