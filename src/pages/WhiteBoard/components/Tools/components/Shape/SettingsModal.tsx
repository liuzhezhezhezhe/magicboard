import React, { useEffect } from "react";
import { OvalOne, Square, Triangle, Minus } from "@icon-park/react";

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
 * 形状设置
 * @param {IShapeType} shapeType 形状类型
 * @param {(shapeType: IShapeType) => void} onChange 设置形状
 */
export interface ISettingsModalProps {
  shape: IShapeType;
  onChange: (shapeType: IShapeType) => void;
}

/**
 * 形状设置组件
 */
const Index: React.FC<ISettingsModalProps> = (props) => {
  const { shape, onChange } = props;
  const [activeShape, setActiveShape] = React.useState(shape);
  return (
    <div className="settings-modal-container">
      <div className="shape-container">
        {customShapeList.map((item) => (
          <div
            className={`shape-item ${
              activeShape === item.type ? "active" : ""
            }`}
            key={item.type}
            onClick={() => {
              setActiveShape(item.type);
              onChange(item.type);
            }}
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
