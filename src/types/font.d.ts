export enum IFontWeight {
  NORMAL = "normal",
  BOLD = "bold",
  BOLDER = "bolder",
  LIGHTER = "lighter",
  WEIGHT_100 = "100",
  WEIGHT_200 = "200",
  WEIGHT_300 = "300",
  WEIGHT_400 = "400",
  WEIGHT_500 = "500",
  WEIGHT_600 = "600",
  WEIGHT_700 = "700",
  WEIGHT_800 = "800",
  WEIGHT_900 = "900",
}

export enum IFontStyle {
  NORMAL = "normal",
  ITALIC = "italic",
  OBLIQUE = "oblique",
}

export enum ITextAlign {
  LEFT = "left",
  CENTER = "center",
  RIGHT = "right",
  JUSTIFY = "justify",
}

/**
 * 字体样式
 * @param fontSize 字体大小
 * @param fontFamily 字体
 * @param color 字体颜色
 * @param backgroundColor 背景颜色
 * @param underline 是否有下划线
 * @param lineThrough 是否有删除线
 * @param fontWeight 加粗
 * @param fontStyle 斜体
 * @param subscript 下标
 * @param superscript 上标
 * @param textAlign 对齐
 */
export interface ITextStyle {
  fontSize: number;
  fontFamily: string;
  color: string;
  backgroundColor: string;
  underline: boolean;
  lineThrough: boolean;
  fontWeight: string | number | undefined;
  fontStyle: string | undefined;
  subscript: boolean;
  superscript: boolean;
  textAlign: string | undefined;
}
