import React, { useEffect } from "react";
import { useLocalStore } from "mobx-react";
import { Minus, Plus } from "@icon-park/react";

import CanvasStore from "@/store/canvasStore";

import { zoomToPoint, zoomToPointByButton } from "./options";

import "./index.less";

/**
 * 白板状态组件
 */
const Index: React.FC<{}> = () => {
  const canvasStore = useLocalStore(() => CanvasStore);
  const [zoom, setZoom] = React.useState(1);
  useEffect(() => {
    const canvas = canvasStore.canvas;
    if (canvas) {
      // 缩放画布
      const zoomHandler = (e: fabric.IEvent<WheelEvent>) => {
        zoomToPoint(e, canvas, setZoom);
      };
      canvas.on("mouse:wheel", zoomHandler);
    }
  }, [canvasStore.canvas]);
  return (
    <div className="state-container">
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
    </div>
  );
};

export default Index;
