import { createReactContext, createUseContextHook } from "@/utils/context";
import { ThemeColors } from "@/utils/theme";
import React, { useContext } from "react";

const createTheme = (colors: ThemeColors) => {
  return {
    canvasBackgroundColor: colors.base100,
    minorGridColor: colors.base200,
    majorGridColor: colors.base300,
    content: colors.baseContent,
    primary: colors.primary,
  };
};

export type Theme = ReturnType<typeof createTheme>;

const ThemeContext = createReactContext<Theme>("ThemeContext");

export const ThemeProvider: React.FC<
  React.PropsWithChildren<{ colors: ThemeColors }>
> = ({ colors, children }) => (
  <ThemeContext.Provider value={createTheme(colors)}>
    {children}
  </ThemeContext.Provider>
);

export const useThemeContext = createUseContextHook(ThemeContext);
