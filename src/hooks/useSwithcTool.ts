import { useCallback, useState } from "react";

import { ICanvasStore } from "@/stores/canvasStore";
import { ICanvasMode } from "@/types/canvas";

/**
 * 切换模式
 * @param canvasStore
 * @returns switchTool
 */
export function useSwitchTool(canvasStore: ICanvasStore) {
  const [refresh, setRefresh] = useState<boolean>(false);
  const switchTool = (mode: ICanvasMode) => {
    canvasStore.switchMode(mode);
    // 防止canvas发生改变，刷新一下
    setRefresh((prev) => !prev);
  };
  return { refresh, switchTool };
}
