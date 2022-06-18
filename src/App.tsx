import React from "react";
import { Routes, Route } from 'react-router-dom';

import WhiteBoard from "@/pages/WhiteBoard";

function App() {
  return (
    <Routes>
      <Route path="/" element={<WhiteBoard />} />
    </Routes>
  );
}

export default App;
