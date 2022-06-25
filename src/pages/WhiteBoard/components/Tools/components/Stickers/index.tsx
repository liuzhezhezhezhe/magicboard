import React from "react";

import { Stickers } from "@icon-park/react";

import ToolContainer from "@/components/ToolContainer";
import { useLocalStore, useObserver } from "mobx-react";
import CanvasStore from "@/store/canvasStore";
import { ICanvasMode } from "@/types/canvas.d";

/**
 * 便签组件
 */
const Index: React.FC<{}> = () => {
  const canvasStore = useLocalStore(() => CanvasStore);
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
