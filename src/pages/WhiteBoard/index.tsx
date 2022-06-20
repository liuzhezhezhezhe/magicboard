import { useLocalStore } from "mobx-react";
import React, { useEffect } from "react";

import CanvasStore from "@/store/canvasStore";

import Tools from "./components/Tools";

import "./index.less";

const Index: React.FC<{}> = () => {
  const canvasStore = useLocalStore(() => CanvasStore);
  useEffect(() => {
    // 初始化画布
    if (canvasStore.canvas === null || canvasStore.canvas === undefined) {
      canvasStore.setCanvas(
        new fabric.Canvas("whiteboard", {
          width: window.innerWidth,
          height: window.innerHeight,
          isDrawingMode: false,
        })
      );
    }
  }, [canvasStore]);
  return (
    <div className="main">
      <Tools />
      <canvas className="whiteboard" id="whiteboard" />
    </div>
  );
};

export default Index;
