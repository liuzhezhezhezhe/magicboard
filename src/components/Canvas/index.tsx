import { useLocalObservable } from "mobx-react";
import React, { useEffect, useState } from "react";
import pako from "pako";
import { useHotkeys } from "react-hotkeys-hook";

import CanvasStore from "@/stores/canvasStore";

import { resetCanvasControl } from "./options";
import { fetch, store } from "@/apis/load";

async function loadData(setData: (data: string) => void) {
  try {
    const res = await fetch();
    setData(res.data.data);
  } catch (error) {
    console.error(error);
  }
}

async function saveData(data: string, setData: (data: string) => void) {
  try {
    const res = await store({
      magicboard: data,
    });
    if (res.data.data) {
      setData(res.data.data);
    }
  } catch (error) {
    console.error(error);
  }
}

const Index: React.FC<{}> = () => {
  const canvasStore = useLocalObservable(() => CanvasStore);
  const [compressed, setCompressed] = useState<string>();
  useEffect(() => {
    loadData(setCompressed);
  }, []);
  useHotkeys("ctrl+s, command+s", (e) => {
    e.preventDefault();
    const data = JSON.stringify(canvasStore.canvas);
    const output = pako.deflate(data);
    const compressed = output.toString();
    saveData(compressed, setCompressed);
  });
  useEffect(() => {
    if (compressed) {
      try {
        const arr = compressed.split(",");
        const input = Uint8Array.from(
          arr.map((item) => parseInt(item)).values()
        );
        const data = pako.inflate(input, { to: "string" });
        if (canvasStore.canvas) {
          canvasStore.canvas.loadFromJSON(data, () => {});
        }
      } catch (error) {
        console.error("转出错了", error);
      }
    }
  }, [compressed]);
  useEffect(() => {
    // 初始化画布
    if (canvasStore.canvas === null || canvasStore.canvas === undefined) {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const canvas = new fabric.Canvas("whiteboard", {
        width,
        height,
        isDrawingMode: false,
        backgroundColor: "#f7f7f7",
      });
      canvasStore.setCanvas(canvas);
      // 重置形状控制
      resetCanvasControl();
    }
  }, [canvasStore]);
  return <canvas className="whiteboard" id="whiteboard" />;
};

export default Index;
