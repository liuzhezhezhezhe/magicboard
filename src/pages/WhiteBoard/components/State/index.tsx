import React from "react";

import Drag from "./components/Drag";
import Zoom from "./components/Zoom";
import Zen from "./components/Zen";

import "./index.less";

/**
 * 白板状态组件
 */
const Index: React.FC<{}> = () => {
  return (
    <div className="state-container">
      <Drag />
      <Zoom />
      <Zen />
    </div>
  );
};

export default Index;
