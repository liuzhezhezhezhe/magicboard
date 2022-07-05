import { fabric } from "fabric";
import { isEmpty } from "lodash";

import { IFontStyle, IFontWeight, ITextStyle } from "@/types/font.d";

/**
 * 样式分组
 * @param {any} target 目标分组内容
 * @param {number} start 起始索引
 * @param {number} end 结束索引
 */
export interface IStyleGroup {
  target: any;
  start: number;
  end: number;
}

/**
 * 放大或缩小文字
 * @param canvas 画布
 * @param setFontSize 设置文字大小
 * @param direction 放大/缩小
 * @returns null
 */
export function handleChangeFontSize(
  canvas: fabric.Canvas,
  setTextStyle: React.Dispatch<React.SetStateAction<ITextStyle>>,
  direction: -1 | 1
) {
  const text = canvas.getActiveObject() as fabric.Textbox;
  if (text) {
    const textLength = text.text?.length || 0;
    if (textLength === 0) {
      // 当前文本框内无文字时，调整文本框内初始化文字大小
      if (text.fontSize !== undefined) {
        // 设置过文字大小
        let newFontSize = text.fontSize + direction * 5;
        newFontSize = newFontSize < 1 ? 1 : newFontSize;
        text.fontSize = newFontSize;
        setTextStyle((prev) => ({ ...prev, fontSize: newFontSize }));
        text.enterEditing();
        text.hiddenTextarea?.focus();
        canvas.requestRenderAll();
        return;
      } else {
        // 未设置过文字大小
        setTextStyle((prev) => {
          let newFontSize = prev.fontSize + direction * 5;
          newFontSize = newFontSize < 1 ? 1 : newFontSize;
          text.fontSize = newFontSize;
          return { ...prev, fontSize: newFontSize };
        });
        text.enterEditing();
        text.hiddenTextarea?.focus();
        canvas.requestRenderAll();
        return;
      }
    } else {
      // 当前文本框内有文字时，分两种情况调整文本框内文字大小
      let { selectionStart, selectionEnd } = text;
      const cursorPosition = selectionStart;
      if (selectionStart === selectionEnd) {
        // 未选中任何文字时，默认需要调整的范围变为从开始到结束
        selectionStart = 0;
        selectionEnd = textLength;
      }
      // 只影响selectionStart到selectionEnd之间的文字
      const fontSizeList = text
        .getSelectionStyles(selectionStart, selectionEnd)
        .map((style) => style.fontSize);
      if (
        new Set(fontSizeList.filter((item) => item !== undefined)).size === 0
      ) {
        // 都没有设置过文字大小时，设置文字大小
        if (text.fontSize !== undefined) {
          // 文本框内文字本身有大小
          let newFontSize = text.fontSize + direction * 5;
          newFontSize = newFontSize < 1 ? 1 : newFontSize;
          if (selectionStart === 0 && selectionEnd === textLength) {
            // 全部设置文字大小
            text.fontSize = newFontSize;
          } else {
            // 其他情况，只设置selectionStart到selectionEnd之间的文字
            text.setSelectionStyles(
              { fontSize: newFontSize },
              selectionStart,
              selectionEnd
            );
          }
          setTextStyle((prev) => ({ ...prev, fontSize: newFontSize }));
        } else {
          // 从预设种设置文字大小
          setTextStyle((prev) => {
            let newFontSize = prev.fontSize + direction * 5;
            newFontSize = newFontSize < 1 ? 1 : newFontSize;
            if (selectionStart === 0 && selectionEnd === textLength) {
              // 全部设置文字大小
              text.fontSize = newFontSize;
            } else {
              // 其他情况，只设置selectionStart到selectionEnd之间的文字
              text.setSelectionStyles(
                { fontSize: newFontSize },
                selectionStart,
                selectionEnd
              );
            }
            return { ...prev, fontSize: newFontSize };
          });
        }
        text.hiddenTextarea?.focus();
        text.enterEditing();
        canvas.requestRenderAll();
        return;
      } else {
        // 文字中有设置过文字大小时，调整文字大小
        if (fontSizeList.every((item) => item === fontSizeList[0])) {
          // 所选中的文字大小都相同
          let newFontSize = fontSizeList[0] + direction * 5;
          newFontSize = newFontSize < 1 ? 1 : newFontSize;
          if (!isNaN(newFontSize)) {
            text.setSelectionStyles(
              { fontSize: newFontSize },
              selectionStart,
              selectionEnd
            );
            setTextStyle((prev) => ({ ...prev, fontSize: newFontSize }));
          } else {
            const newFontSize = 25 + direction * 5;
            text.setSelectionStyles(
              { fontSize: newFontSize },
              selectionStart,
              selectionEnd
            );
            setTextStyle((prev) => ({ ...prev, fontSize: newFontSize }));
          }
          text.hiddenTextarea?.focus();
          text.enterEditing();
          canvas.requestRenderAll();
          return;
        } else {
          // 所选文字每个都有自己的大小，则需要逐一设置文字大小
          if (selectionStart !== undefined && selectionEnd !== undefined) {
            // 获取区域内文本样式
            const fontStyles = text.getSelectionStyles(
              selectionStart,
              selectionEnd
            );
            // 对区域内文本按照字号大小进行分组，保留每个字号(undefined也算)的起止位置
            const fontSizeGroup = fontStyles.reduce((acc, cur, index) => {
              const targetIndex = acc.findLastIndex(
                (item: IStyleGroup) => item.target === cur.fontSize
              );
              if (targetIndex === -1) {
                // 没有找到相同字号的，则添加新的字号
                acc.push({
                  target: cur.fontSize,
                  start: index,
                  end: index + 1,
                });
              } else {
                // 找到相同字号的
                if (index === acc[targetIndex].end) {
                  // 当前位置是相同字号的结束位置，则设置为下一个字号的起始位置
                  acc[targetIndex].end = index + 1;
                } else {
                  // 当前位置与相同字号的结束位置之间有间隔内容，则添加新的字号
                  acc.push({
                    target: cur.fontSize,
                    start: index,
                    end: index + 1,
                  });
                }
              }
              return acc;
            }, [] as IStyleGroup[]);
            // 对每个字号进行调整
            if (selectionStart !== undefined) {
              for (const item of fontSizeGroup) {
                let newFontSize = (item.target as number) + direction * 5;
                newFontSize = newFontSize < 1 ? 1 : newFontSize;
                if (!isNaN(newFontSize)) {
                  text.setSelectionStyles(
                    { fontSize: newFontSize },
                    selectionStart + item.start,
                    selectionStart + item.end
                  );
                } else {
                  const newFontSize = 25 + direction * 5;
                  text.setSelectionStyles(
                    { fontSize: newFontSize },
                    selectionStart + item.start,
                    selectionStart + item.end
                  );
                }
              }
            }
          }
          text.hiddenTextarea?.focus();
          text.enterEditing();
          canvas.requestRenderAll();
          setTextStyle((prev) => ({ ...prev, fontSize: -1 }));
        }
      }
    }
  }
}

