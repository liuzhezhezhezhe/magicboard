/**
 * 拖拽页面
 * @param e
 * @param canvas
 */
export function drag(e: fabric.IEvent<MouseEvent>, canvas: fabric.Canvas) {
  // 拖拽画板
  canvas.relativePan(new fabric.Point(e.e.movementX, e.e.movementY));
}
