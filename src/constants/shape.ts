import { IShapeType, IShapeParams, IBorderStyle } from "@/types/shape.d";

// 自定义颜色列表
export const customColorList = [
  "#f44336",
  "#e91e63",
  "#9c27b0",
  "#673ab7",
  "#3f51b5",
  "#2196f3",
  "#03a9f4",
  "#00bcd4",
];

// 自定义背景色列表
export const customBackgroundColorList = [
  "#f44336",
  "#e91e63",
  "#9c27b0",
  "#673ab7",
  "#3f51b5",
  "#2196f3",
  "#03a9f4",
  "#00bcd4",
];

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
