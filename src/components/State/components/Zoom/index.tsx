import React, { useEffect } from "react";
import { useLocalObservable } from "mobx-react";
import { Minus, Plus } from "@icon-park/react";

import CanvasStore from "@/stores/canvasStore";

import { zoomToPoint, zoomToPointByButton } from "./options";

/**
 * 缩放状态组件
 */
const Index: React.FC<{}> = () => {
  const canvasStore = useLocalObservable(() => CanvasStore);
  const [zoom, setZoom] = React.useState(1);
  useEffect(() => {
    const canvas = canvasStore.canvas;
    if (canvas) {
      // 缩放画布
      const zoomHandler = (e: fabric.IEvent) => {
        zoomToPoint(e as fabric.IEvent<WheelEvent>, canvas, setZoom);
      };
      canvas.on("mouse:wheel", zoomHandler);
      window.onresize = () => {
        // 全屏与非全屏切换时，调整画布大小
        canvas.setWidth(window.innerWidth);
        canvas.setHeight(window.innerHeight);
        canvas.requestRenderAll();
      };
      return () => {
        if (canvas) {
          canvas.off("mouse:wheel", zoomHandler);
        }
      };
    }
  }, [canvasStore.canvas]);
  return (
    <div className="zoom-container">
      <div
        className="zoom-icon"
        onClick={() => {
          if (canvasStore.canvas) {
            zoomToPointByButton(zoom + 0.1, canvasStore.canvas, setZoom);
          }
        }}
      >
        <Plus theme="outline" size="24" fill="#333" />
      </div>
      <div className="zoom-size">{Math.floor(zoom * 100)} %</div>
      <div
        className="zoom-icon"
        onClick={() => {
          if (canvasStore.canvas) {
            zoomToPointByButton(zoom - 0.1, canvasStore.canvas, setZoom);
          }
        }}
      >
        <Minus theme="outline" size="24" fill="#333" />
      </div>
    </div>
  );
};

export default Index;
