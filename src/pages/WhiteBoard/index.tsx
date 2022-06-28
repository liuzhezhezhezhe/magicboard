import { useLocalStore } from "mobx-react";
import React, { useEffect } from "react";

import Canvas from "./components/Canvas";
import Tools from "./components/Tools";

import "./index.less";

const Index: React.FC<{}> = () => {
  return (
    <div className="main">
      <Tools />
      <Canvas />
    </div>
  );
};

export default Index;
