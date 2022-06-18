import React, { useEffect } from "react";
import { HighLight, Write, Check } from "@icon-park/react";
import iro from "@jaames/iro";
import { debounce } from "lodash";
import { useLocalStore } from "mobx-react";

import CanvasStore from "@/pages/WhiteBoard/store/canvasStore";
import "./index.less";

/**
 * 画笔类型
 * @enum {0} 画笔
 * @enum {1} 高亮
 */
enum IBrushType {
  BRUSH = 0,
  HIGHLIGHT = 1,
}

/**
 * 画笔参数
 * @param {IBrushType} type 画笔类型
 * @param {boolean} active 是否激活
 * @param {string} color 画笔颜色
 * @param {number} size 画笔大小
 * @param {number} opacity 画笔透明度
 */
interface IBrushParams {
  type: IBrushType;
  active: boolean;
  color: string;
  size: number;
  opacity: number;
}

const defaultBrushs: Map<IBrushType, IBrushParams> = new Map([
  [
    IBrushType.BRUSH,
    {
      type: IBrushType.BRUSH,
      active: true,
      color: "#f44336",
      size: 20,
      opacity: 1,
    },
  ],
  [
    IBrushType.HIGHLIGHT,
    {
      type: IBrushType.HIGHLIGHT,
      active: false,
      color: "#00bcd4",
      size: 50,
      opacity: 0.5,
    },
  ],
]);

// 自定义颜色列表
const customColorList = [
  "#f44336",
  "#e91e63",
  "#9c27b0",
  "#673ab7",
  "#3f51b5",
  "#2196f3",
  "#03a9f4",
  "#00bcd4",
];

/**
 * 设置组件
 * @param {boolean} visible 是否显示
 */
interface ISettingsModalProps {
  visible: boolean;
}

/**
 * 画笔设置组件
 */
const Index: React.FC<ISettingsModalProps> = (props) => {
  const { visible } = props;
  // 当前正在使用的笔刷
  const [activeBrush, setActiveBrush] = React.useState<IBrushType>(
    IBrushType.BRUSH
  );
  // 色彩选择
  const [color, setColor] = React.useState<string>("#f44336");
  // 画笔大小
  const [size, setSize] = React.useState<number>(10);
  // 画笔透明度
  const [opacity, setOpacity] = React.useState<number>(1);
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
  const canvasStore = useLocalStore(() => CanvasStore);
  // 画笔属性更新时，更新数据
  useEffect(() => {
    const brush = defaultBrushs.get(activeBrush);
    if (brush) {
      brush.color = color;
      brush.size = size;
      brush.opacity = opacity;
      if (canvasStore.canvas) {
        const currentColor = new iro.Color(color);
        currentColor.alpha = opacity;
        console.log(currentColor.rgbaString);
        canvasStore.canvas.freeDrawingBrush.color = currentColor.rgbaString;
        canvasStore.canvas.freeDrawingBrush.width = size;
      }
    }
  }, [color, size, opacity]);
  return (
    <div
      className="settings-modal-container"
      style={{
        display: visible ? "block" : "none",
      }}
    >
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
            defaultValue={size}
            onChange={debounce((e) => setSize(Number(e.target.value)), 200)}
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
              defaultValue={opacity}
              onChange={debounce(
                (e) => setOpacity(Number(e.target.value)),
                200
              )}
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
                <Check theme="outline" size="17" fill="#333" />
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
