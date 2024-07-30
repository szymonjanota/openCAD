import { useContext, useMemo, useState } from "react";
import { Stage, Layer, Line, Rect } from "react-konva";
import { DrawingContext, useDrawingContext } from "./DrawingContextProvider";
import { Vector2D } from "@/utils/vector-2d";
import { Unit } from "@/units";
import { useThemeContext } from "./ThemeProvider";
import { Grid } from "./Grid";

interface Line {
  start: Vector2D; // in drawing scale unit
  end: Vector2D; // in drawing scale unit
  stroke: string;
  strokeWidth: number; // in paper scale unit
}

interface Page {
  scale: number;
  height: number;
  width: number;
  unit: Unit;
  position: Vector2D;
  children: Line[];
}

const STAGE: Page[] = [
  {
    scale: 1 / 2,
    height: 210,
    width: 297,
    unit: "mm",
    position: {
      x: 22,
      y: 0,
    },
    children: [
      {
        start: { x: 0, y: 0 },
        end: {
          x: 594,
          y: 420,
        },
        stroke: "red",
        strokeWidth: 2,
      },
    ],
  },
  {
    scale: 1 / 50,
    height: 297,
    width: 210,
    unit: "mm",
    position: {
      x: 0,
      y: 0,
    },
    children: [
      {
        start: { x: 100, y: 100 },
        end: {
          x: 100,
          y: 9900,
        },
        stroke: "red",
        strokeWidth: 2,
      },
    ],
  },
];

export const StageController: React.FC<{
  parentWidth: number;
  parentHeight: number;
}> = ({ parentHeight, parentWidth }) => {
  const theme = useThemeContext();
  const drawingContext = useDrawingContext();

  const [activePageIndex, setActivePageIndex] = useState(0);
  const stage = useMemo(
    () =>
      STAGE.map((page, index) => ({
        active: index === activePageIndex,
        ...page,
      })),
    [activePageIndex]
  );
  const activePage = stage.find((page) => page.active)!;

  const {
    settings: { currentUnit, zoom },
    getPixelsInDrawingSpace,
    getPixelsInPaperSpace,
  } = drawingContext;

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
    activePage.scale
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
      <Layer>
        {stage.map((page, index) => (
          <>
            <Rect
              stroke={page.active ? theme.primary : theme.content}
              strokeWidth={1}
              height={getPixelsInPaperSpace(page.height, page.unit)}
              width={getPixelsInPaperSpace(page.width, page.unit)}
              x={getPixelsInPaperSpace(page.position.x, "cm")}
              y={getPixelsInPaperSpace(page.position.y, "cm")}
              onClick={() => setActivePageIndex(index)}
            />
            {page.children.map((obj) => (
              // eslint-disable-next-line react/jsx-key
              <Line
                points={[
                  getPixelsInDrawingSpace(obj.start.x, page.unit, page.scale) +
                    getPixelsInPaperSpace(page.position.x, "cm"),
                  getPixelsInDrawingSpace(obj.start.y, page.unit, page.scale) +
                    getPixelsInPaperSpace(page.position.y, "cm"),
                  getPixelsInDrawingSpace(obj.end.x, page.unit, page.scale) +
                    getPixelsInPaperSpace(page.position.x, "cm"),
                  getPixelsInDrawingSpace(obj.end.y, page.unit, page.scale) +
                    getPixelsInPaperSpace(page.position.y, "cm"),
                ]}
                stroke="red"
                strokeEnabled
                strokeWidth={Math.max(
                  getPixelsInPaperSpace(0.05, page.unit),
                  1
                )}
                strokeScaleEnabled={false}
              />
            ))}
          </>
        ))}
        {/* <Line
          points={[
            0,
            0,
            getPixelsInPaperSpace(29.7, "cm"),
            getPixelsInPaperSpace(21, "cm"),
          ]}
          stroke="red"
          strokeEnabled
          strokeWidth={1}
          strokeScaleEnabled={false}
        />
        <Line
          points={[
            0,
            50,
            getPixelsInDrawingSpace(29.7, "cm"),
            50 + getPixelsInDrawingSpace(21, "cm"),
          ]}
          stroke="green"
          strokeEnabled
          strokeWidth={1}
          strokeScaleEnabled={false}
        /> */}
      </Layer>
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
            stroke={theme.content}
            strokeEnabled
            strokeWidth={2}
            strokeScaleEnabled={false}
          />
        )}
      </Layer>
    </Stage>
  );
};
