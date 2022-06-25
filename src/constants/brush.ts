import { IBrushParams, IBrushType } from "@/types/brush.d";

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

// 画笔列表
export const defaultBrushs: Map<IBrushType, IBrushParams> = new Map([
  [
    IBrushType.BRUSH,
    {
      color: "#f44336",
      size: 20,
      opacity: 1,
    },
  ],
  [
    IBrushType.HIGHLIGHT,
    {
      color: "#00bcd4",
      size: 50,
      opacity: 0.5,
    },
  ],
  [
    IBrushType.ERASER,
    {
      color: "#ffffff00",
      size: 20,
      opacity: 0.5,
    },
  ],
]);
