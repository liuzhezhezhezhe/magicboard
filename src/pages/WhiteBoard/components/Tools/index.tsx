import React from "react";

import Move from "./components/Move";
import Erase from "./components/Erase";
import Pencil from "./components/Pencil";
import Square from "./components/Square";
import Stickers from "./components/Stickers";
import Text from "./components/Text";

import "./index.less";

const Index: React.FC<{}> = () => {
  return (
    <div className="tools-container">
      <div className="base-tools">
        <Move />
        <Pencil />
        <Text />
        <Square />
        <Stickers />
        <Erase />
      </div>
    </div>
  );
};
export default Index;
