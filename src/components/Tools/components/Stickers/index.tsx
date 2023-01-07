import React, { useEffect, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { Observer, useLocalObservable } from "mobx-react";

import { Stickers } from "@icon-park/react";

import ToolContainer from "@/components/ToolContainer";
import CanvasStore from "@/stores/canvasStore";
import { ICanvasMode } from "@/types/canvas.d";
import { useSwitchTool } from "@/hooks/useSwithcTool";

import { drawSticker } from "./options";

/**
 * 便签组件
 */
const Index: React.FC<{}> = () => {
  const canvasStore = useLocalObservable(() => CanvasStore);
  const { refresh, switchTool } = useSwitchTool(canvasStore);
  useHotkeys("s", () => {
    switchTool(ICanvasMode.STICKERS);
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
  }, [canvasStore.canvas, refresh]);
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
          title="Sticker(s)"
          onClick={() => {
            switchTool(ICanvasMode.STICKERS);
          }}
        ></ToolContainer>
      )}
    </Observer>
  );
};

export default Index;
