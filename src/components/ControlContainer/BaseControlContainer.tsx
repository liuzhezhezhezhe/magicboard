import React, { useEffect } from "react";
import { useLocalObservable } from "mobx-react";

import CanvasStore from "@/store/canvasStore";

import "./index.less";

/**
 * 基本控制组件
 * @param {string?} className 元素class
 * @param {React.ReactNode} children 子组件
 * @param {number} left 控制组件的x坐标
 * @param {number} top 控制组件的y坐标
 */
interface IBaseControlProps {
  className?: string;
  children?: React.ReactNode;
  left: number;
  top: number;
}

/**
 * 基本控制组件
 */
const Index: React.FC<IBaseControlProps> = (props) => {
  const { left, top, className, children } = props;
  const canvasStore = useLocalObservable(() => CanvasStore);
  const controlModalRef = React.createRef<HTMLDivElement>();
  useEffect(() => {
    if (controlModalRef.current) {
      const { width, height } = controlModalRef.current.getBoundingClientRect();
      controlModalRef.current.style.left = `${left - width / 2}px`;
      controlModalRef.current.style.top = `${top - height - 5}px`;
    }
  }, [left, top]);
  return (
    <div
      className={`control-container ${className ? className : ""}`}
      style={{
        left,
        top,
      }}
      ref={controlModalRef}
    >
      {children}
      <div
        className="del-control"
        onClick={() => {
          const activeObjects = canvasStore.canvas?.getActiveObjects();
          console.log(activeObjects);

          if (activeObjects) {
            canvasStore.canvas?.remove(...activeObjects);
            canvasStore.canvas?.discardActiveObject();
          }
        }}
      >
        删除
      </div>
    </div>
  );
};

export default Index;
