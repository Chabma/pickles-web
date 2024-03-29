import { Engine } from "./engine";
import type { IAbsorberOptions } from "./Plugins/Absorbers/Options/Interfaces/IAbsorberOptions";
import type { IEmitterOptions } from "./Plugins/Emitters/Options/Interfaces/IEmitterOptions";
import type { IPolygonMaskOptions } from "./Plugins/PolygonMask/Options/Interfaces/IPolygonMaskOptions";
import type { IOptions as ISlimOptions } from "./Options/Interfaces/IOptions";
import type { RecursivePartial } from "./Types";
declare const tsParticles: Engine;
declare const particlesJS: import("./pjs").IParticlesJS,
  pJSDom: import("./Core").Container[];
export * from "./Core";
export * from "./Core/Container";
export * from "./Enums";
export * from "./Plugins/Absorbers/Enums";
export * from "./Plugins/Emitters/Enums";
export * from "./Plugins/PolygonMask/Enums";
export { Engine, Engine as Main };
export * from "./Utils";
export * from "./Types";
export { particlesJS, pJSDom, tsParticles };
export declare type IOptions = ISlimOptions &
  IAbsorberOptions &
  IEmitterOptions &
  IPolygonMaskOptions;
export declare type ISourceOptions = RecursivePartial<IOptions>;
