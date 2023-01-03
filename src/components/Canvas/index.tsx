import { useLocalObservable } from "mobx-react";
import React, { useEffect } from "react";

import CanvasStore from "@/stores/canvasStore";
import { resetCanvasControl } from "./options";

const Index: React.FC<{}> = () => {
  const canvasStore = useLocalObservable(() => CanvasStore);
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
      // 重置形状控制
      resetCanvasControl();
    }
  }, [canvasStore]);
  return <canvas className="whiteboard" id="whiteboard" />;
};

export default Index;
