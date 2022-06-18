import React from "react";

import { MoveOne } from "@icon-park/react";

import ToolContainer from "@/components/ToolContainer";

/**
 * 移动组件
 */
const Index: React.FC<{}> = () => {
  return (
    <ToolContainer
      className="tool"
      icon={<MoveOne theme="outline" size="24" fill="#333" />}
      title="移动"
      onClick={() => alert("点击了移动")}
    ></ToolContainer>
  );
};

export default Index;
