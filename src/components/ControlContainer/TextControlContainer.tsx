import React, { useEffect } from "react";
import { useLocalObservable } from "mobx-react";
import {
  AlignTextCenterOne,
  AlignTextLeftOne,
  AlignTextRightOne,
  Check,
  Sort,
  Strikethrough,
  TextBold,
  TextItalic,
  TextUnderline,
  Write,
} from "@icon-park/react";
import { Theme } from "@icon-park/react/lib/runtime";
import iro from "@jaames/iro";

import ControlContainer from "./BaseControlContainer";
import CanvasStore from "@/store/canvasStore";
import {
  customBackgroundColorList,
  customColorList,
  customFontFamily,
} from "@/constants/font";
import { handleClickOutside } from "@/utils/index";
import { ITextStyle } from "@/types/font.d";

import { handleChangeFontSize, initStyles } from "./options";

import "./index.less";

/**
 * 文字控制组件
 * @param {number} left 控制组件的x坐标(中心点坐标)
 * @param {number} top 控制组件的y坐标
 * @param {string?} className 元素class
 * @param {React.ReactNode} children 子组件
 */
export interface ITextControlProps {
  className?: string;
  children?: React.ReactNode;
}

/**
 * 文字控制
 * 字号、字体、颜色、背景色、加粗、斜体、下划线、删除线、上标、下标、文字对齐
 */
