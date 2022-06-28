import React from "react";
import { useLocalStore, useObserver } from "mobx-react";

import { ClearFormat } from "@icon-park/react";

import { useHotkeys } from "react-hotkeys-hook";

import ToolContainer from "@/components/ToolContainer";
import CanvasStore from "@/store/canvasStore";
import { ICanvasMode } from "@/types/canvas.d";
import { defaultBrushs } from "@/constants/brush";
import { IBrushType } from "@/types/brush.d";

import SettingsModal from "./SettingsModal";

import "./index.less";

/**
 * 橡皮擦组件
 */
const Index: React.FC<{}> = () => {
  // 显示设置框
  const [showSetting, setShowSetting] = React.useState(false);
  const canvasStore = useLocalStore(() => CanvasStore);
  useHotkeys("e", () => {
    canvasStore.switchMode(ICanvasMode.ERASE);
  });
  return useObserver(() => (
    <ToolContainer
      className="tool"
      icon={
        <ClearFormat
          theme="outline"
          size="24"
          fill={
            canvasStore.canvasMode === ICanvasMode.ERASE ? "#00bcd4" : "#333"
          }
        />
      }
      title="橡皮"
      onClick={() => {
        setShowSetting((prev) => !prev);
        canvasStore.switchMode(ICanvasMode.ERASE);
        const brush = defaultBrushs.get(IBrushType.ERASER);
        if (brush) {
          if (canvasStore.canvas) {
            canvasStore.canvas.freeDrawingBrush.width = brush.size;
          }
        }
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
