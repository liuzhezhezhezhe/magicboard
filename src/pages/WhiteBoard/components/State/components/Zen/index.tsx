import React, { useEffect } from "react";
import { useLocalStore } from "mobx-react";
import { FullScreen, OffScreen } from "@icon-park/react";

import CanvasStore from "@/store/canvasStore";

/**
 * 全屏组件
 */
const Index: React.FC<{}> = () => {
  const canvasStore = useLocalStore(() => CanvasStore);
  const [zenMode, setZenMode] = React.useState(false);
  useEffect(() => {
    const canvas = canvasStore.canvas;
    if (canvas) {
      window.onresize = () => {
        // 全屏与非全屏切换时，调整画布大小
        canvas.setWidth(window.innerWidth);
        canvas.setHeight(window.innerHeight);
        canvas.requestRenderAll();
      };
      return () => {
        window.onresize = null;
      };
    }
  }, [canvasStore.canvas]);
  return (
    <div
      className="zen-container"
      onClick={() => {
        setZenMode((prev) => {
          if (prev) {
            // 退出浏览器全屏
            document.exitFullscreen();
          } else {
            // 全屏
            document.body.requestFullscreen();
          }
          // 重新计算画板大小
          return !prev;
        });
      }}
    >
      {zenMode ? (
        <OffScreen theme="outline" size="24" fill="#333" />
      ) : (
        <FullScreen theme="outline" size="24" fill="#333" />
      )}
    </div>
  );
};

export default Index;
