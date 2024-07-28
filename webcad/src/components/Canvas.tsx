import { extractColorsFromCssStyle, ThemeColors } from "@/utils/theme";
import { useEffect, useRef, useState } from "react";
import { ThemeProvider } from "./ThemeProvider";
import { useResizeDetector } from "react-resize-detector";
import { StageController } from "./StageController";

export const Canvas: React.FC<{ className?: string }> = ({ className }) => {
  const {
    width: parentWidth = 0,
    height: parentHeight = 0,
    ref,
  } = useResizeDetector<HTMLDivElement>();

  const [colors, setColors] = useState<ThemeColors | null>(null);

  useEffect(() => {
    setColors(
      ref.current
        ? extractColorsFromCssStyle(getComputedStyle(ref.current))
        : null
    );
  }, [ref]);

  return (
    <div className={className} ref={ref}>
      {colors ? (
        <ThemeProvider colors={colors}>
          <StageController
            parentHeight={parentHeight}
            parentWidth={parentWidth}
          />
        </ThemeProvider>
      ) : null}
    </div>
  );
};
