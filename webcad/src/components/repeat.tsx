export const repeat = <T extends any>(
  times: number,
  mapFn: (index: number) => T
): T[] => {
  const arr: T[] = [];

  for (let index = 0; index < times; index += 1) {
    arr.push(mapFn(index));
  }

  return arr;
};
