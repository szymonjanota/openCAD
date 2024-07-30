import { mapValues } from "lodash";

export interface ThemeColors {
  base100: string;
  base200: string;
  base300: string;
  baseContent: string;
  primary:string;
}

export const getColors = <ColorMap extends Record<string, string>>(
  css: CSSStyleDeclaration,
  colorNameToPropertyMap: ColorMap
): {
  [ColorName in keyof ColorMap]: string;
} =>
  mapValues(colorNameToPropertyMap, (propertyName) => {
    const propertyValue = css.getPropertyValue(propertyName);
    return `oklch(${propertyValue})`;
  });

export const transparent = (color: string, value: number): string => {
  return color.replace(/( ?\/.+)?\)/, ` / ${value})`);
};

export const extractColorsFromCssStyle = (
  cssStyleDeclaration: CSSStyleDeclaration
): ThemeColors =>
  getColors(cssStyleDeclaration, {
    base100: "--b1",
    base200: "--b2",
    base300: "--b3",
    baseContent: "--bc",
    primary: '--p'
  });
