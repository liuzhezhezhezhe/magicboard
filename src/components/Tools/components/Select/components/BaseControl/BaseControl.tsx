import React from "react";

import ControlContainer from "@/components/ControlContainer/BaseControlContainer";

import "./index.less";

/**
 * 基本控制组件
 * @param {number} left 控制组件的x坐标
 * @param {number} top 控制组件的y坐标
 */
export interface ITextControlProps {
  left: number;
  top: number;
}

/**
 * 基本控制
 */
const Index: React.FC<ITextControlProps> = (props) => {
  return (
    <ControlContainer {...props}>
      <div className="control-item">一些常用的功能</div>
    </ControlContainer>
  );
};

export default Index;
