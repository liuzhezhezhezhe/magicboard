import React from "react";
import { useLocalStore } from "mobx-react";

import { Edit } from "@icon-park/react";

import CanvasStore from "@/pages/WhiteBoard/store/canvasStore";
import ToolContainer from "@/components/ToolContainer";
import SettingsModal from "./SettingsModal";

/**
 * 画笔组件
 */
const Index: React.FC<{}> = () => {
  const [showSetting, setShowSetting] = React.useState(true);
  const canvasStore = useLocalStore(() => CanvasStore);
  return (
    <ToolContainer
      className="tool"
      icon={<Edit theme="outline" size="24" fill="#333" />}
      title="画笔"
      onClick={() => {
        setShowSetting((prev) => !prev);
        if (canvasStore.canvas) {
          // 点击了画笔，就开启绘画模式
          canvasStore.canvas.isDrawingMode = true;
        }
      }}
    >
      <SettingsModal visible={showSetting}></SettingsModal>
    </ToolContainer>
  );
};

export default Index;
