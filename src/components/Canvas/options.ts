import { ConnectionControl } from "@/mixins/ConnectionControl";
import CanvasStore from "@/stores/canvasStore";
import { IControlType } from "@/types/control.d";

/**
 * 渲染四周控制按钮包裹层
 * @param type 控制类型
 * @returns 渲染函数
 */
function renderWrapper(type: IControlType) {
  return function (
    this: any,
    ctx: CanvasRenderingContext2D,
    left: number,
    top: number,
    styleOverride: any,
    fabricObject: fabric.Object
  ) {
    const activeObject = fabricObject as fabric.ActiveSelection;
    const { tl, tr, bl, br } = activeObject.aCoords!;
    // 根据类型计算sizeX与sizeY
    switch (type) {
      case IControlType.ml:
        this.sizeX = 10;
        this.sizeY = Math.sqrt(
          Math.pow(tl.y - bl.y, 2) + Math.pow(tl.x - bl.x, 2)
        );
        break;
      case IControlType.mr:
        this.sizeX = 10;
        this.sizeY = Math.sqrt(
          Math.pow(br.x - tr.x, 2) + Math.pow(br.y - tr.y, 2)
        );
        break;
      case IControlType.mt:
        this.sizeX = Math.sqrt(
          Math.pow(tl.x - tr.x, 2) + Math.pow(tl.y - tr.y, 2)
        );
        this.sizeY = 10;
        break;
      case IControlType.mb:
        this.sizeX = Math.sqrt(
          Math.pow(bl.x - br.x, 2) + Math.pow(bl.y - br.y, 2)
        );
        this.sizeY = 10;
        break;
    }

    // 调用默认渲染，渲染出来一个矩形
    styleOverride.cornerStrokeColor = "transparent";
    fabric.controlsUtils.renderSquareControl.call(
      this,
      ctx,
      left,
      top,
      styleOverride,
      fabricObject
    );
    styleOverride.cornerStrokeColor = "#2196f3";
  };
}

/**
 * 重置控制按钮样式
 */
function resetControlStyle() {
  // 基本控制按钮
  fabric.Object.prototype.cornerStyle = "circle";
  fabric.Object.prototype.cornerColor = "#2196f3";

  // 旋转按钮
  fabric.Object.prototype.controls.mtr.withConnection = false;
  fabric.Object.prototype.controls.mtr.offsetY = -45;

  // 四个角的缩放按钮
  // 左上角按钮
  fabric.Object.prototype.controls.tl.offsetX = -10;
  fabric.Object.prototype.controls.tl.offsetY = -10;
  fabric.Textbox.prototype.controls.tl.visible = false;
  // 右上角按钮
  fabric.Object.prototype.controls.tr.offsetX = 10;
  fabric.Object.prototype.controls.tr.offsetY = -10;
  fabric.Textbox.prototype.controls.tr.visible = false;
  // 左下角按钮
  fabric.Object.prototype.controls.bl.offsetX = -10;
  fabric.Object.prototype.controls.bl.offsetY = 10;
  fabric.Textbox.prototype.controls.bl.visible = false;
  // 右下角按钮
  fabric.Object.prototype.controls.br.offsetX = 10;
  fabric.Object.prototype.controls.br.offsetY = 10;
  fabric.Textbox.prototype.controls.br.visible = false;

  // 四条边的缩放按钮
  // 左边缩放按钮
  fabric.Object.prototype.controls.ml.render = renderWrapper(IControlType.ml);
  // 左边文字缩放按钮
  fabric.Textbox.prototype.controls.ml.render = renderWrapper(IControlType.ml);

  // 右边缩放按钮
  fabric.Object.prototype.controls.mr.render = renderWrapper(IControlType.mr);
  // 右边文字缩放按钮
  fabric.Textbox.prototype.controls.mr.render = renderWrapper(IControlType.mr);

  // 上边缩放按钮
  fabric.Object.prototype.controls.mt.render = renderWrapper(IControlType.mt);

  // 下边缩放按钮
  fabric.Object.prototype.controls.mb.render = renderWrapper(IControlType.mb);
}

/**
 * 增加四条边的连线控制按钮
 */
function addConnectionControls() {
  // 左边连线按钮
  fabric.Object.prototype.controls.mll = new ConnectionControl(
    IControlType.mll,
    () => CanvasStore.canvas,
    {
      x: -0.5,
      y: 0,
      offsetX: -20,
      offsetY: 0,
      cursorStyle: "pointer",
    }
  );

  // 右边连线按钮
  fabric.Object.prototype.controls.mrl = new ConnectionControl(
    IControlType.mrl,
    () => CanvasStore.canvas,
    {
      x: 0.5,
      y: 0,
      offsetX: 20,
      offsetY: 0,
      cursorStyle: "pointer",
    }
  );

  // 上边连线按钮
  fabric.Object.prototype.controls.mtl = new ConnectionControl(
    IControlType.mtl,
    () => CanvasStore.canvas,
    {
      x: 0,
      y: -0.5,
      offsetX: 0,
      offsetY: -20,
      cursorStyle: "pointer",
    }
  );

  // 上边连线按钮
  fabric.Object.prototype.controls.mbl = new ConnectionControl(
    IControlType.mbl,
    () => CanvasStore.canvas,
    {
      x: 0,
      y: 0.5,
      offsetX: 0,
      offsetY: 20,
      cursorStyle: "pointer",
    }
  );
}

/**
 * 重置控制组件样式
 */
export function resetCanvasControl() {
  // 重置控制按钮样式
  resetControlStyle();

  // 增加四条边的连线控制按钮
  // addConnectionControls();
}
