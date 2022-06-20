import React from "react";

import Select from "./components/Select";
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
        <Select />
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
