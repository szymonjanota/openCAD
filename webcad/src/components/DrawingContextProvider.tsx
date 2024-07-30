"use client";
import { convertUnit, Unit } from "@/units";
import { createReactContext, createUseContextHook } from "@/utils/context";

import React, { useMemo, useState } from "react";

const useSettings = () => {
  const [settings, setSettings] = useState<{
    currentUnit: Unit;
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
    currentUnit: "mm",
    zoom: 1,
    devicePhysicalPixelsPerIn: 254,
    devicePhysicalPixelPerCssPixelRatio: window.devicePixelRatio,
  });

  // TBD remove this when more stable
  if (process.env.NODE_ENV === "development") {
    window.setSettings = setSettings;
  }

  return useMemo(() => {
    const {
      devicePhysicalPixelPerCssPixelRatio,
      devicePhysicalPixelsPerIn,
      currentUnit,
      zoom,
    } = settings;

    const currentUnitScalePerIn = convertUnit(1, currentUnit, "inch");
    const pxPerIn =
      devicePhysicalPixelsPerIn / devicePhysicalPixelPerCssPixelRatio;
    const scale = currentUnitScalePerIn * pxPerIn * zoom;

    const getPixelsInPaperSpace = (value: number, unit: Unit) => {
      const PX_PER_IN =
        devicePhysicalPixelsPerIn / devicePhysicalPixelPerCssPixelRatio;
      return PX_PER_IN * convertUnit(value, unit, "inch") * zoom;
    };

    const getPixelsInDrawingSpace = (
      value: number,
      unit: Unit,
      drawingScale: number
    ) => {
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

export const DrawingContext =
  createReactContext<DrawingContextValue>("DrawingContext");

export const useDrawingContext = createUseContextHook(DrawingContext);

export const DrawingContextProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => (
  <DrawingContext.Provider value={useSettings()}>
    {children}
  </DrawingContext.Provider>
);
