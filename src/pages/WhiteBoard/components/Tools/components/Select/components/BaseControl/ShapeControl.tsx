import React, { useEffect } from "react";
import { useLocalObservable } from "mobx-react";
import {
  BackgroundColor,
  Check,
  NodeFlat,
  NodeRound,
  Sort,
} from "@icon-park/react";
import iro from "@jaames/iro";

import CanvasStore from "@/store/canvasStore";
import ControlContainer from "@/components/ControlContainer/BaseControlContainer";
import { handleClickOutside } from "@/utils/index";

import "./index.less";
import { customBackgroundColorList, customColorList } from "@/constants/shape";

/**
 * 形状控制
 * 圆角、边框粗细、边框颜色、填充色
 */
const Index: React.FC<{}> = () => {
  const canvasStore = useLocalObservable(() => CanvasStore);
  const shape = canvasStore.canvas?.getActiveObject() as fabric.Object;
  const top = shape.getBoundingRect().top;
  const left = shape.getBoundingRect().left + shape.getBoundingRect().width / 2;
  // 圆角
  const isEllipsis =
    (shape as fabric.Ellipse).rx === ((shape as fabric.Ellipse).width || 0) / 2;
  const [radius, setRadius] = React.useState((shape as fabric.Rect).rx !== 0);

  // 边框粗细
  const [borderWidth, setBorderWidth] = React.useState(
    (shape as fabric.Rect).strokeWidth || 1
  );

  // 边框颜色
  const [strokeColor, setStrokeColor] = React.useState(
    (shape as fabric.Rect).stroke || "#000000"
  );
  const [showStrokeColorPicker, setShowStrokeColorPicker] =
    React.useState(false);
  const strokeColorControlRef = React.createRef<HTMLDivElement>();
  useEffect(() => {
    if (strokeColorControlRef.current) {
      handleClickOutside(strokeColorControlRef, () => {
        setShowStrokeColorPicker(false);
      });
    }
  }, [strokeColorControlRef]);
  const strokeColorPickerRef = React.createRef<HTMLDivElement>();
  const [colorPicker, setColorPicker] = React.useState<iro.ColorPicker>();
  useEffect(() => {
    if (
      strokeColorPickerRef.current &&
      strokeColorPickerRef.current.childNodes.length <= 0
    ) {
      // 初始化颜色选择器
      // 由于选择弃每次都会在组建下增加一个字元素，所以要保证只有一个元素，则需要判断color-picker下无字元素
      const iroInstance = iro.ColorPicker(strokeColorPickerRef.current, {
        width: 154,
      });
      iroInstance.on("color:change", (color: iro.Color) => {
        setStrokeColor(color.hex8String);
        shape.set("stroke", color.hex8String);
        canvasStore.canvas?.requestRenderAll();
      });
      setColorPicker(iroInstance);
    }
  }, []);

  // 背景色
  const [fillColor, setFillColor] = React.useState(
    (shape as fabric.Rect).fill?.toString() || "transparent"
  );
  const [showFillColorPicker, setShowFillColorPicker] = React.useState(false);
  const fillColorControlRef = React.createRef<HTMLDivElement>();
  useEffect(() => {
    handleClickOutside(fillColorControlRef, () => {
      setShowFillColorPicker(false);
    });
  }, [fillColorControlRef]);
  const fillColorPickerRef = React.createRef<HTMLDivElement>();
  const [fillColorPicker, setFillColorPicker] =
    React.useState<iro.ColorPicker>();
  useEffect(() => {
    if (
      fillColorPickerRef.current &&
      fillColorPickerRef.current.childNodes.length <= 0
    ) {
      // 初始化颜色选择器
      // 由于选择弃每次都会在组建下增加一个字元素，所以要保证只有一个元素，则需要判断color-picker下无子元素
      const iroInstance = iro.ColorPicker(fillColorPickerRef.current, {
        width: 154,
      });
      iroInstance.on("color:change", (color: iro.Color) => {
        setFillColor(color.hex8String);
        shape.set("fill", color.hex8String);
        canvasStore.canvas?.requestRenderAll();
      });
      setFillColorPicker(iroInstance);
    }
  }, []);
  return (
    <ControlContainer className="shape-control" top={top} left={left}>
      <div className="stroke-width-control">
        <input
          className="title"
          type="number"
          max={255}
          min={1}
          value={borderWidth < 0 ? "" : borderWidth}
          onChange={(e) => {
            if (e.target.value === "") {
              setBorderWidth(-1);
            }
            const value = Number(e.target.value);
            // 如果值为NaN，则不更新
            if (Number.isNaN(value)) {
              return;
            }
            // 取值在1-255之间
            if (value >= 1 && value <= 255) {
              setBorderWidth(value);
              (shape as fabric.Rect).set({
                strokeWidth: value,
              });
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
                setBorderWidth((prev) => {
                  const newBorderWidth = prev + 5;
                  if (newBorderWidth >= 1) {
                    (shape as fabric.Rect).set({
                      strokeWidth: newBorderWidth,
                    });
                    canvasStore.canvas?.requestRenderAll();
                    return newBorderWidth;
                  }
                  return prev;
                });
              }
            }}
          ></div>
          <div
            className="down"
            onClick={() => {
              if (canvasStore.canvas) {
                setBorderWidth((prev) => {
                  const newBorderWidth = prev - 5;
                  if (newBorderWidth >= 1) {
                    (shape as fabric.Rect).set({
                      strokeWidth: newBorderWidth,
                    });
                    canvasStore.canvas?.requestRenderAll();
                    return newBorderWidth;
                  }
                  return prev;
                });
              }
            }}
          ></div>
        </div>
      </div>
      {/* 圆形不可以设置圆角 */}
      {!isEllipsis && (
        <div
          className="radius-control"
          onClick={() => {
            setRadius((prev) => {
              if (prev) {
                (shape as fabric.Rect).set({
                  rx: 0,
                  ry: 0,
                });
              } else {
                (shape as fabric.Rect).set({
                  rx: 10,
                  ry: 10,
                });
              }
              return !prev;
            });
            canvasStore.canvas?.requestRenderAll();
          }}
        >
          {radius ? (
            <NodeFlat theme="outline" size="16" strokeWidth={6} fill="#333" />
          ) : (
            <NodeRound theme="outline" size="16" strokeWidth={6} fill="#333" />
          )}
        </div>
      )}
      {/* 边框颜色 */}
      <div
        className="stroke-color-control"
        onClick={() => {
          setShowStrokeColorPicker((prev) => !prev);
        }}
        ref={strokeColorControlRef}
      >
        <div
          className="icon"
          style={{
            color: strokeColor || "#000",
          }}
        >
          I
        </div>
        <div
          className="color-picker"
          style={{
            backgroundColor: strokeColor || "#000",
          }}
        >
          <div
            className="color-picker-container"
            style={{
              display: showStrokeColorPicker ? "block" : "none",
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
                      setStrokeColor(item);
                      (shape as fabric.Rect).set({
                        stroke: item,
                      });
                      canvasStore.canvas?.requestRenderAll();
                    }}
                  />
                  <span
                    className="active-cover"
                    style={{
                      display: strokeColor === item ? "flex" : "none",
                    }}
                  >
                    <Check theme="filled" size="14" fill="#fff" />
                  </span>
                </div>
              ))}
            </div>
            <div ref={strokeColorPickerRef} />
          </div>
        </div>
      </div>
      {/* 填充色 */}
      <div
        className="fill-color-control"
        onClick={() => {
          setShowFillColorPicker((prev) => !prev);
        }}
        ref={fillColorControlRef}
      >
        <div className="icon">
          <BackgroundColor
            theme="filled"
            strokeWidth={6}
            size="13"
            fill={fillColor || "#333"}
          />
        </div>
        <div
          className="color-picker"
          style={{
            backgroundColor: fillColor || "#000",
          }}
        >
          <div
            className="color-picker-container"
            style={{
              display: showFillColorPicker ? "block" : "none",
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
                      if (fillColorPicker) {
                        fillColorPicker.setColors([item]);
                      }
                      setFillColor(item);
                      (shape as fabric.Rect).set({
                        fill: item,
                      });
                      canvasStore.canvas?.renderAll();
                    }}
                  />
                  <span
                    className="active-cover"
                    style={{
                      display: fillColor === item ? "flex" : "none",
                    }}
                  >
                    <Check theme="filled" size="14" fill="#fff" />
                  </span>
                </div>
              ))}
            </div>
            <div ref={fillColorPickerRef} />
          </div>
        </div>
      </div>
    </ControlContainer>
  );
};

export default Index;
