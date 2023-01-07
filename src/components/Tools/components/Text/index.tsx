import React, { useEffect } from "react";
import { Observer, useLocalObservable } from "mobx-react";
import { useHotkeys } from "react-hotkeys-hook";

import { Text } from "@icon-park/react";

import ToolContainer from "@/components/ToolContainer";
import CanvasStore from "@/stores/canvasStore";
import { ICanvasMode } from "@/types/canvas.d";
import { useSwitchTool } from "@/hooks/useSwithcTool";

import { drawText } from "./options";

/**
 * 文本组件
 */
const Index: React.FC<{}> = () => {
  const canvasStore = useLocalObservable(() => CanvasStore);
  const { refresh, switchTool } = useSwitchTool(canvasStore);
  useHotkeys("t", () => {
    switchTool(ICanvasMode.TEXT);
  });
  useEffect(() => {
    // 增加文字处理函数
    const canvas = canvasStore.canvas;
    const canvasMode = () => canvasStore.canvasMode;
    if (canvas) {
      const drawTextHandler = (e: fabric.IEvent) => {
        if (canvasMode() === ICanvasMode.TEXT) {
          drawText(e, canvas!);
        }
      };
      canvas.on("mouse:down", drawTextHandler);
      return () => {
        if (canvas) {
          canvas.off("mouse:down", drawTextHandler);
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
            <Text
              theme="outline"
              size="24"
              fill={
                canvasStore.canvasMode === ICanvasMode.TEXT ? "#00bcd4" : "#333"
              }
            />
          }
          title="Text(t)"
          onClick={() => {
            switchTool(ICanvasMode.TEXT);
          }}
        ></ToolContainer>
      )}
    </Observer>
  );
};

export default Index;
