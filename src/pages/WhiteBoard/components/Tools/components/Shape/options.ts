import iro from "@jaames/iro";
import { defaultShapes } from "@/constants/shape";
import { IShapeType } from "@/types/shape.d";

/**
 * 准备绘制形状
 * @param e
 * @param canvas
 * @param activeShape
 */
export function startDrawShape(
  e: fabric.IEvent,
  canvas: fabric.Canvas,
  activeShape: IShapeType
) {
  canvas?.discardActiveObject();
  // 形状模式下，记录鼠标按下的坐标起始位置
  const startX = e.absolutePointer?.x;
  const startY = e.absolutePointer?.y;
  if (startX !== undefined && startY !== undefined) {
    // 如果有坐标，则记录至图形属性中
    const shape = defaultShapes.get(activeShape);
    if (shape) {
      // 只记录初始位置，鼠标有移动时再绘制图形
      shape.points.start.x = startX;
      shape.points.start.y = startY;
    }
  }
}

/**
 * 开始绘制形状
 * @param e
 * @param canvas
 * @param activeShape
 */
export function drawingShape(
  e: fabric.IEvent,
  canvas: fabric.Canvas,
  activeShape: IShapeType
) {
  const shape = defaultShapes.get(activeShape);
  if (shape) {
    const endX = e.absolutePointer?.x;
    const endY = e.absolutePointer?.y;
    if (endX !== undefined && endY !== undefined) {
      shape.points.end.x = endX;
      shape.points.end.y = endY;
    }
    const top = Math.min(shape.points.start.y, shape.points.end.y);
    const left = Math.min(shape.points.start.x, shape.points.end.x);
    const width = Math.abs(shape.points.start.x - shape.points.end.x);
    const height = Math.abs(shape.points.start.y - shape.points.end.y);
    // 在页面渲染图形
    switch (activeShape) {
      case IShapeType.ELLIPSE:
        {
          let ellipse = canvas.getActiveObject() as fabric.Ellipse;
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
            const zoom = 1 / canvas.getZoom();
            ellipse = new fabric.Ellipse({
              left: left,
              top: top,
              width: width,
              height: height,
              rx: width / 2,
              ry: height / 2,
              stroke: color.hex8String,
              strokeWidth: shape.size * zoom,
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
            const zoom = 1 / canvas.getZoom();
            rectangle = new fabric.Rect({
              left: left,
              top: top,
              width: width,
              height: height,
              rx: shape.radius,
              ry: shape.radius,
              stroke: color.hex8String,
              strokeWidth: shape.size * zoom,
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
          let triangle = canvas.getActiveObject() as fabric.Triangle;
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
            const zoom = 1 / canvas.getZoom();
            triangle = new fabric.Triangle({
              left: left,
              top: top,
              width: width,
              height: height,
              stroke: color.hex8String,
              strokeWidth: shape.size * zoom,
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
            const zoom = 1 / canvas.getZoom();
            line = new fabric.Line(
              [
                shape.points.start.x,
                shape.points.start.y,
                shape.points.end.x,
                shape.points.end.y,
              ],
              {
                stroke: color.hex8String,
                strokeWidth: shape.size * zoom,
                fill: shape.fill,
                opacity: shape.opacity,
              }
            );
            // 直线范围太大，点击空白如果选中会影响正常操作
            line.perPixelTargetFind = true;
            canvas.setActiveObject(line);
            canvas.add(line);
          }
        }
        break;
    }
    canvas.renderAll();
  }
}

/**
 * 结束绘制
 * @param e
 * @param canvas
 * @param activeShape
 */
export function stopDrawingShape(
  e: fabric.IEvent,
  canvas: fabric.Canvas,
  activeShape: IShapeType
) {
  const shape = defaultShapes.get(activeShape);
  if (shape) {
    const endX = e.absolutePointer?.x;
    const endY = e.absolutePointer?.y;
    if (endX !== undefined && endY !== undefined) {
      shape.points.end.x = endX;
      shape.points.end.y = endY;
    }
    const top = Math.min(shape.points.start.y, shape.points.end.y);
    const left = Math.min(shape.points.start.x, shape.points.end.x);
    const width = Math.abs(shape.points.start.x - shape.points.end.x);
    const height = Math.abs(shape.points.start.y - shape.points.end.y);
    switch (activeShape) {
      case IShapeType.ELLIPSE:
        {
          const ellipse = canvas.getActiveObject() as fabric.Ellipse;
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
          const rectangle = canvas.getActiveObject() as fabric.Rect;
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
          const triangle = canvas.getActiveObject() as fabric.Triangle;
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
  }
}
