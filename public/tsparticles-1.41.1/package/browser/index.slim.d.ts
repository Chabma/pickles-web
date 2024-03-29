import { Engine } from "./engine";
import type { IOptions } from "./Options/Interfaces/IOptions";
import type { RecursivePartial } from "./Types";
declare const tsParticles: Engine;
declare const particlesJS: import("./pjs").IParticlesJS,
  pJSDom: import("./Core").Container[];
export * from "./Core";
export * from "./Core/Container";
export * from "./Enums";
export { Engine, Engine as Main };
export * from "./Utils";
export * from "./Types";
export { tsParticles, particlesJS, pJSDom };
export { IOptions };
export declare type ISourceOptions = RecursivePartial<IOptions>;
