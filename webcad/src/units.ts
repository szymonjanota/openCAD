export type Unit =
  | "mm"
  | "cm"
  | "m"
  | "km"
  | "pt"
  | "inch"
  | "foot"
  | "yard"
  | "mile";

const M_PER_IN = 0.0254;

const METRIC_UNIT = {
  mm: 10 ** -3,
  cm: 10 ** -2,
  m: 10 ** 0,
  km: 10 ** 3,
};

const IMPERIAL_UNITS = {
  pt: 1 / 72,
  inch: 1,
  foot: 12,
  yard: 36,
  mile: 63360,
};

export const convertUnit = (value: number, from: Unit, to: Unit) => {
  const valueInMeters = toMetricBase(value, from);
  return fromMetricBase(valueInMeters, to);
};

const toMetricBase = (value: number, input: Unit): number => {
  switch (input) {
    case "mm":
    case "cm":
    case "m":
    case "km":
      return value * METRIC_UNIT[input];
    case "pt":
    case "inch":
    case "foot":
    case "yard":
    case "mile":
      return value * IMPERIAL_UNITS[input] * M_PER_IN;
  }
};

const fromMetricBase = (value: number, output: Unit): number => {
  switch (output) {
    case "mm":
    case "cm":
    case "m":
    case "km":
      return value / METRIC_UNIT[output];
    case "pt":
    case "inch":
    case "foot":
    case "yard":
    case "mile":
      return value / M_PER_IN / IMPERIAL_UNITS[output];
  }
};
