import React from "react";
import { useLocalStore, useObserver } from "mobx-react";

import { MoveOne } from "@icon-park/react";

import { useHotkeys } from "react-hotkeys-hook";

import CanvasStore from "@/store/canvasStore";

import ToolContainer from "@/components/ToolContainer";
import { ICanvasMode } from "@/types/canvas.d";

/**
 * 移动组件
 */
const Index: React.FC<{}> = () => {
  const canvasStore = useLocalStore(() => CanvasStore);
  useHotkeys("v", () => {
    canvasStore.switchMode(ICanvasMode.SELECT);
  });
  return useObserver(() => (
    <ToolContainer
      className="tool"
      icon={
        <MoveOne
          theme="outline"
          size="24"
          fill={
            canvasStore.canvasMode === ICanvasMode.SELECT ? "#00bcd4" : "#333"
          }
        />
      }
      title="移动"
      onClick={() => {
        canvasStore.switchMode(ICanvasMode.SELECT);
      }}
    ></ToolContainer>
  ));
};

export default Index;
