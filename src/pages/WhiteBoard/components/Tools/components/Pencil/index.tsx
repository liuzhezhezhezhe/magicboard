import React from "react";
import { useLocalStore, useObserver } from "mobx-react";

import { Edit } from "@icon-park/react";

import { useHotkeys } from "react-hotkeys-hook";

import ToolContainer from "@/components/ToolContainer";
import CanvasStore from "@/store/canvasStore";
import { ICanvasMode } from "@/types/canvas.d";
import { IBrushType } from "@/types/brush.d";

import SettingsModal from "./SettingsModal";

/**
 * 画笔组件
 */
const Index: React.FC<{}> = () => {
  const [showSetting, setShowSetting] = React.useState(false);
  const canvasStore = useLocalStore(() => CanvasStore);
  useHotkeys("p", () => {
    canvasStore.switchMode(ICanvasMode.DRAW);
    // 点按多次，切换画笔类型
    if (canvasStore.activeBrush === IBrushType.BRUSH) {
      canvasStore.setActiveBrush(IBrushType.HIGHLIGHT);
    } else if (canvasStore.activeBrush === IBrushType.HIGHLIGHT) {
      canvasStore.setActiveBrush(IBrushType.BRUSH);
    }
  });
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
