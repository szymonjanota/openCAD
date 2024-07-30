/* eslint-disable react/jsx-key */
import React, { useEffect } from "react";
import _ from "lodash";
import { Circle, Line, Rect, Text } from "react-konva";
import { convertUnit, Unit } from "@/units";
import { rountToNearest } from "@/utils/math";
import { Vector2D } from "@/utils/vector-2d";
import { useDrawingContext } from "./DrawingContextProvider";

const majorDivide = 10;

const toRoundedValues =
  ({
    gridSize,
    majorCellWidth,
  }: {
    gridSize: number;
    majorCellWidth: number;
  }) =>
  (_value: number) => {
    const isMajor =
      Math.round(_value / gridSize) % Math.round(majorCellWidth / gridSize) ===
      0;
    const value = rountToNearest(_value, gridSize);

    return {
      value,
      isMajor,
    };
  };

const THEME = {
  label: {
    text: "grey",
  },
  grid: {
    major: {
      color: "grey",
      width: 1,
    },
    minor: {
      color: "grey",
      width: 1,
    },
  },
};

export const PageBasedGrid: React.FC<{
  center: Vector2D;
  drawingUnit: Unit;
  drawingScale: number;
  zoom: number;
  width: number;
  height: number;
  gridOffset: Vector2D;
}> = ({ width, height, zoom, gridOffset, center, drawingScale }) => {
  const { getPixelsInDrawingSpace, getPixelsInPaperSpace, setSettings } =
    useDrawingContext();
  let gridSize = getPixelsInDrawingSpace(1, "cm", drawingScale);
  while (gridSize < 100) {
    gridSize *= 10;
  }

  // useEffect(() => {
  //   setInterval(() => setSettings((p) => ({ ...p, zoom: p.zoom / 2 })), 10_000);
  // }, [setSettings]);

  console.log({ gridSize });
  const xRange = _.range(
    rountToNearest(gridOffset.x, gridSize),
    width + gridOffset.x,
    gridSize
  );
  return (
    <>
      <Rect
        x={gridOffset.x}
        y={gridOffset.y}
        width={width}
        height={height}
        stroke={"yellow"}
        strokeWidth={10}
      />
      {xRange.map((value) => (
        <Line
          points={[value, gridOffset.y, value, gridOffset.y + height]}
          stroke="green"
          strokeWidth={1}
        />
      ))}
      <Circle x={center.x} y={center.y} radius={10} fill={"red"} />
    </>
  );
};

export const Grid: React.FC<{
  drawingUnit: Unit;
  drawingScale: number;
  zoom: number;
  width: number;
  height: number;
  scale: number;
  gridSize: number;
  offsetX: number;
  offsetY: number;
}> = ({
  width,
  height,
  offsetX,
  offsetY,
  gridSize,
  drawingScale,
  zoom,
  drawingUnit,
}) => {
  const majorCellWidth = majorDivide * gridSize;

  const fontSize = convertUnit(12, "pt", "mm");
  const textScale = convertUnit(1, "mm", drawingUnit) / drawingScale / zoom;
  const textSize = fontSize * textScale;

  const xRange = _.range(
    rountToNearest(offsetX, gridSize),
    width + offsetX,
    gridSize
  ).map(toRoundedValues({ gridSize, majorCellWidth }));
  const yRange = _.range(
    rountToNearest(offsetY, gridSize),
    height + offsetY,
    gridSize
  ).map(toRoundedValues({ gridSize, majorCellWidth }));

  return (
    <>
      {xRange.map(({ value, isMajor }) => (
        <Line
          strokeScaleEnabled={false}
          points={[value, offsetY, value, height + offsetY]}
          stroke={isMajor ? THEME.grid.major.color : THEME.grid.minor.color}
          strokeWidth={
            isMajor ? THEME.grid.major.width : THEME.grid.minor.width
          }
        />
      ))}
      {yRange.map(({ value, isMajor }) => (
        <Line
          strokeScaleEnabled={false}
          points={[offsetX, value, width + offsetX, value]}
          stroke={isMajor ? THEME.grid.major.color : THEME.grid.minor.color}
          strokeWidth={
            isMajor ? THEME.grid.major.width : THEME.grid.minor.width
          }
        />
      ))}
      {xRange
        .filter(({ isMajor }) => isMajor)
        .map(({ value }) => (
          <>
            <Text
              scaleX={textScale}
              scaleY={textScale}
              offsetX={majorCellWidth / textScale / 2}
              width={majorCellWidth / textScale}
              align="center"
              fontSize={fontSize}
              x={value}
              y={offsetY}
              text={`${value}`}
              fill={THEME.label.text}
            />
            <Text
              scaleX={textScale}
              scaleY={textScale}
              offsetX={majorCellWidth / textScale / 2}
              width={majorCellWidth / textScale}
              align="center"
              fontSize={fontSize}
              x={value}
              y={height + offsetY - textSize}
              text={`${value}`}
              fill={THEME.label.text}
            />
          </>
        ))}
      {yRange
        .filter(({ isMajor }) => isMajor)
        .map(({ value }) => (
          <>
            <Text
              scaleX={textScale}
              scaleY={textScale}
              offsetY={textSize / textScale / 2}
              width={majorCellWidth / textScale}
              align="left"
              fontSize={fontSize}
              x={offsetX}
              y={value}
              text={`${-value}`}
              fill={THEME.label.text}
            />
            <Text
              scaleX={textScale}
              scaleY={textScale}
              offsetY={textSize / textScale / 2}
              width={majorCellWidth / textScale}
              align="right"
              fontSize={fontSize}
              x={offsetX + width - majorCellWidth}
              y={value}
              text={`${-value}`}
              fill={THEME.label.text}
            />
          </>
        ))}
    </>
  );
};
