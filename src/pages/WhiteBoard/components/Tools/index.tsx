import React from "react";

import Drag from "./components/Drag";
import Select from "./components/Select";
import Erase from "./components/Erase";
import Pencil from "./components/Pencil";
import Shape from "./components/Shape";
import Stickers from "./components/Stickers";
import Text from "./components/Text";

import "./index.less";

const Index: React.FC<{}> = () => {
  return (
    <div className="tools-container">
      <div className="base-tools">
        <Drag />
        <Select />
        <Pencil />
        <Text />
        <Shape />
        <Stickers />
        <Erase />
      </div>
    </div>
  );
};
export default Index;
