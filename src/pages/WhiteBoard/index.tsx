import { useLocalStore } from "mobx-react";
import React, { useEffect } from "react";
import { fabric } from "fabric";

import Tools from "./components/Tools";
import CanvasStore from "./store/canvasStore";

import "./index.less";

const Index: React.FC<{}> = () => {
  const canvasStore = useLocalStore(() => CanvasStore);
  useEffect(() => {
    // 初始化画布
    console.log(canvasStore.canvas);

    if (canvasStore.canvas === null || canvasStore.canvas === undefined) {
      canvasStore.setCanvas(
        new fabric.Canvas("whiteboard", {
          width: window.innerWidth,
          height: window.innerHeight,
          isDrawingMode: true,
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
