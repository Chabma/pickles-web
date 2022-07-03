import type {
  RangeValue,
  RecursivePartial,
  SingleOrMultiple,
} from "../../Types";
import type { IBackground } from "./Background/IBackground";
import type { IBackgroundMask } from "./BackgroundMask/IBackgroundMask";
import type { IFullScreen } from "./FullScreen/IFullScreen";
import type { IInteractivity } from "./Interactivity/IInteractivity";
import type { IManualParticle } from "./IManualParticle";
import type { IMotion } from "./Motion/IMotion";
import type { IParticles } from "./Particles/IParticles";
import type { IResponsive } from "./IResponsive";
import type { ITheme } from "./Theme/ITheme";
export interface IOptions {
  autoPlay: boolean;
  background: IBackground;
  backgroundMask: IBackgroundMask;
  backgroundMode: RecursivePartial<IFullScreen> | boolean;
  detectRetina: boolean;
  duration: RangeValue;
  fps_limit: number;
  fpsLimit: number;
  fullScreen: RecursivePartial<IFullScreen> | boolean;
  interactivity: IInteractivity;
  manualParticles: IManualParticle[];
  motion: IMotion;
  particles: IParticles;
  pauseOnBlur: boolean;
  pauseOnOutsideViewport: boolean;
  preset?: SingleOrMultiple<string>;
  responsive: IResponsive[];
  retina_detect: boolean;
  style: RecursivePartial<CSSStyleDeclaration>;
  themes: ITheme[];
  zLayers: number;
  [name: string]: unknown;
}
