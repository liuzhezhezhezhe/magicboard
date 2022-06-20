import React from "react";

import { Text } from "@icon-park/react";

import ToolContainer from "@/components/ToolContainer";
import { useLocalStore, useObserver } from "mobx-react";
import CanvasStore, { ICanvasMode } from "@/store/canvasStore";

/**
 * 文本组件
 */
const Index: React.FC<{}> = () => {
  const canvasStore = useLocalStore(() => CanvasStore);
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
