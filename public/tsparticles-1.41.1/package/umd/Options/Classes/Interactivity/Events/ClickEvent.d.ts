import type { RecursivePartial, SingleOrMultiple } from "../../../../Types";
import { ClickMode } from "../../../../Enums";
import type { IClickEvent } from "../../../Interfaces/Interactivity/Events/IClickEvent";
import type { IOptionLoader } from "../../../Interfaces/IOptionLoader";
export declare class ClickEvent
  implements IClickEvent, IOptionLoader<IClickEvent>
{
  enable: boolean;
  mode: SingleOrMultiple<ClickMode | keyof typeof ClickMode | string>;
  constructor();
  load(data?: RecursivePartial<IClickEvent>): void;
}
