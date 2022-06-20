import { observable } from "mobx";
import { Canvas } from "fabric/fabric-impl";
import { IBrushParams, IBrushType } from "@/types/brush.d";
import iro from "@jaames/iro";

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

/**
 * 画板当前所处模式
 */
export enum ICanvasMode {
  SELECT = "select",
  DRAW = "draw",
  ERASE = "erase",
  TEXT = "text",
  SQUARE = "square",
  STICKERS = "stickers",
}

interface ICanvasStore {
  canvas: Canvas | null;
  setCanvas: (canvas: fabric.Canvas) => void;
  canvasMode: ICanvasMode;
  switchMode: (mode: ICanvasMode) => void;
  activeBrush: IBrushType;
  setActiveBrush: (brush: IBrushType) => void;
}

const CanvasStore = observable<ICanvasStore>({
  canvas: null,
  setCanvas(canvas: fabric.Canvas) {
    this.canvas = canvas;
  },
  canvasMode: ICanvasMode.SELECT,
  switchMode(mode: ICanvasMode) {
    this.canvasMode = mode;
    if (this.canvas) {
      switch (mode) {
        case ICanvasMode.SELECT:
          this.canvas.isDrawingMode = false;
          break;
        case ICanvasMode.DRAW:
          {
            this.canvas.freeDrawingBrush = new fabric.PencilBrush(this.canvas);
            this.canvas.isDrawingMode = true;
            this.canvas.freeDrawingCursor = "crosshair";
            const brush = defaultBrushs.get(this.activeBrush);
            if (brush) {
              const currentColor = new iro.Color(brush.color);
              currentColor.alpha = brush.opacity;
              this.canvas.freeDrawingBrush.color = currentColor.hex8String;
              this.canvas.freeDrawingBrush.width = brush.size;
            }
          }
          break;
        case ICanvasMode.ERASE:
          {
            this.canvas.freeDrawingBrush = new fabric.EraserBrush(this.canvas);
            this.canvas.isDrawingMode = true;
            const brush = defaultBrushs.get(this.activeBrush);
            if (brush) {
              this.canvas.freeDrawingBrush.width = brush.size;
            }
          }
          break;
        case ICanvasMode.TEXT:
          this.canvas.isDrawingMode = true;
          this.canvas.freeDrawingBrush.color = "black";
          break;
        case ICanvasMode.SQUARE:
          this.canvas.isDrawingMode = true;
          this.canvas.freeDrawingBrush.color = "black";
          break;
        case ICanvasMode.STICKERS:
          this.canvas.isDrawingMode = true;
          this.canvas.freeDrawingBrush.color = "black";
          break;
      }
    }
  },
  activeBrush: IBrushType.BRUSH,
  setActiveBrush(brush: IBrushType) {
    this.activeBrush = brush;
  },
});

export default CanvasStore;
