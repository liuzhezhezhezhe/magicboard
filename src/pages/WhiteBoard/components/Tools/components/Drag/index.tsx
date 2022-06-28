import React, { useEffect } from "react";
import { useLocalStore, useObserver } from "mobx-react";

import { HandDrag } from "@icon-park/react";

import { useHotkeys } from "react-hotkeys-hook";

import CanvasStore from "@/store/canvasStore";

import ToolContainer from "@/components/ToolContainer";
import { ICanvasMode } from "@/types/canvas.d";

import { drag } from "./options";

/**
 * 拖拽组件
 */
const Index: React.FC<{}> = () => {
  const canvasStore = useLocalStore(() => CanvasStore);
  const isDragingCanvas = React.useRef(false);
  useHotkeys("space", () => {
    canvasStore.switchMode(ICanvasMode.DRAG);
  });
  useEffect(() => {
    // 拖拽画布
    const canvas = canvasStore.canvas;
    const canvasMode = () => canvasStore.canvasMode;
    const isDraging = () => isDragingCanvas.current;
    const startDrag = () => (isDragingCanvas.current = true);
    const stopDrag = () => (isDragingCanvas.current = false);
    if (canvas) {
      const startDragHandler = (e: fabric.IEvent) => {
        if (canvasMode() === ICanvasMode.DRAG) {
          startDrag();
        }
      };
      const dragHandler = (e: fabric.IEvent) => {
        if (canvasMode() === ICanvasMode.DRAG && isDraging()) {
          drag(e as fabric.IEvent<MouseEvent>, canvas);
        }
      };
      const stopDragHandler = (e: fabric.IEvent) => {
        if (canvasMode() === ICanvasMode.DRAG && isDraging()) {
          stopDrag();
        }
      };
      canvas.on("mouse:down", startDragHandler);
      canvas.on("mouse:move", dragHandler);
      canvas.on("mouse:up", stopDragHandler);
      return () => {
        canvas.off("mouse:down", startDragHandler);
        canvas.off("mouse:move", dragHandler);
        canvas.off("mouse:up", stopDragHandler);
      };
    }
  }, [canvasStore.canvas]);
  return useObserver(() => (
    <ToolContainer
      className="tool"
      icon={
        <HandDrag
          theme="outline"
          size="24"
          fill={
            canvasStore.canvasMode === ICanvasMode.DRAG ? "#00bcd4" : "#333"
          }
        />
      }
      title="移动"
      onClick={() => {
        canvasStore.switchMode(ICanvasMode.DRAG);
      }}
    ></ToolContainer>
  ));
};

export default Index;
