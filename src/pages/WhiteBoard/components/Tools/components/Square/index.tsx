import React from "react";

import { Square } from "@icon-park/react";

import ToolContainer from "@/components/ToolContainer";

/**
 * 形状组件
 */
const Index: React.FC<{}> = () => {
  return (
    <ToolContainer
      className="tool"
      icon={<Square theme="outline" size="24" fill="#333" />}
      title="形状"
      onClick={() => alert("点击了形状")}
    ></ToolContainer>
  );
};

export default Index;
