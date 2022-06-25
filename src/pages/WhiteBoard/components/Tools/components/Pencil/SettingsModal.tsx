import React, { useEffect } from "react";
import { Check, HighLight, Write } from "@icon-park/react";
import iro from "@jaames/iro";
import { useLocalStore } from "mobx-react";

import CanvasStore from "@/store/canvasStore";

import { IBrushType } from "@/types/brush.d";
import { customColorList, defaultBrushs } from "@/constants/brush";

import "./index.less";

/**
 * 画笔设置组件
 */
const Index: React.FC<{}> = () => {
  // 当前正在使用的笔刷
  const canvasStore = useLocalStore(() => CanvasStore);
  const [activeBrush, setActiveBrush] = React.useState<IBrushType>(
    canvasStore.activeBrush
  );
  const brush = defaultBrushs.get(activeBrush);
  // 色彩选择
  const [color, setColor] = React.useState<string>(brush?.color || "#f44336");
  // 画笔大小
  const [size, setSize] = React.useState<number>(brush?.size || 10);
  // 画笔透明度
  const [opacity, setOpacity] = React.useState<number>(brush?.opacity || 1);
  // 初始化色彩选择器
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
        setColor(color.hexString);
      });
      setColorPicker(iroInstance);
    }
  }, []);
  // 画笔切换时，更新数据
  useEffect(() => {
    canvasStore.setActiveBrush(activeBrush);
    const brush = defaultBrushs.get(activeBrush);
    if (brush) {
      setColor(brush.color);
      setSize(brush.size);
      setOpacity(brush.opacity);
      if (colorPicker) {
        colorPicker.setColors([brush.color]);
      }
    }
  }, [activeBrush, colorPicker]);
  // 画笔属性更新时，更新数据
  useEffect(() => {
    const brush = defaultBrushs.get(activeBrush);
    if (brush) {
      // 更新画笔记录的数据（再次回到画笔时会用到）
      brush.color = color;
      brush.size = size;
      brush.opacity = opacity;
      if (canvasStore.canvas) {
        // 更新画笔数据
        const currentColor = new iro.Color(color);
        currentColor.alpha = opacity;
        canvasStore.canvas.freeDrawingBrush.color = currentColor.hex8String;
        canvasStore.canvas.freeDrawingBrush.width = size;
      }
    }
  }, [color, size, opacity]);
  return (
    <div className="settings-modal-container">
      {/* 画笔类型 */}
      <div className="brush-container">
        <div
          key={IBrushType.BRUSH}
          className={`brush-item ${
            activeBrush === IBrushType.BRUSH ? "active" : ""
          }`}
          onClick={() => setActiveBrush(IBrushType.BRUSH)}
        >
          <Write
            theme="outline"
            size="17"
            fill={activeBrush === IBrushType.BRUSH ? "#fff" : "#333"}
          />
          <span className="brush-title">画笔</span>
        </div>
        <div
          key={IBrushType.HIGHLIGHT}
          className={`brush-item ${
            activeBrush === IBrushType.HIGHLIGHT ? "active" : ""
          }`}
          onClick={() => setActiveBrush(IBrushType.HIGHLIGHT)}
        >
          <HighLight
            theme="outline"
            size="17"
            fill={activeBrush === IBrushType.HIGHLIGHT ? "#fff" : "#333"}
          />
          <span className="brush-title">荧光笔</span>
        </div>
      </div>
      {/* 画笔透明度/粗细 */}
      <div className="stroke-container">
        <div className="radius-item">
          <span className="stroke-title">粗细</span>
          <input
            className="range-picker"
            type="range"
            min={0}
            max={100}
            step={1}
            value={size}
            onChange={(e) => setSize(Number(e.target.value))}
          />
        </div>
        {activeBrush === IBrushType.HIGHLIGHT && (
          <div className="opacity-item">
            <div className="stroke-title">透明度</div>
            <input
              className="range-picker"
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={opacity}
              onChange={(e) => setOpacity(Number(e.target.value))}
            />
          </div>
        )}
      </div>
      {/* 色彩选择 */}
      <div className="color-picker-container">
        <div className="custom-color-picker">
          {customColorList.map((item) => (
            <div key={item} className="color-item">
              <span
                className="color"
                style={{
                  backgroundColor: item,
                }}
                onClick={() => {
                  setColor(item);
                  if (colorPicker) {
                    colorPicker.setColors([item]);
                  }
                }}
              />
              <span
                className="active-cover"
                style={{
                  display: color === item ? "flex" : "none",
                }}
              >
                <Check theme="filled" size="14" fill="#fff" />
              </span>
            </div>
          ))}
        </div>
        <div className="color-picker" ref={colorPickerRef} />
      </div>
    </div>
  );
};

export default Index;
