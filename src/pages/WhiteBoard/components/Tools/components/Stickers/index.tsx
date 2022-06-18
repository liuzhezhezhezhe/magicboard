import React from "react";

import { Stickers } from "@icon-park/react";

import ToolContainer from "@/components/ToolContainer";

/**
 * 便签组件
 */
const Index: React.FC<{}> = () => {
  return (
    <ToolContainer
      className="tool"
      icon={<Stickers theme="outline" size="24" fill="#333" />}
      title="便签"
      onClick={() => alert("点击了便签")}
    ></ToolContainer>
  );
};

export default Index;
