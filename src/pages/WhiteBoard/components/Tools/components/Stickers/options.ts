/**
 * 绘制便签
 * @param e
 * @param canvas
 */
export function drawSticker(e: fabric.IEvent, canvas: fabric.Canvas) {
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
