import React from "react";
import Game from "./Game";
import GameContextProvider from "./context/useGameContext";

const App = () => {

  return (
    <GameContextProvider>
      <Game />
    </GameContextProvider>
  );
};

export default App;
