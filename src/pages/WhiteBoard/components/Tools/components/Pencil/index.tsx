import React from "react";
import { useLocalStore, useObserver } from "mobx-react";

import iro from "@jaames/iro";
import { Edit } from "@icon-park/react";

import { useHotkeys } from "react-hotkeys-hook";

import ToolContainer from "@/components/ToolContainer";
import CanvasStore from "@/store/canvasStore";
import { ICanvasMode } from "@/types/canvas.d";
import { IBrushType } from "@/types/brush.d";
import { defaultBrushs } from "@/constants/brush";

import SettingsModal from "./SettingsModal";

/**
 * 画笔组件
 */
const Index: React.FC<{}> = () => {
  const [showSetting, setShowSetting] = React.useState(false);
  const currentBrush = React.useRef(IBrushType.BRUSH);
  const canvasStore = useLocalStore(() => CanvasStore);
  useHotkeys("p", () => {
    canvasStore.switchMode(ICanvasMode.DRAW);
    // 点按多次，切换画笔类型
    if (currentBrush.current === IBrushType.BRUSH) {
      currentBrush.current = IBrushType.HIGHLIGHT;
    } else if (currentBrush.current === IBrushType.HIGHLIGHT) {
      currentBrush.current = IBrushType.BRUSH;
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
        const brush = defaultBrushs.get(currentBrush.current);
        if (brush) {
          const currentColor = new iro.Color(brush.color);
          currentColor.alpha = brush.opacity;
          if (canvasStore.canvas) {
            canvasStore.canvas.freeDrawingBrush.color = currentColor.hex8String;
            canvasStore.canvas.freeDrawingBrush.width = brush.size;
          }
        }
      }}
      onBlur={() => {
        setShowSetting(false);
      }}
    >
      {showSetting && (
        <SettingsModal
          currentBrush={currentBrush.current}
          onChange={(activeBrush: IBrushType) =>
            (currentBrush.current = activeBrush)
          }
        />
      )}
    </ToolContainer>
  ));
};

export default Index;
