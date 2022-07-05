import { useLocalStore } from "mobx-react";
import React, { useEffect } from "react";

import CanvasStore from "@/store/canvasStore";

const Index: React.FC<{}> = () => {
  const canvasStore = useLocalStore(() => CanvasStore);
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
  return <canvas className="whiteboard" id="whiteboard" />;
};

export default Index;
