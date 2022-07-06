import React, { useEffect } from "react";
import { Observer, useLocalObservable } from "mobx-react";

import { MoveOne } from "@icon-park/react";

import { useHotkeys } from "react-hotkeys-hook";

import CanvasStore from "@/store/canvasStore";

import ToolContainer from "@/components/ToolContainer";
import { ICanvasMode } from "@/types/canvas.d";

import BaseControl from "./components/BaseControl/BaseControl";
import TextControl from "./components/BaseControl/TextControl";
import StickerControl from "./components/BaseControl/StickerControl";
import ShapeControl from "./components/BaseControl/ShapeControl";
import PathControl from "./components/BaseControl/PathControl";

/**
 * 移动组件
 */
const Index: React.FC<{}> = () => {
  const canvasStore = useLocalObservable(() => CanvasStore);
  const [controlModal, setControlModal] = React.useState<React.ReactElement>();
  useHotkeys("v", () => {
    canvasStore.switchMode(ICanvasMode.SELECT);
  });
  useHotkeys("del, backspace", () => {
    const activeObjects = canvasStore.canvas?.getActiveObjects();
    if (activeObjects) {
      canvasStore.canvas?.remove(...activeObjects);
      canvasStore.canvas?.discardActiveObject();
    }
  });
  useEffect(() => {
    const canvas = canvasStore.canvas;
    if (canvas) {
      // 增加图形处理函数
      const showControlHandler = () => {
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
            case "shape":
              setControlModal(<ShapeControl />);
              break;
            case "path":
              setControlModal(<PathControl />);
              break;
            default:
              setControlModal(<BaseControl left={left} top={top} />);
              break;
          }
        }
      };
      const hideControlHandler = () => {
        setControlModal(undefined);
      };
      canvas.on("mouse:up", showControlHandler);
      canvas.on("object:removed", hideControlHandler);
      canvas.on("mouse:down", hideControlHandler);
      return () => {
        canvas.off("mouse:up", showControlHandler);
        canvas.off("object:removed", hideControlHandler);
        canvas.off("mouse:down", hideControlHandler);
      };
    }
  }, [canvasStore.canvas]);
  return (
    <Observer>
      {() => (
        <ToolContainer
          className="tool"
          icon={
            <MoveOne
              theme="outline"
              size="24"
              fill={
                canvasStore.canvasMode === ICanvasMode.SELECT
                  ? "#00bcd4"
                  : "#333"
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
      )}
    </Observer>
  );
};

export default Index;
