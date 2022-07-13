import { IPointRange } from "@/types/common.d";
import { IControlType } from "@/types/control.d";
import { calcControlPoint } from "@/utils/control";

/**
 * 连接线control
 */
export class ConnectionControl extends fabric.Control {
  /**
   * 构造函数
   * @param controlType 控制类型
   * @param getCanvas 获取画布上下文
   * @param options 其他参数
   */
  constructor(
    controlType: IControlType,
    getCanvas: () => fabric.Canvas | null,
    options: Partial<ConnectionControl>
  ) {
    super(options);
    this.controlType = controlType;
    this._getCanvas = getCanvas;
  }

  // 控制类型
  public controlType: IControlType;

  // 获取画布上下文(用于在画布中渲染连线)
  private _getCanvas: () => fabric.Canvas | null;

  // 当前正在绘制的线段起止点
  private _line: IPointRange = {
    start: { x: 0, y: 0 },
    end: { x: 0, y: 0 },
  };

  // 当前正在绘制的线段控制点
  private _currentLine: fabric.Path | undefined = undefined;

  // 绘制状态
  private _isDrawing: boolean = false;

  // 向外延伸的连接线
  private _exlines?: fabric.Path[] = [];
  // 其他地方延伸至该点的连接线
  private _inlines?: fabric.Path[] = [];

  /**
   * 渲染控制按钮
   * @param ctx 画布上下文
   * @param left 圆点位置
   * @param top 圆点位置
   * @param styleOverride 样式覆盖
   * @param fabricObject 所在对象
   */
  render = (
    ctx: CanvasRenderingContext2D,
    left: number,
    top: number,
    styleOverride: any,
    fabricObject: fabric.Object
  ) => {
    // 调用默认渲染，渲染出来一个圆形
    styleOverride.transparentCorners = false;
    this.sizeX = 7;
    this.sizeY = 7;
    fabric.controlsUtils.renderCircleControl.call(
      this,
      ctx,
      left,
      top,
      styleOverride,
      fabricObject
    );

    // 渲染连线
    this._exlines?.forEach((line: fabric.Path) => {
      const path = line.path;
      if (path && path.length === 2) {
        const start = {
          x: left,
          y: top,
        };
        const end = {
          x: left,
          y: top,
        };
        const beignPoint = path[0];
        if (Array.isArray(beignPoint) && beignPoint.length === 3) {
          beignPoint[1] = left;
          beignPoint[2] = top;
        }
        path[0] = beignPoint;
        const endPoint = path[1];
        if (Array.isArray(endPoint) && endPoint.length === 7) {
          end.x = endPoint[5];
          end.y = endPoint[6];
          const [firstControlPoint, secondControlPoint] = calcControlPoint(
            this.controlType,
            start,
            end
          );
          endPoint[1] = firstControlPoint.x;
          endPoint[2] = firstControlPoint.y;
          endPoint[3] = secondControlPoint.x;
          endPoint[4] = secondControlPoint.y;
          endPoint[5] = end.x;
          endPoint[6] = end.y;
        }
        path[1] = endPoint;
      }
      line.path = path;
    });
  };

  /**
   * 鼠标按下事件
   * @param eventData 事件数据
   * @returns
   */
  mouseDownHandler = (eventData: MouseEvent) => {
    const { x, y } = eventData;
    this._line.start = { x, y };
    this._isDrawing = true;
    return false;
  };

  /**
   * 鼠标移动事件
   * @param eventData 事件数据
   * @returns
   */
  actionHandler = (eventData: MouseEvent) => {
    const { x, y } = eventData;
    this._line.end = { x, y };
    if (this._isDrawing) {
      // 计算鼠标移动距离
      const distance = Math.sqrt(
        Math.pow(this._line.start.x - this._line.end.x, 2) +
          Math.pow(this._line.start.y - this._line.end.y, 2)
      );
      if (distance < 5) {
        // 移动距离太短，什么都不做
        return false;
      }
      // 开始绘制曲线
      const start = this._line.start;
      const end = this._line.end;

      const [firstControlPoint, secondControlPoint] = calcControlPoint(
        this.controlType,
        start,
        end
      );

      // 绘制曲线
      if (this._currentLine) {
        // 如果之前绘制过，则调整绘制点
        const path = this._currentLine.path;
        if (path && path.length > 0) {
          const last = path[path.length - 1];
          // 如果last是一个数组，且长度为5，则说明是一个曲线
          if (Array.isArray(last) && last.length === 7) {
            // 调整绘制点
            last[1] = firstControlPoint.x;
            last[2] = firstControlPoint.y;
            last[3] = secondControlPoint.x;
            last[4] = secondControlPoint.y;
            last[5] = end.x;
            last[6] = end.y;
          }
          path[path.length - 1] = last;
        }
        this._currentLine.path = path;
      } else {
        const path = new fabric.Path(
          `M ${start.x} ${start.y} C ${firstControlPoint.x} ${firstControlPoint.y}, ${secondControlPoint.x} ${secondControlPoint.y}, ${end.x} ${end.y}`,
          {
            stroke: "black",
            strokeWidth: 3,
            fill: "transparent",
            objectCaching: false,
          }
        );
        this._currentLine = path;
        // 将线会绘制到画布中
        this._getCanvas()?.add(path);
      }
      this._getCanvas()?.requestRenderAll();
    }
    return false;
  };

  /**
   * 鼠标抬起事件
   * @param eventData 事件数据
   * @returns
   */
  mouseUpHandler = (eventData: MouseEvent) => {
    const { x, y } = eventData;
    this._line.end = { x, y };
    // 计算鼠标移动距离
    const distance = Math.sqrt(
      Math.pow(this._line.start.x - this._line.end.x, 2) +
        Math.pow(this._line.start.y - this._line.end.y, 2)
    );
    if (distance < 5) {
      // TODO:点击事件: 弹个窗口，让用户选择要插入的内容（并在两个内容之间连线）
      // 如果之前有绘制图形，则清除绘制图形
      // TODO:删除线短
      this._currentLine = undefined;
      return false;
    }
    // 将绘制的线段加入到线短组中
    if (this._currentLine) {
      this._exlines?.push(this._currentLine);
      this._currentLine = undefined;
      // TODO:弹窗或者连接
    }
    return false;
  };
}
