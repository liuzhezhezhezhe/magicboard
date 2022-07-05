import React from "react";

import ControlContainer from "@/components/ControlContainer/BaseControlContainer";

import "./index.less";

/**
 * 文字控制组件
 * @param {number} left 控制组件的x坐标
 * @param {number} top 控制组件的y坐标
 */
export interface ITextControlProps {
  left: number;
  top: number;
}

/**
 * 文字控制
 * 字号、字体、颜色、背景色、阴影、下划线、加粗、斜体、文字对齐
 */
const Index: React.FC<ITextControlProps> = (props) => {
  return (
    <ControlContainer {...props}>
      <div className="control-item">一些常用的功能</div>
    </ControlContainer>
  );
};

export default Index;
