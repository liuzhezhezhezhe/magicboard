import React from "react";

import { Text } from "@icon-park/react";

import ToolContainer from "@/components/ToolContainer";

/**
 * 文本组件
 */
const Index: React.FC<{}> = () => {
  return (
    <ToolContainer
      className="tool"
      icon={<Text theme="outline" size="24" fill="#333" />}
      title="文本"
      onClick={() => alert("点击了文本")}
    ></ToolContainer>
  );
};

export default Index;
