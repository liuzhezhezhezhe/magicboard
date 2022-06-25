/**
 * 画笔类型
 */
export enum IBrushType {
  BRUSH = "brush",
  HIGHLIGHT = "highlight",
  ERASER = "eraser",
}

/**
 * 画笔参数
 * @param {IBrushType} type 画笔类型
 * @param {boolean} active 是否激活
 * @param {string} color 画笔颜色
 * @param {number} size 画笔大小
 * @param {number} opacity 画笔透明度
 */
export interface IBrushParams {
  color: string;
  size: number;
  opacity: number;
}
