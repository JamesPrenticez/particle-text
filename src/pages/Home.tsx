import React, { useState } from "react";
import Body from "../components/layout/Body";
import CanvasComponent from "../components/ParticleText";
import Test from "../components/AnimatedCanvas";

const Home = () => {
  const [value, setValue] = useState("-")

  return (
    <Body>
      <div className="relative w-full bg-green-700">

        {/* <input 
          type="text"
          className="absolute m-[10px] p-[10px] w-[calc(100%-20px)] z-50"
          onChange={(e) => setValue(e.target.value)}
        /> */}

        <CanvasComponent text={'James'}/>

      </div>
    </Body>
  );
};

export default Home;