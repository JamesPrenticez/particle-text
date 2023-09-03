import React from "react";
import { Routes, Route } from "react-router-dom";

import ParticleText from "./components/ParticleText";
import ParticleImage from "./components/ParticleImage";

const NotFound: React.FC = () => <h1>404 - Not Found</h1>;

const App = (): React.ReactElement => {
  return (
    <Routes>
      <Route path="/" element={<ParticleText text={'James Prentice'}/>} />
      <Route path="/img" element={<ParticleImage img='./html-js-css.png'/>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;
