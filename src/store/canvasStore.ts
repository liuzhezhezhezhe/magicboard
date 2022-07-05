import { observable } from "mobx";
import { Canvas } from "fabric/fabric-impl";
import { ICanvasMode } from "@/types/canvas.d";

interface ICanvasStore {
  canvas: Canvas | null;
  setCanvas: (canvas: fabric.Canvas) => void;
  canvasMode: ICanvasMode;
  switchMode: (mode: ICanvasMode) => void;
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
      const canvas = this.canvas;
      canvas.getObjects().forEach((obj) => {
        if (obj.type === "textbox" && (obj as fabric.Textbox).text === "") {
          canvas.remove(obj);
        }
      });
      // 模式更改时，需要调整画布的绘制状态
      switch (mode) {
        case ICanvasMode.DRAG:
          {
            canvas.isDrawingMode = false;
            canvas.selection = false;
            canvas.skipTargetFind = true;
            canvas.discardActiveObject();
            canvas.requestRenderAll();
          }
          break;
        case ICanvasMode.SELECT:
          {
            // 选择模式
            canvas.isDrawingMode = false;
            canvas.selection = true;
            canvas.skipTargetFind = false;
            canvas.selectionColor = "rgba(100, 100, 255, 0.3)";
            canvas.selectionBorderColor = "rgba(100, 100, 255, 0.3)";
          }
          break;
        case ICanvasMode.DRAW:
          {
            // 画笔模式
            canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
            canvas.isDrawingMode = true;
            canvas.freeDrawingCursor = "crosshair";
          }
          break;
        case ICanvasMode.ERASE:
          {
            // 橡皮模式
            canvas.freeDrawingBrush = new fabric.EraserBrush(canvas);
            canvas.isDrawingMode = true;
          }
          break;
        case ICanvasMode.TEXT:
          {
            // 文字模式
            canvas.isDrawingMode = false;
            canvas.selection = true;
            canvas.skipTargetFind = false;
          }
          break;
        case ICanvasMode.SHAPE:
          {
            // 形状模式
            // 关闭绘画/选择功能，并重置选择框，不准选中其他元素
            // 形状完全由鼠标生成
            canvas.isDrawingMode = false;
            canvas.selection = false;
            canvas.skipTargetFind = true;
            canvas.selectionColor = "transparent";
            canvas.selectionBorderColor = "transparent";
          }
          break;
        case ICanvasMode.STICKERS:
          {
            // 便签模式
            // 便签本质就是个特殊的文本框
            canvas.isDrawingMode = false;
            canvas.selection = true;
            canvas.skipTargetFind = false;
          }
          break;
      }
    }
  },
});

export default CanvasStore;
