import React from "react";

import { ClearFormat } from "@icon-park/react";

import ToolContainer from "@/components/ToolContainer";

/**
 * 橡皮擦组件
 */
const Index: React.FC<{}> = () => {
  return (
    <ToolContainer
      className="tool"
      icon={<ClearFormat theme="outline" size="24" fill="#333" />}
      title="橡皮"
      onClick={() => alert("点击了橡皮")}
    ></ToolContainer>
  );
};

export default Index;
