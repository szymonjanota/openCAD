import { ThemeColors } from "@/utils/theme";
import React from "react";

const createTheme = (colors: ThemeColors) => {
  return {
    canvasBackgroundColor: colors.base100,
  };
};

export type Theme = ReturnType<typeof createTheme>;

const ThemeContext = React.createContext<Theme | null>(null);

export const ThemeProvider: React.FC<
  React.PropsWithChildren<{ colors: ThemeColors }>
> = ({ colors, children }) => (
  <ThemeContext.Provider value={createTheme(colors)}>
    {children}
  </ThemeContext.Provider>
);
