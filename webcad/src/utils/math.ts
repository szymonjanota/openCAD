export const rountToNearest = (value: number, step: number) =>
  Math.round(value / step) * step;
