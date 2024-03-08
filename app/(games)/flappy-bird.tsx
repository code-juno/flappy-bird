import React from "react";
import Game from "../../flappy-bird/game";
import GameContextProvider from "../../flappy-bird/context/useGameContext";
import { FiberProvider } from "its-fine";

const FlappyBird = () => {
  return (
    <FiberProvider>
      <GameContextProvider>
        <Game />
      </GameContextProvider>
    </FiberProvider>
  );
};

export default FlappyBird;