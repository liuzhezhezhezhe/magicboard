import React from "react";
import { useLocalStore, useObserver } from "mobx-react";

import { Square } from "@icon-park/react";

import ToolContainer from "@/components/ToolContainer";
import CanvasStore from "@/store/canvasStore";
import { ICanvasMode } from "@/types/canvas.d";

import SettingsModal from "./SettingsModal";

/**
 * 形状组件
 */
const Index: React.FC<{}> = () => {
  const [showSetting, setShowSetting] = React.useState(false);
  const canvasStore = useLocalStore(() => CanvasStore);
  return useObserver(() => (
    <ToolContainer
      className="tool"
      icon={
        <Square
          theme="outline"
          size="24"
          fill={
            canvasStore.canvasMode === ICanvasMode.SHAPE ? "#00bcd4" : "#333"
          }
        />
      }
      title="形状"
      onClick={() => {
        setShowSetting((prev) => !prev);
        canvasStore.switchMode(ICanvasMode.SHAPE);
      }}
      onBlur={() => {
        setShowSetting(false);
      }}
    >
      {showSetting && <SettingsModal />}
    </ToolContainer>
  ));
};

export default Index;
