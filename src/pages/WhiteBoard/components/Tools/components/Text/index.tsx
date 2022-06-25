import React from "react";
import { useLocalStore, useObserver } from "mobx-react";

import { Text } from "@icon-park/react";

import { useHotkeys } from "react-hotkeys-hook";

import ToolContainer from "@/components/ToolContainer";
import CanvasStore from "@/store/canvasStore";
import { ICanvasMode } from "@/types/canvas.d";

/**
 * 文本组件
 */
const Index: React.FC<{}> = () => {
  const canvasStore = useLocalStore(() => CanvasStore);
  useHotkeys("t", () => {
    canvasStore.switchMode(ICanvasMode.TEXT);
  });
  return useObserver(() => (
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
      title="文本"
      onClick={() => {
        canvasStore.switchMode(ICanvasMode.TEXT);
      }}
    ></ToolContainer>
  ));
};

export default Index;
