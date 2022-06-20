import React from "react";
import { useLocalStore, useObserver } from "mobx-react";

import { MoveOne } from "@icon-park/react";

import CanvasStore, { ICanvasMode } from "@/store/canvasStore";

import ToolContainer from "@/components/ToolContainer";

/**
 * 移动组件
 */
const Index: React.FC<{}> = () => {
  const canvasStore = useLocalStore(() => CanvasStore);
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
