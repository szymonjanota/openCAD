"use client";
import { convertUnit, Unit } from "@/units";

import React, { useMemo, useState } from "react";

const useSettings = () => {
  const [settings, setSettings] = useState<{
    drawingScale: number; // This will later come from page settings.
    currentUnit: Unit; // This will later come from page settings.
    /*
      How should the canvas work? If:
      1) Each item shows in real size - it might be difficult to draw large and small elements like furniture details and whole floorplans.
      2) Each item shows in size scaled by the page it is on - this means we can have 2 A4 prints next to each other and see "print size", while switching to a specific layer we can have a separate grid, etc.
      Regardless of implementation, this should be universal. This means it needs to be recalculated each time the page is switched. This is fine (for now).
    */
    zoom: number;
    devicePhysicalPixelsPerIn: number; // This is the real DPI.
    devicePhysicalPixelPerCssPixelRatio: number; // This is how many physical pixels count as a single CSS pixel, which is our base drawing unit.
  }>({
    drawingScale: 1 / 2,
    currentUnit: "mm",
    zoom: 1 / 2,
    devicePhysicalPixelsPerIn: 254,
    devicePhysicalPixelPerCssPixelRatio: window.devicePixelRatio,
  });

  return useMemo(() => {
    const {
      devicePhysicalPixelPerCssPixelRatio,
      devicePhysicalPixelsPerIn,
      currentUnit,
      drawingScale,
      zoom,
    } = settings;

    const currentUnitScalePerIn = convertUnit(1, currentUnit, "inch");
    const pxPerIn =
      devicePhysicalPixelsPerIn / devicePhysicalPixelPerCssPixelRatio;
    const scale = currentUnitScalePerIn * pxPerIn * drawingScale * zoom;

    const getPixelsInPaperSpace = (value: number, unit: Unit) => {
      const PX_PER_IN =
        devicePhysicalPixelsPerIn / devicePhysicalPixelPerCssPixelRatio;
      return PX_PER_IN * convertUnit(value, unit, "inch") * zoom;
    };

    const getPixelsInDrawingSpace = (value: number, unit: Unit) => {
      const PX_PER_IN =
        devicePhysicalPixelsPerIn / devicePhysicalPixelPerCssPixelRatio;
      return PX_PER_IN * convertUnit(value, unit, "inch") * zoom * drawingScale;
    };

    return {
      settings,
      scale,
      setSettings,
      getPixelsInDrawingSpace,
      getPixelsInPaperSpace,
    };
  }, [settings]);
};

export type DrawingContextValue = ReturnType<typeof useSettings>;

export const DrawingContext = React.createContext<DrawingContextValue | null>(
  null
);

export const DrawingContextProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => (
  <DrawingContext.Provider value={useSettings()}>
    {children}
  </DrawingContext.Provider>
);
