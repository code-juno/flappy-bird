import React, { createContext, useContext, useState } from "react";
import { useWindowDimensions } from "react-native";
import {
  Extrapolation,
  SharedValue,
  interpolate,
  useDerivedValue,
  useSharedValue,
} from "react-native-reanimated";
import { BIRD_HEIGHT, BIRD_WIDTH } from "../constants/gameConstants";
import { Transforms2d } from "@shopify/react-native-skia";

type GameContextTypes = {
  gameOver: boolean;
  setGameOver: (value: boolean) => void;
  score: number;
  setScore: (value: number) => void;
  pipeOffset: number;

  pipesX: SharedValue<number>;
  birdY: SharedValue<number>;
  birdVelocityY: SharedValue<number>;
  birdOrigin: Readonly<
    SharedValue<{
      x: number;
      y: number;
    }>
  >;
  birdRotation: Readonly<SharedValue<Transforms2d>>;
};

const GameContext = createContext<GameContextTypes>({} as GameContextTypes);

const GameContextProvider = ({ children }) => {
  const { width, height } = useWindowDimensions();
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);

  const pipeOffset = 0;
  const pipesX = useSharedValue(width);
  const birdY = useSharedValue((height - BIRD_HEIGHT) / 2);
  const birdVelocityY = useSharedValue(0);
  const birdOrigin = useDerivedValue(() => {
    return { x: width / 4 + BIRD_WIDTH / 2, y: birdY.value + BIRD_HEIGHT / 2 };
  });
  const birdRotation = useDerivedValue(() => {
    return [
      {
        rotate: interpolate(
          birdVelocityY.value,
          [-500, 500],
          [-Math.PI / 4, Math.PI / 4],
          Extrapolation.CLAMP
        ),
      },
    ];
  });

  return (
    <GameContext.Provider
      value={{
        gameOver,
        setGameOver,
        score,
        setScore,
        pipeOffset,
        pipesX,
        birdY,
        birdVelocityY,
        birdOrigin,
        birdRotation,
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
