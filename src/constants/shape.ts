import { IShapeType, IShapeParams, IBorderStyle } from "@/types/shape.d";

/**
 * 形状列表
 */
export const defaultShapes: Map<IShapeType, IShapeParams> = new Map([
  [
    IShapeType.ELLIPSE,
    {
      color: "#000",
      size: 10,
      opacity: 1,
      fill: "transparent",
      radius: 0,
      style: IBorderStyle.SOLID,
      points: {
        start: { x: 0, y: 0 },
        end: { x: 0, y: 0 },
      },
    },
  ],
  [
    IShapeType.RECTANGLE,
    {
      color: "#000",
      size: 10,
      opacity: 1,
      fill: "transparent",
      radius: 0,
      style: IBorderStyle.SOLID,
      points: {
        start: { x: 0, y: 0 },
        end: { x: 0, y: 0 },
      },
    },
  ],
  [
    IShapeType.TRIANGLE,
    {
      color: "#000",
      size: 10,
      opacity: 1,
      fill: "transparent",
      radius: 0,
      style: IBorderStyle.SOLID,
      points: {
        start: { x: 0, y: 0 },
        end: { x: 0, y: 0 },
      },
    },
  ],
  [
    IShapeType.LINE,
    {
      color: "#000",
      size: 10,
      opacity: 1,
      fill: "transparent",
      radius: 0,
      style: IBorderStyle.SOLID,
      points: {
        start: { x: 0, y: 0 },
        end: { x: 0, y: 0 },
      },
    },
  ],
]);