/**
 * 初始化文字样式
 * @param text 文字对象
 * @returns {ITextStyle} 文字样式
 */
export function initStyles(text: fabric.Textbox) {
  let initTextStyle: ITextStyle = {
    fontSize: text.fontSize || 25,
    fontFamily: text.fontFamily || "微软雅黑",
    color: text.fill?.toString() || "#000000",
    backgroundColor: text.textBackgroundColor || "",
    underline: text.underline || false,
    lineThrough: text.linethrough || false,
    fontWeight: text.fontWeight || IFontWeight.NORMAL,
    fontStyle: text.fontStyle || IFontStyle.NORMAL,
    subscript: text.deltaY === 0,
    superscript: text.deltaY === 0,
    textAlign: text.textAlign || IFontStyle.NORMAL,
  };
  const selectedStyles = text.getSelectionStyles();
  const commonStyles: { [key in keyof ITextStyle]: any[] } = {
    fontSize: [],
    fontFamily: [],
    color: [],
    backgroundColor: [],
    underline: [],
    lineThrough: [],
    fontWeight: [],
    fontStyle: [],
    subscript: [],
    superscript: [],
    textAlign: [],
  };
  if (selectedStyles.length > 0) {
    // 选择了多个文字
    // 找出每个文字的共同属性
    selectedStyles
      .filter((item) => !isEmpty(item))
      .forEach((item) => {
        // 如果不是空对象，则将每个item中的属性放入commonStyles中
        if (!commonStyles.fontSize.includes(item?.fontSize)) {
          commonStyles.fontSize.push(item?.fontSize);
        }
        if (!commonStyles.fontFamily.includes(item?.fontFamily)) {
          commonStyles.fontFamily.push(item?.fontFamily);
        }
        if (!commonStyles.color.includes(item?.fill)) {
          commonStyles.color.push(item?.fill);
        }
        if (!commonStyles.backgroundColor.includes(item?.textBackgroundColor)) {
          commonStyles.backgroundColor.push(item?.textBackgroundColor);
        }
        if (!commonStyles.underline.includes(item?.underline)) {
          commonStyles.underline.push(item?.underline);
        }
        if (!commonStyles.lineThrough.includes(item?.linethrough)) {
          commonStyles.lineThrough.push(item?.linethrough);
        }
        if (!commonStyles.fontWeight.includes(item?.fontWeight)) {
          commonStyles.fontWeight.push(item?.fontWeight);
        }
        if (!commonStyles.fontStyle.includes(item?.fontStyle)) {
          commonStyles.fontStyle.push(item?.fontStyle);
        }
        if (!commonStyles.subscript.includes(item?.deltaY !== 0)) {
          commonStyles.subscript.push(item?.deltaY !== 0);
        }
        if (!commonStyles.superscript.includes(item?.deltaY !== 0)) {
          commonStyles.superscript.push(item?.deltaY !== 0);
        }
        if (!commonStyles.textAlign.includes(item?.textAlign)) {
          commonStyles.textAlign.push(item?.textAlign);
        }
      });
    // 如果共同属性中只有一个元素，则把该元素赋值给initTextStyle
    if (
      commonStyles.fontSize.length === 1 &&
      commonStyles.fontSize[0] !== undefined
    ) {
      initTextStyle.fontSize = commonStyles.fontSize[0];
    } else if (commonStyles.fontSize.length > 1) {
      initTextStyle.fontSize = -1;
    }
    if (
      commonStyles.fontFamily.length === 1 &&
      commonStyles.fontFamily[0] !== undefined
    ) {
      initTextStyle.fontFamily = commonStyles.fontFamily[0];
    } else if (commonStyles.fontFamily.length > 1) {
      initTextStyle.fontFamily = "";
    }
    if (
      commonStyles.color.length === 1 &&
      commonStyles.color[0] !== undefined
    ) {
      initTextStyle.color = commonStyles.color[0];
    } else if (commonStyles.color.length > 1) {
      initTextStyle.color = "";
    }
    if (
      commonStyles.backgroundColor.length === 1 &&
      commonStyles.backgroundColor[0] !== undefined
    ) {
      initTextStyle.backgroundColor = commonStyles.backgroundColor[0];
    } else if (commonStyles.backgroundColor.length > 1) {
      initTextStyle.backgroundColor = "";
    }
    if (
      commonStyles.underline.length === 1 &&
      commonStyles.underline[0] !== undefined
    ) {
      initTextStyle.underline = commonStyles.underline[0];
    } else if (commonStyles.underline.length > 1) {
      initTextStyle.underline = false;
    }
    if (
      commonStyles.lineThrough.length === 1 &&
      commonStyles.lineThrough[0] !== undefined
    ) {
      initTextStyle.lineThrough = commonStyles.lineThrough[0];
    } else if (commonStyles.lineThrough.length > 1) {
      initTextStyle.lineThrough = false;
    }
    if (
      commonStyles.fontWeight.length === 1 &&
      commonStyles.fontWeight[0] !== undefined
    ) {
      initTextStyle.fontWeight = commonStyles.fontWeight[0];
    } else if (commonStyles.fontWeight.length > 1) {
      initTextStyle.fontWeight = IFontWeight.NORMAL;
    }
    if (
      commonStyles.fontStyle.length === 1 &&
      commonStyles.fontStyle[0] !== undefined
    ) {
      initTextStyle.fontStyle = commonStyles.fontStyle[0];
    } else if (commonStyles.fontStyle.length > 1) {
      initTextStyle.fontStyle = IFontStyle.NORMAL;
    }
    if (
      commonStyles.subscript.length === 1 &&
      commonStyles.subscript[0] !== undefined
    ) {
      initTextStyle.subscript = commonStyles.subscript[0];
    }
    if (
      commonStyles.superscript.length === 1 &&
      commonStyles.superscript[0] !== undefined
    ) {
      initTextStyle.superscript = commonStyles.superscript[0];
    }
    if (
      commonStyles.textAlign.length === 1 &&
      commonStyles.textAlign[0] !== undefined
    ) {
      initTextStyle.textAlign = commonStyles.textAlign[0];
    } else if (commonStyles.textAlign.length > 1) {
      initTextStyle.textAlign = IFontStyle.NORMAL;
    }
  }
  return initTextStyle;
}
