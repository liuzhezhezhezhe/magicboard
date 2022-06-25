import { observable } from "mobx";
import { Canvas } from "fabric/fabric-impl";
import { IBrushType } from "@/types/brush.d";
import iro from "@jaames/iro";
import { defaultBrushs } from "@/constants/brush";
import { ICanvasMode } from "@/types/canvas.d";
import { IShapeType } from "@/types/shape.d";
import { defaultShapes } from "@/constants/shape";

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
          {
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
            const getCanvas = () => {
              return this.canvas;
            };
            const getCurrentMode = () => {
              return this.canvasMode;
            };
            this.canvas.on("mouse:down", (e) => {
              const currentMode = getCurrentMode();
              const canvas = getCanvas();
              if (currentMode === ICanvasMode.TEXT && canvas) {
                // 文字模式下，点击空白区域新建文字，或者编辑已有文字
                // 如果点了其他地方，清除掉没有文字的文字框
                canvas.getObjects().forEach((obj) => {
                  if (
                    obj.type === "textbox" &&
                    (obj as fabric.Textbox).text === ""
                  ) {
                    canvas.remove(obj);
                  }
                });
                if (e.target) {
                  // 点击了已有文字
                  if (e.target.type === "textbox") {
                    // 如果有元素，并且文字是文字，则弹出文字编辑器
                    const textbox = e.target as fabric.Textbox;
                    canvas.setActiveObject(textbox);
                    canvas.renderAll();
                  }
                } else {
                  // 新建文字框
                  const text = new fabric.Textbox("", {
                    left: e.pointer?.x,
                    top: e.pointer?.y,
                    fontSize: 25,
                    editable: true,
                    hasBorders: true,
                    hasControls: true,
                  });
                  canvas.add(text);
                  text.enterEditing();
                  text.hiddenTextarea?.focus();
                  canvas.setActiveObject(text);
                  canvas.renderAll();
                }
              }
            });
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
            const getCanvas = () => {
              return this.canvas;
            };
            const getCurrentMode = () => {
              return this.canvasMode;
            };
            const getActiveShape = () => {
              return this.activeShape;
            };
            const startDraing = () => {
              this.isDrawing = true;
            };
            const endDrawing = () => {
              this.isDrawing = false;
            };
            const getDrawing = () => {
              return this.isDrawing;
            };
            // 鼠标按下，记录形状的起点
            this.canvas.on("mouse:down", (e) => {
              const currentMode = getCurrentMode();
              const canvas = getCanvas();
              if (currentMode === ICanvasMode.SHAPE && canvas) {
                canvas?.discardActiveObject();
                // 形状模式下，记录鼠标按下的坐标起始位置
                const startX = e.pointer?.x;
                const startY = e.pointer?.y;
                if (startX !== undefined && startY !== undefined) {
                  // 如果有坐标，则记录至图形属性中
                  const activeShape = getActiveShape();
                  const shape = defaultShapes.get(activeShape);
                  if (shape) {
                    // 只记录初始位置，鼠标有移动时再绘制图形
                    shape.points.start.x = startX;
                    shape.points.start.y = startY;
                    startDraing();
                  }
                }
              }
            });
            // 鼠标移动，在页面不断画出形状
            this.canvas.on("mouse:move", (e) => {
              const currentMode = getCurrentMode();
              const canvas = getCanvas();
              const isDrawing = getDrawing();
              if (currentMode === ICanvasMode.SHAPE && canvas && isDrawing) {
                // 移动过程中，随着位置不断变化，在页面渲染图形
                const activeShape = getActiveShape();
                const shape = defaultShapes.get(activeShape);
                if (shape) {
                  const endX = e.pointer?.x;
                  const endY = e.pointer?.y;
                  if (endX !== undefined && endY !== undefined) {
                    shape.points.end.x = endX;
                    shape.points.end.y = endY;
                  }
                  const top = Math.min(
                    shape.points.start.y,
                    shape.points.end.y
                  );
                  const left = Math.min(
                    shape.points.start.x,
                    shape.points.end.x
                  );
                  const width = Math.abs(
                    shape.points.start.x - shape.points.end.x
                  );
                  const height = Math.abs(
                    shape.points.start.y - shape.points.end.y
                  );
                  // 在页面渲染图形
                  switch (activeShape) {
                    case IShapeType.ELLIPSE:
                      {
                        let ellipse =
                          canvas.getActiveObject() as fabric.Ellipse;
                        if (ellipse) {
                          // 如果已存在
                          ellipse.set({
                            left: left,
                            top: top,
                            width: width,
                            height: height,
                            rx: width / 2,
                            ry: height / 2,
                          });
                        } else {
                          // 如果不存在
                          const color = new iro.Color(shape.color);
                          color.alpha = shape.opacity;
                          ellipse = new fabric.Ellipse({
                            left: left,
                            top: top,
                            width: width,
                            height: height,
                            rx: width / 2,
                            ry: height / 2,
                            stroke: color.hex8String,
                            strokeWidth: shape.size,
                            fill: shape.fill,
                            opacity: shape.opacity,
                          });
                          canvas.setActiveObject(ellipse);
                          canvas.add(ellipse);
                        }
                      }
                      break;
                    case IShapeType.RECTANGLE:
                      {
                        let rectangle = canvas.getActiveObject() as fabric.Rect;
                        if (rectangle) {
                          // 如果已存在
                          rectangle.set({
                            left: left,
                            top: top,
                            width: width,
                            height: height,
                          });
                        } else {
                          // 如果不存在
                          const color = new iro.Color(shape.color);
                          color.alpha = shape.opacity;
                          rectangle = new fabric.Rect({
                            left: left,
                            top: top,
                            width: width,
                            height: height,
                            rx: shape.radius,
                            ry: shape.radius,
                            stroke: color.hex8String,
                            strokeWidth: shape.size,
                            fill: shape.fill,
                            opacity: shape.opacity,
                          });
                          canvas.setActiveObject(rectangle);
                          canvas.add(rectangle);
                        }
                      }
                      break;
                    case IShapeType.TRIANGLE:
                      {
                        let triangle =
                          canvas.getActiveObject() as fabric.Triangle;
                        if (triangle) {
                          // 如果已存在
                          triangle.set({
                            left: left,
                            top: top,
                            width: width,
                            height: height,
                          });
                        } else {
                          // 如果不存在
                          const color = new iro.Color(shape.color);
                          color.alpha = shape.opacity;
                          triangle = new fabric.Triangle({
                            left: left,
                            top: top,
                            width: width,
                            height: height,
                            stroke: color.hex8String,
                            strokeWidth: shape.size,
                            fill: shape.fill,
                            opacity: shape.opacity,
                          });
                          canvas.setActiveObject(triangle);
                          canvas.add(triangle);
                        }
                      }
                      break;
                    case IShapeType.LINE:
                      {
                        let line = canvas.getActiveObject() as fabric.Line;
                        if (line) {
                          // 如果已存在
                          line.set({
                            x1: shape.points.start.x,
                            y1: shape.points.start.y,
                            x2: shape.points.end.x,
                            y2: shape.points.end.y,
                          });
                        } else {
                          // 如果不存在
                          const color = new iro.Color(shape.color);
                          color.alpha = shape.opacity;
                          line = new fabric.Line(
                            [
                              shape.points.start.x,
                              shape.points.start.y,
                              shape.points.end.x,
                              shape.points.end.y,
                            ],
                            {
                              stroke: color.hex8String,
                              strokeWidth: shape.size,
                              fill: shape.fill,
                              opacity: shape.opacity,
                            }
                          );
                          canvas.setActiveObject(line);
                          canvas.add(line);
                        }
                      }
                      break;
                  }
                  canvas.renderAll();
                }
              }
            });
            // 鼠标抬起，结束形状的绘制
            this.canvas.on("mouse:up", (e) => {
              const currentMode = getCurrentMode();
              const canvas = getCanvas();
              if (currentMode === ICanvasMode.SHAPE && canvas) {
                const activeShape = getActiveShape();
                const shape = defaultShapes.get(activeShape);
                if (shape) {
                  const endX = e.pointer?.x;
                  const endY = e.pointer?.y;
                  if (endX !== undefined && endY !== undefined) {
                    shape.points.end.x = endX;
                    shape.points.end.y = endY;
                  }
                  const top = Math.min(
                    shape.points.start.y,
                    shape.points.end.y
                  );
                  const left = Math.min(
                    shape.points.start.x,
                    shape.points.end.x
                  );
                  const width = Math.abs(
                    shape.points.start.x - shape.points.end.x
                  );
                  const height = Math.abs(
                    shape.points.start.y - shape.points.end.y
                  );
                  switch (activeShape) {
                    case IShapeType.ELLIPSE:
                      {
                        const ellipse =
                          canvas.getActiveObject() as fabric.Ellipse;
                        if (ellipse) {
                          ellipse.set({
                            left: left,
                            top: top,
                            width: width,
                            height: height,
                            rx: width / 2,
                            ry: height / 2,
                          });
                        }
                      }
                      break;
                    case IShapeType.RECTANGLE:
                      {
                        const rectangle =
                          canvas.getActiveObject() as fabric.Rect;
                        if (rectangle) {
                          rectangle.set({
                            left: left,
                            top: top,
                            width: width,
                            height: height,
                          });
                        }
                      }
                      break;
                    case IShapeType.TRIANGLE:
                      {
                        const triangle =
                          canvas.getActiveObject() as fabric.Triangle;
                        if (triangle) {
                          triangle.set({
                            left: left,
                            top: top,
                            width: width,
                            height: height,
                          });
                        }
                      }
                      break;
                    case IShapeType.LINE:
                      {
                        const line = canvas.getActiveObject() as fabric.Line;
                        if (line) {
                          line.set({
                            x1: shape.points.start.x,
                            y1: shape.points.start.y,
                            x2: shape.points.end.x,
                            y2: shape.points.end.y,
                          });
                        }
                      }
                      break;
                  }
                  canvas.discardActiveObject();
                  canvas.renderAll();
                  // 清空形状的绘制坐标
                  shape.points.start.x = 0;
                  shape.points.start.y = 0;
                  shape.points.end.x = 0;
                  shape.points.end.y = 0;
                  endDrawing();
                }
              }
            });
          }
          break;
        case ICanvasMode.STICKERS:
          {
            // 便签模式
            // 便签本质就是个特殊的文本框
            this.canvas.isDrawingMode = false;
            this.canvas.selection = true;
            this.canvas.skipTargetFind = false;
            const getCanvas = () => {
              return this.canvas;
            };
            const getCurrentMode = () => {
              return this.canvasMode;
            };
            this.canvas.on("mouse:down", (e) => {
              const currentMode = getCurrentMode();
              const canvas = getCanvas();
              if (currentMode === ICanvasMode.STICKERS && canvas) {
                if (e.target) {
                  if (e.target.type === "sticker") {
                    // 如果有元素，并且文字是文字，则弹出文字编辑器
                    canvas.setActiveObject(e.target);
                    canvas.renderAll();
                  }
                } else {
                  // 新建文字框
                  const text = new fabric.Textbox("", {
                    left: e.pointer?.x,
                    top: e.pointer?.y,
                    fontSize: 25,
                    editable: true,
                    hasBorders: true,
                    hasControls: true,
                    type: "sticker",
                    width: 100,
                    height: 100,
                    strokeWidth: 50,
                    backgroundColor: "#e4ff9e",
                    shadow: "#cdcdcd 6px 9px 13px",
                  });
                  canvas.add(text);
                  text.enterEditing();
                  text.hiddenTextarea?.focus();
                  canvas.setActiveObject(text);
                  canvas.renderAll();
                }
              }
            });
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
});

export default CanvasStore;
