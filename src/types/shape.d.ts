import React from "react";
import { IBrushParams } from "./brush.d";
/**
 * 常见形状
 */
export enum IShapeType {
  ELLIPSE = "ellipse",
  RECTANGLE = "rectangle",
  TRIANGLE = "triangle",
  LINE = "line",
}

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

/**
 * 形状参数
 * @extends IBrushParams
 * @param {IBorderStyle} style 描边样式
 * @param {number} radius 圆角半径
 * @param {string} fill 是否填充
 */
export interface IShapeParams extends IBrushParams {
  radius: number;
  style: IBorderStyle;
  fill: string;
  points: IPointRange;
}

/**
 * 自定义形状
 * @param {IShapeType} type 形状类型
 * @param {string} name 名称
 * @param {React.ReactNode} icon 图标
 */
export interface ICustomShape {
  type: IShapeType;
  name: string;
  icon: React.ReactNode;
}
