import React, { useEffect } from "react";

import { Stickers } from "@icon-park/react";

import ToolContainer from "@/components/ToolContainer";
import { useLocalStore, useObserver } from "mobx-react";
import CanvasStore from "@/store/canvasStore";
import { ICanvasMode } from "@/types/canvas.d";

import { drawSticker } from "./options";
import { useHotkeys } from "react-hotkeys-hook";

/**
 * 便签组件
 */
const Index: React.FC<{}> = () => {
  const canvasStore = useLocalStore(() => CanvasStore);
  useHotkeys("s", () => {
    canvasStore.switchMode(ICanvasMode.STICKERS);
  });
  useEffect(() => {
    // 增加便签处理函数
    const canvas = canvasStore.canvas;
    const canvasMode = () => canvasStore.canvasMode;
    if (canvas) {
      const drawStickerHandler = (e: fabric.IEvent) => {
        if (canvasMode() === ICanvasMode.STICKERS) {
          drawSticker(e, canvas!);
        }
      };
      canvas.on("mouse:down", drawStickerHandler);
      return () => {
        if (canvas) {
          canvas.off("mouse:down", drawStickerHandler);
        }
      };
    }
  }, [canvasStore.canvas]);
  return useObserver(() => (
    <ToolContainer
      className="tool"
      icon={
        <Stickers
          theme="outline"
          size="24"
          fill={
            canvasStore.canvasMode === ICanvasMode.STICKERS ? "#00bcd4" : "#333"
          }
        />
      }
      title="便签"
      onClick={() => {
        canvasStore.switchMode(ICanvasMode.STICKERS);
      }}
    ></ToolContainer>
  ));
};

export default Index;
