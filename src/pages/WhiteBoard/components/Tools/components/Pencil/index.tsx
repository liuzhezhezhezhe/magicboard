import React from "react";
import { useLocalStore, useObserver } from "mobx-react";

import { Edit } from "@icon-park/react";

import ToolContainer from "@/components/ToolContainer";
import CanvasStore, { ICanvasMode } from "@/store/canvasStore";

import SettingsModal from "./SettingsModal";

/**
 * 画笔组件
 */
const Index: React.FC<{}> = () => {
  const [showSetting, setShowSetting] = React.useState(false);
  const canvasStore = useLocalStore(() => CanvasStore);
  return useObserver(() => (
    <ToolContainer
      className="tool"
      icon={
        <Edit
          theme="outline"
          size="24"
          fill={
            canvasStore.canvasMode === ICanvasMode.DRAW ? "#00bcd4" : "#333"
          }
        />
      }
      title="画笔"
      onClick={() => {
        setShowSetting((prev) => !prev);
        canvasStore.switchMode(ICanvasMode.DRAW);
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