const Index: React.FC<ITextControlProps> = (props) => {
  const { className, children } = props;
  const canvasStore = useLocalObservable(() => CanvasStore);
  const text = canvasStore.canvas?.getActiveObject() as fabric.Textbox;
  const top = text.getBoundingRect().top;
  const [left, setLeft] = React.useState(
    text.getBoundingRect().left + text.getBoundingRect().width / 2
  );
  useEffect(() => {
    if (text) {
      // 宽度发生变化时，更改弹窗的位置
      text.on("changed", () => {
        const calcLeft =
          text.getBoundingRect().left + text.getBoundingRect().width / 2;
        setLeft(calcLeft);
      });
      return () => {
        text.off("changed");
      };
    }
  }, [text]);

  // 初始化选中的文字样式
  const initTextStyle = initStyles(text);
  const [textStyle, setTextStyle] = React.useState<ITextStyle>(initTextStyle);

  // 文本颜色
  const [showFontColorPicker, setShowFontColorPicker] = React.useState(false);
  const colorControlRef = React.createRef<HTMLDivElement>();
  useEffect(() => {
    if (colorControlRef.current) {
      handleClickOutside(colorControlRef, () => {
        setShowFontColorPicker(false);
      });
    }
  }, [colorControlRef]);
  const colorPickerRef = React.createRef<HTMLDivElement>();
  const [colorPicker, setColorPicker] = React.useState<iro.ColorPicker>();
  useEffect(() => {
    if (
      colorPickerRef.current &&
      colorPickerRef.current.childNodes.length <= 0
    ) {
      // 初始化颜色选择器
      // 由于选择弃每次都会在组建下增加一个字元素，所以要保证只有一个元素，则需要判断color-picker下无字元素
      const iroInstance = iro.ColorPicker(colorPickerRef.current, {
        width: 154,
      });
      iroInstance.on("color:change", (color: iro.Color) => {
        setTextStyle((prev) => ({ ...prev, color: color.hex8String }));
        text.setSelectionStyles({ fill: color.hex8String });
        text.hiddenTextarea?.focus();
        text.enterEditing();
        canvasStore.canvas?.requestRenderAll();
      });
      setColorPicker(iroInstance);
    }
  }, []);

  // 背景色
  const [showBackgroundColorPicker, setShowBackgroundColorPicker] =
    React.useState(false);
  const backgroundColorControlRef = React.createRef<HTMLDivElement>();
  useEffect(() => {
    handleClickOutside(backgroundColorControlRef, () => {
      setShowBackgroundColorPicker(false);
    });
  }, [backgroundColorControlRef]);
  const backgroundColorPickerRef = React.createRef<HTMLDivElement>();
  const [backgroundColorPicker, setBackgroundColorPicker] =
    React.useState<iro.ColorPicker>();
  useEffect(() => {
    if (
      backgroundColorPickerRef.current &&
      backgroundColorPickerRef.current.childNodes.length <= 0
    ) {
      // 初始化颜色选择器
      // 由于选择弃每次都会在组建下增加一个字元素，所以要保证只有一个元素，则需要判断color-picker下无子元素
      const iroInstance = iro.ColorPicker(backgroundColorPickerRef.current, {
        width: 154,
      });
      iroInstance.on("color:change", (color: iro.Color) => {
        setTextStyle((prev) => ({
          ...prev,
          backgroundColor: color.hex8String,
        }));
        text.setSelectionStyles({ textBackgroundColor: color.hex8String });
        text.hiddenTextarea?.focus();
        text.enterEditing();
        canvasStore.canvas?.requestRenderAll();
      });
      setBackgroundColorPicker(iroInstance);
    }
  }, []);
  return (
    <ControlContainer
      className={`text-control-container ${className ? className : ""}`}
      left={left}
      top={top}
    >
      {/* 字体大小 */}
      <div className="font-size-control">
        <input
          className="title"
          type="number"
          max={255}
          min={1}
          value={textStyle.fontSize < 0 ? "" : textStyle.fontSize}
          onChange={(e) => {
            if (e.target.value === "") {
              setTextStyle((prev) => ({ ...prev, fontSize: -1 }));
            }
            const value = Number(e.target.value);
            // 如果值为NaN，则不更新
            if (Number.isNaN(value)) {
              return;
            }
            // 取值在1-255之间
            if (value >= 1 && value <= 255) {
              setTextStyle((prev) => ({
                ...prev,
                fontSize: value,
              }));
              text.setSelectionStyles({ fontSize: value });
              canvasStore.canvas?.requestRenderAll();
            }
          }}
        />
        <div className="content">
          <Sort theme="outline" size="24" fill="#333" />
          <div
            className="up"
            onClick={() => {
              if (canvasStore.canvas) {
                handleChangeFontSize(canvasStore.canvas, setTextStyle, 1);
              }
            }}
          ></div>
          <div
            className="down"
            onClick={() => {
              if (canvasStore.canvas) {
                handleChangeFontSize(canvasStore.canvas, setTextStyle, -1);
              }
            }}
          ></div>
        </div>
      </div>
      {/* 字体选择 */}
      <div className="font-family-control">
        <select
          onChange={(e) => {
            setTextStyle((prev) => ({
              ...prev,
              fontFamily: e.target.value,
            }));
            text.setSelectionStyles({ fontFamily: e.target.value });
            text.hiddenTextarea?.focus();
            text.enterEditing();
            canvasStore.canvas?.requestRenderAll();
          }}
          value={textStyle.fontFamily}
        >
          {customFontFamily.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>
      {/* 字体颜色 */}
      <div
        className="color-control"
        onClick={() => {
          setShowFontColorPicker((prev) => !prev);
        }}
        ref={colorControlRef}
      >
        <div
          className="icon"
          style={{
            color: textStyle.color || "#000",
          }}
        >
          A
        </div>
        <div
          className="color-picker"
          style={{
            backgroundColor: textStyle.color || "#000",
          }}
        >
          <div
            className="color-picker-container"
            style={{
              display: showFontColorPicker ? "block" : "none",
            }}
          >
            <div className="custom-color-picker">
              {customColorList.map((item) => (
                <div key={item} className="color-item">
                  <span
                    className="color"
                    style={{
                      backgroundColor: item,
                    }}
                    onClick={() => {
                      if (colorPicker) {
                        colorPicker.setColors([item]);
                      }
                      setTextStyle((prev) => ({ ...prev, color: item }));
                      text.setSelectionStyles({ fill: item });
                      text.hiddenTextarea?.focus();
                      text.enterEditing();
                      canvasStore.canvas?.requestRenderAll();
                    }}
                  />
                  <span
                    className="active-cover"
                    style={{
                      display: textStyle.color === item ? "flex" : "none",
                    }}
                  >
                    <Check theme="filled" size="14" fill="#fff" />
                  </span>
                </div>
              ))}
            </div>
            <div ref={colorPickerRef} />
          </div>
        </div>
      </div>
      {/* 背景色 */}
      <div
        className="background-color-control"
        onClick={() => {
          setShowBackgroundColorPicker((prev) => !prev);
        }}
        ref={backgroundColorControlRef}
      >
        <div className="icon">
          <Write
            theme="outline"
            strokeWidth={6}
            size="13"
            fill={textStyle.backgroundColor || "#333"}
          />
        </div>
        <div
          className="color-picker"
          style={{
            backgroundColor: textStyle.backgroundColor || "#000",
          }}
        >
          <div
            className="color-picker-container"
            style={{
              display: showBackgroundColorPicker ? "block" : "none",
            }}
          >
            <div className="custom-color-picker">
              {customBackgroundColorList.map((item) => (
                <div key={item} className="color-item">
                  <span
                    className="color"
                    style={{
                      backgroundColor: item,
                    }}
                    onClick={() => {
                      if (backgroundColorPicker) {
                        backgroundColorPicker.setColors([item]);
                      }
                      setTextStyle((prev) => ({
                        ...prev,
                        backgroundColor: item,
                      }));
                      text.setSelectionStyles({ textBackgroundColor: item });
                      text.hiddenTextarea?.focus();
                      text.enterEditing();
                      canvasStore.canvas?.renderAll();
                    }}
                  />
                  <span
                    className="active-cover"
                    style={{
                      display: textStyle.color === item ? "flex" : "none",
                    }}
                  >
                    <Check theme="filled" size="14" fill="#fff" />
                  </span>
                </div>
              ))}
            </div>
            <div ref={backgroundColorPickerRef} />
          </div>
        </div>
      </div>
      {/* 粗体/斜体/下划线/删除线 */}
      <div className="text-decoration-control">
        {/* 粗体 */}
        <div
          className="icon"
          onClick={() => {
            setTextStyle((prev) => {
              if (prev.fontWeight === "bold") {
                text.setSelectionStyles({ fontWeight: "normal" });
                text.hiddenTextarea?.focus();
                text.enterEditing();
                canvasStore.canvas?.requestRenderAll();
                return {
                  ...prev,
                  fontWeight: "normal",
                };
              } else {
                text.setSelectionStyles({ fontWeight: "bold" });
                text.hiddenTextarea?.focus();
                text.enterEditing();
                canvasStore.canvas?.requestRenderAll();
                return {
                  ...prev,
                  fontWeight: "bold",
                };
              }
            });
          }}
        >
          <TextBold theme="outline" strokeWidth={8} size="16" fill="#333" />
        </div>
        {/* 斜体 */}
        <div
          className="icon"
          onClick={() => {
            setTextStyle((prev) => {
              if (prev.fontStyle === "italic") {
                text.setSelectionStyles({ fontStyle: "normal" });
                text.hiddenTextarea?.focus();
                text.enterEditing();
                canvasStore.canvas?.requestRenderAll();
                return {
                  ...prev,
                  fontStyle: "normal",
                };
              } else {
                text.setSelectionStyles({ fontStyle: "italic" });
                text.hiddenTextarea?.focus();
                text.enterEditing();
                canvasStore.canvas?.requestRenderAll();
                return {
                  ...prev,
                  fontStyle: "italic",
                };
              }
            });
          }}
        >
          <TextItalic theme="outline" strokeWidth={6} size="16" fill="#333" />
        </div>
        {/* 下划线 */}
        <div
          className="icon"
          onClick={() => {
            setTextStyle((prev) => {
              if (prev.underline) {
                text.setSelectionStyles({ underline: false });
                text.hiddenTextarea?.focus();
                text.enterEditing();
                canvasStore.canvas?.requestRenderAll();
                return {
                  ...prev,
                  underline: false,
                };
              } else {
                text.setSelectionStyles({ underline: true });
                text.hiddenTextarea?.focus();
                text.enterEditing();
                canvasStore.canvas?.requestRenderAll();
                return {
                  ...prev,
                  underline: true,
                };
              }
            });
          }}
        >
          <TextUnderline
            theme="outline"
            strokeWidth={6}
            size="16"
            fill="#333"
          />
        </div>
        {/* 删除线 */}
        <div
          className="icon"
          onClick={() => {
            setTextStyle((prev) => {
              if (prev.lineThrough) {
                text.setSelectionStyles({ linethrough: false });
                text.hiddenTextarea?.focus();
                text.enterEditing();
                canvasStore.canvas?.requestRenderAll();
                return {
                  ...prev,
                  lineThrough: false,
                };
              } else {
                text.setSelectionStyles({ linethrough: true });
                text.hiddenTextarea?.focus();
                text.enterEditing();
                canvasStore.canvas?.requestRenderAll();
                return {
                  ...prev,
                  lineThrough: true,
                };
              }
            });
          }}
        >
          <Strikethrough
            theme="outline"
            strokeWidth={6}
            size="16"
            fill="#333"
          />
        </div>
      </div>
      {/* 上标/下标 */}
      <div className="sub-super-control">
        {/* 上标 */}
        <div
          className="icon"
          onClick={() => {
            setTextStyle((prev) => {
              if (!prev.subscript) {
                const { selectionStart, selectionEnd } = text;
                if (
                  selectionStart !== undefined &&
                  selectionEnd !== undefined &&
                  selectionStart !== selectionEnd
                ) {
                  text.setSelectionStyles({
                    fontSize: undefined,
                    deltaY: undefined,
                  });
                  text.setSuperscript(selectionStart, selectionEnd);
                }
                text.hiddenTextarea?.focus();
                text.enterEditing();
                canvasStore.canvas?.requestRenderAll();
                return {
                  ...prev,
                  subscript: true,
                };
              } else {
                text.setSelectionStyles({
                  fontSize: undefined,
                  deltaY: undefined,
                });
                text.hiddenTextarea?.focus();
                text.enterEditing();
                canvasStore.canvas?.requestRenderAll();
                return {
                  ...prev,
                  subscript: false,
                };
              }
            });
          }}
        >
          <div className="base-text">
            X<span className="sub">2</span>
          </div>
        </div>
        {/* 下标 */}
        <div
          className="icon"
          onClick={() => {
            setTextStyle((prev) => {
              if (!prev.subscript) {
                const { selectionStart, selectionEnd } = text;
                if (
                  selectionStart !== undefined &&
                  selectionEnd !== undefined &&
                  selectionStart !== selectionEnd
                ) {
                  text.setSelectionStyles({
                    fontSize: undefined,
                    deltaY: undefined,
                  });
                  text.setSubscript(selectionStart, selectionEnd);
                }
                text.hiddenTextarea?.focus();
                text.enterEditing();
                canvasStore.canvas?.requestRenderAll();
                return {
                  ...prev,
                  subscript: true,
                };
              } else {
                text.setSelectionStyles({
                  fontSize: undefined,
                  deltaY: undefined,
                });
                text.hiddenTextarea?.focus();
                text.enterEditing();
                canvasStore.canvas?.requestRenderAll();
                return {
                  ...prev,
                  subscript: false,
                };
              }
            });
          }}
        >
          <div className="base-text">
            X<span className="sup">2</span>
          </div>
        </div>
      </div>
      <div className="text-align-control">
        {/* 居左 */}
        <div
          className="icon"
          onClick={() => {
            setTextStyle((prev) => {
              if (prev.textAlign !== "left") {
                text.textAlign = "left";
                text.hiddenTextarea?.focus();
                text.enterEditing();
                canvasStore.canvas?.requestRenderAll();
                return {
                  ...prev,
                  textAlign: "left",
                };
              } else {
                text.textAlign = "left";
                text.hiddenTextarea?.focus();
                text.enterEditing();
                canvasStore.canvas?.requestRenderAll();
                return {
                  ...prev,
                  textAlign: "left",
                };
              }
            });
          }}
        >
          <AlignTextLeftOne
            theme={
              (text.textAlign === "left" || text.textAlign === undefined
                ? "filled"
                : "outline") as Theme
            }
            size="19"
            fill="#333"
          />
        </div>
        {/* 居中 */}
        <div
          className="icon"
          onClick={() => {
            setTextStyle((prev) => {
              if (prev.textAlign !== "center") {
                text.textAlign = "center";
                text.hiddenTextarea?.focus();
                text.enterEditing();
                canvasStore.canvas?.requestRenderAll();
                return {
                  ...prev,
                  textAlign: "center",
                };
              } else {
                text.textAlign = "left";
                text.hiddenTextarea?.focus();
                text.enterEditing();
                canvasStore.canvas?.requestRenderAll();
                return {
                  ...prev,
                  textAlign: "left",
                };
              }
            });
          }}
        >
          <AlignTextCenterOne
            theme={
              (text.textAlign === "center" ? "filled" : "outline") as Theme
            }
            size="19"
            fill="#333"
          />
        </div>
        {/* 居右 */}
        <div
          className="icon"
          onClick={() => {
            setTextStyle((prev) => {
              if (prev.textAlign !== "right") {
                text.textAlign = "right";
                text.hiddenTextarea?.focus();
                text.enterEditing();
                canvasStore.canvas?.requestRenderAll();
                return {
                  ...prev,
                  textAlign: "right",
                };
              } else {
                text.textAlign = "left";
                text.hiddenTextarea?.focus();
                text.enterEditing();
                canvasStore.canvas?.requestRenderAll();
                return {
                  ...prev,
                  textAlign: "left",
                };
              }
            });
          }}
        >
          <AlignTextRightOne
            theme={(text.textAlign === "right" ? "filled" : "outline") as Theme}
            size="19"
            fill="#333"
          />
        </div>
      </div>
      {children}
    </ControlContainer>
  );
};

export default Index;
