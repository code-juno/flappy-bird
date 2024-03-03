import React, { createContext, useContext, useState } from "react";
import { useWindowDimensions } from "react-native";
import { SharedValue, useDerivedValue, useSharedValue } from "react-native-reanimated";
import { BIRD_HEIGHT, PIPE_HEIGHT } from "../constants/gameConstants";

type GameContextTypes = {
  gameOver: boolean;
  setGameOver: (value: boolean) => void;
  collision: boolean;
  setCollision: (value: boolean) => void;
  score: number;
  setScore: (value: number) => void;
  birdX: number;
  pipeOffset: SharedValue<number>;
  pipesX: SharedValue<number>;
  topPipeY: SharedValue<number>;
  bottomPipeY: SharedValue<number>;
  birdY: SharedValue<number>;
  birdVelocityY: SharedValue<number>;
};

const GameContext = createContext<GameContextTypes>({} as GameContextTypes);

const GameContextProvider = ({ children }) => {
  const { width, height } = useWindowDimensions();
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [collision, setCollision] = useState(false);
  const birdX = width / 4;
  const pipeOffset = useSharedValue(0);
  const pipesX = useSharedValue(width);
  const birdY = useSharedValue((height - BIRD_HEIGHT) / 2);
  const birdVelocityY = useSharedValue(0);

  const topPipeY = useDerivedValue(() => {
    return pipeOffset.value - PIPE_HEIGHT / 2;
  });
  const bottomPipeY = useDerivedValue(() => {
    return pipeOffset.value + height - PIPE_HEIGHT / 2;
  });

  return (
    <GameContext.Provider
      value={{
        gameOver,
        setGameOver,
        score,
        setScore,
        birdX,
        pipeOffset,
        pipesX,
        topPipeY,
        bottomPipeY,
        birdY,
        birdVelocityY,
        collision,
        setCollision,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGameContext = () => {
  return useContext(GameContext);
};

export default GameContextProvider;
