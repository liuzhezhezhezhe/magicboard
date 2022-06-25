import { observable } from "mobx";
import { Canvas } from "fabric/fabric-impl";
import { IBrushType } from "@/types/brush.d";
import iro from "@jaames/iro";
import { defaultBrushs } from "@/constants/brush";
import { ICanvasMode } from "@/types/canvas.d";
import { IShapeType } from "@/types/shape.d";

interface ICanvasStore {
  canvas: Canvas | null;
  setCanvas: (canvas: fabric.Canvas) => void;
  canvasMode: ICanvasMode;
  switchMode: (mode: ICanvasMode) => void;
  activeBrush: IBrushType;
  setActiveBrush: (brush: IBrushType) => void;
  activeShape: IShapeType;
  setActiveShape: (shape: IShapeType) => void;
  isDrawing: boolean;
  setIsDrawing: (isDrawing: boolean) => void;
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
      // 模式更改时，需要调整画布的绘制状态
      switch (mode) {
        case ICanvasMode.SELECT:
          {
            // 选择模式
            this.canvas.isDrawingMode = false;
            this.canvas.selection = true;
            this.canvas.skipTargetFind = false;
            this.canvas.selectionColor = "rgba(100, 100, 255, 0.3)";
            this.canvas.selectionBorderColor = "rgba(100, 100, 255, 0.3)";
          }
          break;
        case ICanvasMode.DRAW:
          {
            // 画笔模式
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
            // 橡皮模式
            this.canvas.freeDrawingBrush = new fabric.EraserBrush(this.canvas);
            this.canvas.isDrawingMode = true;
            const brush = defaultBrushs.get(this.activeBrush);
            if (brush) {
              this.canvas.freeDrawingBrush.width = brush.size;
            }
          }
          break;
        case ICanvasMode.TEXT:
          {
            // 文字模式
            this.canvas.isDrawingMode = false;
            this.canvas.selection = true;
            this.canvas.skipTargetFind = false;
          }
          break;
        case ICanvasMode.SHAPE:
          {
            // 形状模式
            // 关闭绘画/选择功能，并重置选择框，不准选中其他元素
            // 形状完全由鼠标生成
            this.canvas.isDrawingMode = false;
            this.canvas.selection = false;
            this.canvas.skipTargetFind = true;
            this.canvas.selectionColor = "transparent";
            this.canvas.selectionBorderColor = "transparent";
          }
          break;
        case ICanvasMode.STICKERS:
          {
            // 便签模式
            // 便签本质就是个特殊的文本框
            this.canvas.isDrawingMode = false;
            this.canvas.selection = true;
            this.canvas.skipTargetFind = false;
          }
          break;
      }
    }
  },
  activeBrush: IBrushType.BRUSH,
  setActiveBrush(brush: IBrushType) {
    this.activeBrush = brush;
  },
  activeShape: IShapeType.ELLIPSE,
  setActiveShape(shape: IShapeType) {
    this.activeShape = shape;
  },
  isDrawing: false,
  setIsDrawing(isDrawing: boolean) {
    this.isDrawing = isDrawing;
  },
});

export default CanvasStore;
