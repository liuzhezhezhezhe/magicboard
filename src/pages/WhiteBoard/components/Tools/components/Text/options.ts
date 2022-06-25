/**
 * 绘制文字
 * @param e
 * @param canvas
 */
export function drawText(e: fabric.IEvent, canvas: fabric.Canvas) {
  // 文字模式下，点击空白区域新建文字，或者编辑已有文字
  // 如果点了其他地方，清除掉没有文字的文字框
  canvas.getObjects().forEach((obj) => {
    if (obj.type === "textbox" && (obj as fabric.Textbox).text === "") {
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
