import React, { useEffect } from "react";
import { useLocalStore, useObserver } from "mobx-react";
import { useHotkeys } from "react-hotkeys-hook";

import { GraphicDesign } from "@icon-park/react";

import ToolContainer from "@/components/ToolContainer";
import CanvasStore from "@/store/canvasStore";
import { ICanvasMode } from "@/types/canvas.d";
import { IShapeType } from "@/types/shape.d";

import SettingsModal from "./SettingsModal";
import { drawingShape, startDrawShape, stopDrawingShape } from "./options";

/**
 * 形状组件
 */
const Index: React.FC<{}> = () => {
  const [showSetting, setShowSetting] = React.useState(false);
  const isDrawingShape = React.useRef(false);
  const currentShape = React.useRef(IShapeType.ELLIPSE);
  const canvasStore = useLocalStore(() => CanvasStore);
  useHotkeys("r", () => {
    canvasStore.switchMode(ICanvasMode.SHAPE);
  });
  useEffect(() => {
    // 增加图形处理函数
    const canvas = canvasStore.canvas;
    const canvasMode = () => canvasStore.canvasMode;
    const activeShape = () => currentShape.current;
    const isDrawing = () => isDrawingShape.current;
    const startDraw = () => (isDrawingShape.current = true);
    const stopDraw = () => (isDrawingShape.current = false);
    if (canvas) {
      // 开始绘制图形
      const startDrawShapeHandler = (e: fabric.IEvent) => {
        if (canvasMode() === ICanvasMode.SHAPE) {
          startDrawShape(e, canvas, activeShape());
          startDraw();
        }
      };
      // 绘制图形
      const drawingShapeHandler = (e: fabric.IEvent) => {
        if (canvasMode() === ICanvasMode.SHAPE && isDrawing()) {
          drawingShape(e, canvas, activeShape());
        }
      };
      // 结束绘制图形
      const stopDrawShapeHandler = (e: fabric.IEvent) => {
        if (canvasMode() === ICanvasMode.SHAPE && isDrawing()) {
          stopDrawingShape(e, canvas, activeShape());
          stopDraw();
        }
      };
      canvas.on("mouse:down", startDrawShapeHandler);
      canvas.on("mouse:move", drawingShapeHandler);
      canvas.on("mouse:up", stopDrawShapeHandler);
      return () => {
        if (canvas) {
          canvas.off("mouse:down", startDrawShapeHandler);
          canvas.off("mouse:move", drawingShapeHandler);
          canvas.off("mouse:up", stopDrawShapeHandler);
        }
      };
    }
  }, [canvasStore.canvas]);
  return useObserver(() => (
    <ToolContainer
      className="tool"
      icon={
        <GraphicDesign
          theme="outline"
          size="24"
          fill={
            canvasStore.canvasMode === ICanvasMode.SHAPE ? "#00bcd4" : "#333"
          }
        />
      }
      title="形状"
      onClick={() => {
        setShowSetting((prev) => !prev);
        canvasStore.switchMode(ICanvasMode.SHAPE);
      }}
      onBlur={() => {
        setShowSetting(false);
      }}
    >
      {showSetting && (
        <SettingsModal
          shape={currentShape.current}
          onChange={(shape: IShapeType) => (currentShape.current = shape)}
        />
      )}
    </ToolContainer>
  ));
};

export default Index;
