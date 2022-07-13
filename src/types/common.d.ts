/**
 * 描边样式
 */
export enum IBorderStyle {
  SOLID = "solid",
  DASHED = "dashed",
  DOTTED = "dotted",
}

/**
 * 坐标点
 * @param {number} x x坐标
 * @param {number} y y坐标
 */
export interface IPoint {
  x: number;
  y: number;
}

/**
 * 形状起止区域
 * @param {IPoint} start 起始点
 * @param {IPoint} end 结束点
 */
export interface IPointRange {
  start: IPoint;
  end: IPoint;
}
