import React, { useEffect } from "react";
import { useLocalStore, useObserver } from "mobx-react";

import { ClearFormat } from "@icon-park/react";

import ToolContainer from "@/components/ToolContainer";
import CanvasStore, { ICanvasMode } from "@/store/canvasStore";

import SettingsModal from "./SettingsModal";
import { handleClickOutside } from "@/utils/index";

import "./index.less";

/**
 * 橡皮擦组件
 */
const Index: React.FC<{}> = () => {
  // 显示设置框
  const [showSetting, setShowSetting] = React.useState(false);
  const canvasStore = useLocalStore(() => CanvasStore);
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
