import { createContext, useContext } from "react";

export const createReactContext = <T extends any>(
  name: string,
  defaultValue?: T
) => {
  const Context = createContext<T | undefined>(defaultValue);
  Context.displayName = name;

  return Context;
};

export const createUseContextHook =
  <T extends any>(Context: React.Context<T>) =>
  () => {
    const context = useContext(Context);
    if (!context) {
      throw new Error(`Context ${Context.displayName} is not available!`);
    }

    return context;
  };
