import React, { useEffect } from "react";
import { useLocalStore } from "mobx-react";
import { OvalOne, Square, Triangle, Minus } from "@icon-park/react";

import CanvasStore from "@/store/canvasStore";
import { ICustomShape, IShapeType } from "@/types/shape.d";

import "./index.less";

/**
 * 形状列表
 */
export const customShapeList: ICustomShape[] = [
  {
    type: IShapeType.ELLIPSE,
    name: "椭圆",
    icon: <OvalOne theme="outline" size="24" fill="#333" />,
  },
  {
    type: IShapeType.RECTANGLE,
    name: "矩形",
    icon: <Square theme="outline" size="24" fill="#333" />,
  },
  {
    type: IShapeType.TRIANGLE,
    name: "三角形",
    icon: <Triangle theme="outline" size="24" fill="#333" />,
  },
  {
    type: IShapeType.LINE,
    name: "直线",
    icon: <Minus theme="outline" size="24" fill="#333" />,
  },
];

/**
 * 橡皮擦设置组件
 */
const Index: React.FC<{}> = () => {
  // 橡皮擦大小
  const canvasStore = useLocalStore(() => CanvasStore);
  const [activeShape, setActiveShape] = React.useState<IShapeType>(
    canvasStore.activeShape
  );
  useEffect(() => {
    canvasStore.setActiveShape(activeShape);
  }, [activeShape]);
  return (
    <div className="settings-modal-container">
      <div className="shape-container">
        {customShapeList.map((item) => (
          <div
            className={`shape-item ${
              activeShape === item.type ? "active" : ""
            }`}
            key={item.type}
            onClick={() => setActiveShape(item.type)}
          >
            <div className="shape-icon">{item.icon}</div>
            <div className="shape-name">{item.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Index;
