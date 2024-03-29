import type { IGrabLinks } from "../../../Interfaces/Interactivity/Modes/IGrabLinks";
import type { IOptionLoader } from "../../../Interfaces/IOptionLoader";
import { OptionsColor } from "../../OptionsColor";
import type { RecursivePartial } from "../../../../Types";
/**
 * @category Options
 */
export declare class GrabLinks
  implements IGrabLinks, IOptionLoader<IGrabLinks>
{
  blink: boolean;
  color?: OptionsColor;
  consent: boolean;
  opacity: number;
  constructor();
  load(data?: RecursivePartial<IGrabLinks>): void;
}
