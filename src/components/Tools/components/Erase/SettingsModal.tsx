import React, { useEffect } from "react";
import { debounce } from "lodash";
import { useLocalObservable } from "mobx-react";

import CanvasStore from "@/stores/canvasStore";

import { IBrushType } from "@/types/brush.d";
import { defaultBrushs } from "@/constants/brush";

import "./index.less";

/**
 * 橡皮擦设置组件
 */
const Index: React.FC<{}> = () => {
  // 橡皮擦大小
  const canvasStore = useLocalObservable(() => CanvasStore);
  const [size, setSize] = React.useState<number>(
    defaultBrushs.get(IBrushType.ERASER)?.size || 10
  );
  // 画笔属性更新时，更新数据
  useEffect(() => {
    const eraser = defaultBrushs.get(IBrushType.ERASER);
    if (eraser) {
      eraser.size = size;
    }
    if (canvasStore.canvas) {
      // 更新画笔数据
      canvasStore.canvas.freeDrawingBrush.width = size;
    }
  }, [size]);
  return (
    <div className="settings-modal-container">
      {/* 画笔透明度/粗细 */}
      <input
        className="range-picker"
        type="range"
        min={0}
        max={100}
        step={1}
        defaultValue={size}
        onChange={debounce((e) => setSize(Number(e.target.value)), 200)}
      />
    </div>
  );
};

export default Index;
