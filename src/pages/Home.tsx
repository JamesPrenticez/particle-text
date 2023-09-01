import React, { type ReactElement } from "react";
import { Button } from "@jamesprenticez/tailwind-uplift"
import Body from "../components/layout/Body";

const Home = (): ReactElement => {
  return (
    <Body>
      <h1>Home</h1>

      <Button type="button" className="bg-red-500 h-12">
        Button
      </Button>

    </Body>
  );
};

export default Home;