const maxScale = 5;
const minScale = 0.1;

/**
 * 画板鼠标缩放
 */
export function zoomToPoint(
  e: fabric.IEvent<WheelEvent>,
  canvas: fabric.Canvas,
  setZoom: React.Dispatch<React.SetStateAction<number>>
) {
  e.e.preventDefault();
  e.e.stopPropagation();
  const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
  if (isMac) {
    // Mac系统
    if (e.e.metaKey) {
      // command + 滚轮
      let scale =
        e.e.deltaY > 0 ? canvas.getZoom() * 1.1 : canvas.getZoom() * 0.9;
      scale = Math.max(minScale, Math.min(scale, maxScale));
      // 在缩放范围内，缩放
      if (scale >= minScale && scale <= maxScale) {
        canvas.zoomToPoint({ x: e.e.offsetX, y: e.e.offsetY }, scale);
        setZoom(scale);
      }
    }
    if (e.e.ctrlKey && (e.e as any).wheelDeltaY % e.e.deltaY !== 0) {
      // 触控板缩放
      let scale =
        e.e.deltaY < 0 ? canvas.getZoom() * 1.1 : canvas.getZoom() * 0.9;
      // 在缩放范围内，缩放
      scale = Math.max(minScale, Math.min(scale, maxScale));
      if (scale >= minScale && scale <= maxScale) {
        canvas.zoomToPoint({ x: e.e.offsetX, y: e.e.offsetY }, scale);
        setZoom(scale);
      }
    }
  } else {
    // 其他系统
    if (e.e.ctrlKey) {
      // ctrl + 滚轮
      let scale =
        e.e.deltaY > 0 ? canvas.getZoom() * 1.1 : canvas.getZoom() * 0.9;
      // 在缩放范围内，缩放
      scale = Math.max(minScale, Math.min(scale, maxScale));
      if (scale >= minScale && scale <= maxScale) {
        canvas.zoomToPoint({ x: e.e.offsetX, y: e.e.offsetY }, scale);
        setZoom(scale);
      }
    }
  }
}

/**
 * 画板按钮缩放
 */
export function zoomToPointByButton(
  scale: number,
  canvas: fabric.Canvas,
  setZoom: React.Dispatch<React.SetStateAction<number>>
) {
  scale = Math.max(minScale, Math.min(scale, maxScale));
  if (scale >= minScale && scale <= maxScale) {
    canvas.zoomToPoint(
      { x: window.innerWidth / 2, y: window.innerHeight / 2 },
      scale
    );
    setZoom(scale);
  }
}
