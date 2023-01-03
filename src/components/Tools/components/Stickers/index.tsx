import React, { useEffect } from "react";
import { useHotkeys } from "react-hotkeys-hook";

import { Stickers } from "@icon-park/react";

import ToolContainer from "@/components/ToolContainer";
import { Observer, useLocalObservable } from "mobx-react";
import CanvasStore from "@/stores/canvasStore";
import { ICanvasMode } from "@/types/canvas.d";

import { drawSticker } from "./options";

/**
 * 便签组件
 */
const Index: React.FC<{}> = () => {
  const canvasStore = useLocalObservable(() => CanvasStore);
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
  return (
    <Observer>
      {() => (
        <ToolContainer
          className="tool"
          icon={
            <Stickers
              theme="outline"
              size="24"
              fill={
                canvasStore.canvasMode === ICanvasMode.STICKERS
                  ? "#00bcd4"
                  : "#333"
              }
            />
          }
          title="便签"
          onClick={() => {
            canvasStore.switchMode(ICanvasMode.STICKERS);
          }}
        ></ToolContainer>
      )}
    </Observer>
  );
};

export default Index;
