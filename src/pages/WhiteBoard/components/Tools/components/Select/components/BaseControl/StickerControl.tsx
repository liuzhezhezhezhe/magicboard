import React, { useEffect } from "react";
import { useLocalStore } from "mobx-react";
import { BackgroundColor, Check } from "@icon-park/react";
import iro from "@jaames/iro";

import TextControlContainer from "@/components/ControlContainer/TextControlContainer";

import { handleClickOutside } from "@/utils/index";
import { customBackgroundColorList } from "@/constants/font";

import CanvasStore from "@/store/canvasStore";

/**
 * 便签控制组件
 */
const Index: React.FC<{}> = () => {
  const canvasStore = useLocalStore(() => CanvasStore);
  const text = canvasStore.canvas?.getActiveObject() as fabric.Textbox;
  // 背景色
  const initBackgroundColor = text?.backgroundColor || "transparent";
  const [backgroundColor, setBackgroundColor] =
    React.useState<string>(initBackgroundColor);
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
        setBackgroundColor(color.hex8String);
        text.set({ backgroundColor: color.hex8String });
        text.hiddenTextarea?.focus();
        text.enterEditing();
        canvasStore.canvas?.requestRenderAll();
      });
      setBackgroundColorPicker(iroInstance);
    }
  }, []);
  return (
    <TextControlContainer>
      <div
        className="background-color-control"
        onClick={() => {
          setShowBackgroundColorPicker((prev) => !prev);
        }}
        ref={backgroundColorControlRef}
      >
        <div className="icon">
          <BackgroundColor
            theme="filled"
            strokeWidth={6}
            size="13"
            fill={backgroundColor || "#333"}
          />
        </div>
        <div
          className="color-picker"
          style={{
            backgroundColor: backgroundColor || "#000",
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
                      setBackgroundColor(item);
                      text.set({
                        backgroundColor: item,
                      });
                      text.hiddenTextarea?.focus();
                      text.enterEditing();
                      canvasStore.canvas?.renderAll();
                    }}
                  />
                  <span
                    className="active-cover"
                    style={{
                      display: backgroundColor === item ? "flex" : "none",
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
    </TextControlContainer>
  );
};

export default Index;
