export interface Vector2D {
  x: number;
  y: number;
}

export const Vector2D = {
  init: (x: number, y?: number): Vector2D =>
    typeof y === "undefined" ? { x: x, y: x } : { x, y },
  mult: (vector: Vector2D, value: number | Vector2D) => {
    if (typeof value === "number") {
      return {
        x: vector.x * value,
        y: vector.y * value,
      };
    }
    return {
      x: vector.x * value.x,
      y: vector.y * value.y,
    };
  },
  div: (vector: Vector2D, value: number | Vector2D) => {
    if (typeof value === "number") {
      return {
        x: vector.x / value,
        y: vector.y / value,
      };
    }
    return {
      x: vector.x / value.x,
      y: vector.y / value.y,
    };
  },
  add: (vector: Vector2D, value: number | Vector2D): Vector2D => {
    if (typeof value === "number") {
      return {
        x: vector.x + value,
        y: vector.y + value,
      };
    }
    return {
      x: vector.x + value.x,
      y: vector.y + value.y,
    };
  },
  sub: (vector: Vector2D, value: Vector2D): Vector2D => {
    if (typeof value === "number") {
      return {
        x: vector.x - value,
        y: vector.y - value,
      };
    }
    return {
      x: vector.x - value.x,
      y: vector.y - value.y,
    };
  },
};
