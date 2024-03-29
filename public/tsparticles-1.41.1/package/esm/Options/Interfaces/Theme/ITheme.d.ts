import type { IOptions } from "../IOptions";
import type { IThemeDefault } from "./IThemeDefault";
import type { RecursivePartial } from "../../../Types";
export interface ITheme {
  name: string;
  default: IThemeDefault;
  options?: RecursivePartial<IOptions>;
}
