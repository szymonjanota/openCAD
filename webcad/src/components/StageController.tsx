import { convertUnit } from "@/units";
import { useContext } from "react";
import { Stage, Layer } from "react-konva";
import { Grid } from "./Grid";
import { DrawingContext } from "./DrawingContextProvider";

export const StageController: React.FC<{
  parentWidth: number;
  parentHeight: number;
}> = ({ parentHeight, parentWidth }) => {
  const ctx = useContext(DrawingContext);
  if (!ctx) {
    throw new Error("NO CTX");
  }
  const {
    settings: { currentUnit, drawingScale, zoom },
    scale,
  } = ctx;

  const viewOffsetX = 200; // TBD implement view dragging;
  const viewOffsetY = 200; // TBD implement view dragging;

  const offsetX = -parentWidth / 2 + viewOffsetX;
  const offsetY = -parentHeight / 2 + viewOffsetY;

  const gridXOffset = -(parentWidth / scale) / 2 + viewOffsetX / scale;
  const gridYOffset = -(parentHeight / scale) / 2 + viewOffsetY / scale;

  return (
    <Stage
      width={parentWidth}
      height={parentHeight}
      offsetX={offsetX}
      offsetY={offsetY}
    >
      <Layer scaleX={scale} scaleY={scale}>
        <Grid
          drawingUnit={currentUnit}
          drawingScale={drawingScale}
          zoom={zoom}
          width={parentWidth / scale}
          height={parentHeight / scale}
          scale={scale}
          gridSize={10}
          offsetX={gridXOffset}
          offsetY={gridYOffset}
        />
      </Layer>
    </Stage>
  );
};
