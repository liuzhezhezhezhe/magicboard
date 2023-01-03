import React, { useEffect } from "react";
import { Observer, useLocalObservable } from "mobx-react";

import { HandDrag } from "@icon-park/react";

import { useHotkeys } from "react-hotkeys-hook";

import CanvasStore from "@/stores/canvasStore";

import { ICanvasMode } from "@/types/canvas.d";

import { drag } from "./options";

/**
 * 拖拽组件
 */
const Index: React.FC<{}> = () => {
  const canvasStore = useLocalObservable(() => CanvasStore);
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
  return (
    <Observer>
      {() => (
        <div
          className="drag-container"
          onClick={() => canvasStore.switchMode(ICanvasMode.DRAG)}
        >
          <HandDrag
            theme="outline"
            size="24"
            fill={
              canvasStore.canvasMode === ICanvasMode.DRAG ? "#00bcd4" : "#333"
            }
          />
        </div>
      )}
    </Observer>
  );
};

export default Index;
