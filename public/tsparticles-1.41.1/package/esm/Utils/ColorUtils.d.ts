import type {
  IColor,
  IHsl,
  IHsla,
  IHsv,
  IHsva,
  IParticle,
  IParticleHslAnimation,
  IRgb,
  IRgba,
} from "../Core";
import type { HslAnimation } from "../Options/Classes/HslAnimation";
export declare function colorToRgb(
  input?: string | IColor,
  index?: number,
  useIndex?: boolean
): IRgb | undefined;
export declare function colorToHsl(
  color: string | IColor | undefined,
  index?: number,
  useIndex?: boolean
): IHsl | undefined;
export declare function rgbToHsl(color: IRgb): IHsl;
export declare function stringToAlpha(input: string): number | undefined;
export declare function stringToRgb(input: string): IRgb | undefined;
export declare function hslToRgb(hsl: IHsl): IRgb;
export declare function hslaToRgba(hsla: IHsla): IRgba;
export declare function hslToHsv(hsl: IHsl): IHsv;
export declare function hslaToHsva(hsla: IHsla): IHsva;
export declare function hsvToHsl(hsv: IHsv): IHsl;
export declare function hsvaToHsla(hsva: IHsva): IHsla;
export declare function hsvToRgb(hsv: IHsv): IRgb;
export declare function hsvaToRgba(hsva: IHsva): IRgba;
export declare function rgbToHsv(rgb: IRgb): IHsv;
export declare function rgbaToHsva(rgba: IRgba): IHsva;
export declare function getRandomRgbColor(min?: number): IRgb;
export declare function getStyleFromRgb(color: IRgb, opacity?: number): string;
export declare function getStyleFromHsl(color: IHsl, opacity?: number): string;
export declare function getStyleFromHsv(color: IHsv, opacity?: number): string;
export declare function colorMix(
  color1: IRgb | IHsl,
  color2: IRgb | IHsl,
  size1: number,
  size2: number
): IRgb;
export declare function getLinkColor(
  p1: IParticle,
  p2?: IParticle,
  linkColor?: string | IRgb
): IRgb | undefined;
export declare function getLinkRandomColor(
  optColor: string | IColor,
  blink: boolean,
  consent: boolean
): IRgb | string | undefined;
export declare function getHslFromAnimation(
  animation?: IParticleHslAnimation
): IHsl | undefined;
export declare function getHslAnimationFromHsl(
  hsl: IHsl,
  animationOptions: HslAnimation | undefined,
  reduceFactor: number
): IParticleHslAnimation;
