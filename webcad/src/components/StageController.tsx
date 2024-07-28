import { convertUnit } from "@/units";
import { useContext, useState } from "react";
import { Stage, Layer, Line } from "react-konva";
import { Grid } from "./Grid";
import { DrawingContext } from "./DrawingContextProvider";
import { Vector2D } from "@/utils/vector-2d";

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

  const [currentOffset, setCurrentOffset] = useState({
    x: 0,
    y: 0,
  });

  const [movePath, setMovePath] = useState<null | {
    origin: { x: number; y: number };
    current: { x: number; y: number };
  }>(null);

  const currentMoveVector = movePath
    ? Vector2D.sub(movePath.current, movePath.origin)
    : Vector2D.init(0);

  const viewOffset = Vector2D.sub(currentOffset, currentMoveVector);
  const centerOffset = Vector2D.div(
    {
      x: parentWidth,
      y: parentHeight,
    },
    -2
  );
  const offset = Vector2D.add(centerOffset, viewOffset);
  const gridOffset = Vector2D.div(
    Vector2D.add(centerOffset, viewOffset),
    scale
  );

  return (
    <Stage
      width={parentWidth}
      height={parentHeight}
      offsetX={offset.x}
      offsetY={offset.y}
      onMouseUp={(e) => {
        if (movePath) {
          setMovePath(null);
          setCurrentOffset(viewOffset);
        }
      }}
      onMouseDown={(e) => {
        const point = e.target.getStage()?.getPointerPosition();
        if (!point) {
          return;
        }
        const localCoords = {
          x: point.x,
          y: point.y,
        };
        setMovePath({
          origin: localCoords,
          current: localCoords,
        });
      }}
      onMouseMove={(e) => {
        const point = e.target.getStage()?.getPointerPosition();
        if (!point) {
          return;
        }

        if (movePath) {
          setMovePath((prevMovePath) =>
            prevMovePath
              ? {
                  ...prevMovePath,
                  current: {
                    x: point.x,
                    y: point.y,
                  },
                }
              : prevMovePath
          );
        }
      }}
    >
      <Layer offsetX={-offset.x} offsetY={-offset.y}>
        {movePath && (
          <Line
            scale={{
              x: 1,
              y: 1,
            }}
            points={[
              movePath.origin.x,
              movePath.origin.y,
              movePath.current.x,
              movePath.current.y,
            ]}
            stroke="red"
            strokeEnabled
            strokeWidth={10}
            strokeScaleEnabled={false}
          />
        )}
      </Layer>
      <Layer scaleX={scale} scaleY={scale}>
        <Grid
          drawingUnit={currentUnit}
          drawingScale={drawingScale}
          zoom={zoom}
          width={parentWidth / scale}
          height={parentHeight / scale}
          scale={scale}
          gridSize={10}
          offsetX={gridOffset.x}
          offsetY={gridOffset.y}
        />
      </Layer>
    </Stage>
  );
};
