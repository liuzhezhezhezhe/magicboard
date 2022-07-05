import React, { useEffect } from "react";
import { useLocalStore, useObserver } from "mobx-react";

import { MoveOne } from "@icon-park/react";

import { useHotkeys } from "react-hotkeys-hook";

import CanvasStore from "@/store/canvasStore";

import ToolContainer from "@/components/ToolContainer";
import { ICanvasMode } from "@/types/canvas.d";

import BaseControl from "./components/BaseControl/BaseControl";
import TextControl from "./components/BaseControl/TextControl";
import StickerControl from "./components/BaseControl/StickerControl";

/**
 * 移动组件
 */
const Index: React.FC<{}> = () => {
  const canvasStore = useLocalStore(() => CanvasStore);
  const [controlModal, setControlModal] = React.useState<React.ReactElement>();
  useHotkeys("v", () => {
    canvasStore.switchMode(ICanvasMode.SELECT);
  });
  useHotkeys("del, backspace", () => {
    const activeObjects = canvasStore.canvas?.getActiveObjects();
    if (activeObjects) {
      canvasStore.canvas?.remove(...activeObjects);
    }
  });
  useEffect((): void => {
    const canvas = canvasStore.canvas;
    if (canvas) {
      canvas.on("mouse:up", () => {
        const activeObject = canvas.getActiveObject();
        if (activeObject) {
          // left为中心点的x坐标
          const left =
            activeObject.getBoundingRect().left +
            activeObject.getBoundingRect().width / 2;
          const top = activeObject.getBoundingRect().top;
          switch (activeObject.type) {
            case "textbox":
              setControlModal(<TextControl />);
              break;
            // 其他类型的组件
            case "sticker":
              setControlModal(<StickerControl />);
              break;
            default:
              setControlModal(<BaseControl left={left} top={top} />);
              break;
          }
        }
      });
      canvas.on("object:removed", () => {
        setControlModal(undefined);
      });
      canvas.on("mouse:down", () => {
        setControlModal(undefined);
      });
    }
  }, [canvasStore.canvas]);
  return useObserver(() => (
    <ToolContainer
      className="tool"
      icon={
        <MoveOne
          theme="outline"
          size="24"
          fill={
            canvasStore.canvasMode === ICanvasMode.SELECT ? "#00bcd4" : "#333"
          }
        />
      }
      title="移动"
      onClick={() => {
        canvasStore.switchMode(ICanvasMode.SELECT);
      }}
    >
      {controlModal}
    </ToolContainer>
  ));
};

export default Index;
