import React, { useCallback } from "react";
import { Observer, useLocalObservable } from "mobx-react";

import iro from "@jaames/iro";
import { Edit } from "@icon-park/react";

import { useHotkeys } from "react-hotkeys-hook";

import ToolContainer from "@/components/ToolContainer";
import CanvasStore from "@/stores/canvasStore";
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
  const canvasStore = useLocalObservable(() => CanvasStore);
  const handleSwitchBrush = useCallback(() => {
    const brush = defaultBrushs.get(currentBrush.current);
    if (brush) {
      const currentColor = new iro.Color(brush.color);
      currentColor.alpha = brush.opacity;
      if (canvasStore.canvas) {
        canvasStore.canvas.freeDrawingBrush.color = currentColor.hex8String;
        canvasStore.canvas.freeDrawingBrush.width = brush.size;
      }
    }
  }, [canvasStore.canvas, currentBrush.current]);
  useHotkeys("b", () => {
    canvasStore.switchMode(ICanvasMode.DRAW);
    handleSwitchBrush();
  });
  return (
    <Observer>
      {() => (
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
          title="Brush(b)"
          onClick={() => {
            canvasStore.switchMode(ICanvasMode.DRAW);
            setShowSetting((prev) => !prev);
            handleSwitchBrush();
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
      )}
    </Observer>
  );
};

export default Index;
