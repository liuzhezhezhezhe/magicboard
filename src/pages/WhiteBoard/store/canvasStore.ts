import { fabric } from "fabric";
import { observable } from "mobx";

interface ICanvasStore {
  canvas: fabric.Canvas | null;
  setCanvas: (canvas: fabric.Canvas) => void;
}

const CanvasStore = observable<ICanvasStore>({
  canvas: null,
  setCanvas(canvas: fabric.Canvas) {
    this.canvas = canvas;
  },
});

export default CanvasStore;
