import { useLocalStore } from "mobx-react";
import React, { useEffect } from "react";

import { useHotkeys } from "react-hotkeys-hook";

import CanvasStore from "@/store/canvasStore";
import { zoomToPoint } from "./options";

const Index: React.FC<{}> = () => {
  const canvasStore = useLocalStore(() => CanvasStore);
  useHotkeys("del, backspace", () => {
    const activeObject = canvasStore.canvas?.getActiveObject();
    if (activeObject) {
      canvasStore.canvas?.remove(activeObject);
    }
  });
  useEffect(() => {
    // 初始化画布
    if (canvasStore.canvas === null || canvasStore.canvas === undefined) {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const canvas = new fabric.Canvas("whiteboard", {
        width,
        height,
        isDrawingMode: false,
        backgroundColor: "#f7f7f7",
      });
      canvasStore.setCanvas(canvas);
    }
  }, [canvasStore]);
  useEffect(() => {
    const canvas = canvasStore.canvas;
    if (canvas) {
      // 缩放画布
      const zoomHandler = (e: fabric.IEvent<WheelEvent>) => {
        zoomToPoint(e, canvas);
      };
      canvas.on("mouse:wheel", zoomHandler);
      // 拖拽画布
      const dragHandler = (e: fabric.IEvent<MouseEvent>) => {
        if (e.e.buttons === 1) {
          canvas.relativePan({ x: e.e.movementX, y: e.e.movementY });
        }
      };
      canvas.on("mouse:down", dragHandler);
    }
  }, [canvasStore.canvas]);
  return <canvas className="whiteboard" id="whiteboard" />;
};

export default Index;
