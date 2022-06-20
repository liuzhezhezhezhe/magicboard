import React from "react";
import { useLocalStore, useObserver } from "mobx-react";

import { Square } from "@icon-park/react";

import ToolContainer from "@/components/ToolContainer";
import CanvasStore, { ICanvasMode } from "@/store/canvasStore";

/**
 * 形状组件
 */
const Index: React.FC<{}> = () => {
  const canvasStore = useLocalStore(() => CanvasStore);
  return useObserver(() => (
    <ToolContainer
      className="tool"
      icon={
        <Square
          theme="outline"
          size="24"
          fill={
            canvasStore.canvasMode === ICanvasMode.SQUARE ? "#00bcd4" : "#333"
          }
        />
      }
      title="形状"
      onClick={() => {
        canvasStore.switchMode(ICanvasMode.SQUARE);
      }}
    ></ToolContainer>
  ));
};

export default Index;
