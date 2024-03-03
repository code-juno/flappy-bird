import React from "react";
import Game from "./game";
import GameContextProvider from "./context/useGameContext";
import { FiberProvider } from "its-fine";

const App = () => {
  return (
    <FiberProvider>
      <GameContextProvider>
        <Game />
      </GameContextProvider>
    </FiberProvider>
  );
};

export default App;
