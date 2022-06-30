import React from "react";

import Canvas from "./components/Canvas";
import Tools from "./components/Tools";
import State from "./components/State";

import "./index.less";

const Index: React.FC<{}> = () => {
  return (
    <div className="main">
      <Tools />
      <Canvas />
      <State />
    </div>
  );
};

export default Index;
