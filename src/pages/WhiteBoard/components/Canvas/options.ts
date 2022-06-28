/**
 * 画板鼠标缩放
 */
export function zoomToPoint(
  e: fabric.IEvent<WheelEvent>,
  canvas: fabric.Canvas
) {
  e.e.preventDefault();
  e.e.stopPropagation();
  const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
  const maxScale = 5;
  const minScale = 0.1;
  if (isMac) {
    // Mac系统
    if (e.e.metaKey) {
      // command + 滚轮
      const scale =
        e.e.deltaY > 0 ? canvas.getZoom() * 1.1 : canvas.getZoom() * 0.9;
      // 在缩放范围内，缩放
      if (scale > minScale && scale < maxScale) {
        canvas.zoomToPoint({ x: e.e.offsetX, y: e.e.offsetY }, scale);
      }
    }
    if (e.e.ctrlKey && (e.e as any).wheelDeltaY % e.e.deltaY !== 0) {
      // 触控板缩放
      const scale =
        e.e.deltaY < 0 ? canvas.getZoom() * 1.1 : canvas.getZoom() * 0.9;
      // 在缩放范围内，缩放
      if (scale > minScale && scale < maxScale) {
        canvas.zoomToPoint({ x: e.e.offsetX, y: e.e.offsetY }, scale);
      }
    }
  } else {
    // 其他系统
    if (e.e.ctrlKey) {
      // ctrl + 滚轮
      const scale =
        e.e.deltaY > 0 ? canvas.getZoom() * 1.1 : canvas.getZoom() * 0.9;
      // 在缩放范围内，缩放
      if (scale > minScale && scale < maxScale) {
        canvas.zoomToPoint({ x: e.e.offsetX, y: e.e.offsetY }, scale);
      }
    }
  }
}
