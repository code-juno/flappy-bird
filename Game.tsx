import React, { useEffect } from "react";
import { Canvas, Group, Image } from "@shopify/react-native-skia";
import { useWindowDimensions, View } from "react-native";
import {
  Easing,
  useAnimatedReaction,
  useFrameCallback,
  withRepeat,
  withSequence,
  withTiming,
  runOnJS,
} from "react-native-reanimated";
import {
  GestureDetector,
  Gesture,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import useImages from "./hooks/useImages";
import Score from "./components/score";
import { useGameContext } from "./context/useGameContext";
import {
  BASE_HEIGHT,
  BIRD_FLAP_VELOCITY,
  BIRD_HEIGHT,
  BIRD_WIDTH,
  GRAVITY,
  PIPE_HEIGHT,
  PIPE_WIDTH,
} from "./constants/gameConstants";
import Background from "./components/background";
import { useContextBridge } from "its-fine";
import Pipes from "./components/pipes";

const Game = () => {
  const { width, height } = useWindowDimensions();
  const { bird, pipeBottom, pipeTop } = useImages();
  const {
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
  } = useGameContext();
  const ContextBridge = useContextBridge();

  useFrameCallback(({ timeSincePreviousFrame }) => {
    if (gameOver || !timeSincePreviousFrame) {
      return;
    }
    const dt = timeSincePreviousFrame / 1000;
    birdVelocityY.value = birdVelocityY.value + GRAVITY * dt;
    birdY.value = birdY.value + birdVelocityY.value * dt;
  });

  useAnimatedReaction(
    () => birdY.value,
    (y) => {
      if (y < 0 || y > height - BASE_HEIGHT - BIRD_HEIGHT) {
        runOnJS(setGameOver)(true);
        birdVelocityY.value = 0;
      }
    }
  );

  useAnimatedReaction(
    () => pipesX.value,
    (x, xPrev) => {
      if (
        xPrev &&
        xPrev > width / 4 - PIPE_WIDTH / 2 &&
        x <= width / 4 - PIPE_WIDTH / 2
      ) {
        runOnJS(setScore)(score + 1);
      }
    }
  );

  const resetGame = () => {
    setGameOver(false);
    setScore(0);
  };

  const tap = Gesture.Tap().onStart(() => {
    birdVelocityY.value = BIRD_FLAP_VELOCITY;
    if (gameOver) {
      runOnJS(resetGame)();
      birdY.value = (height - BIRD_HEIGHT) / 2;
    }
  });

  return (
    <GestureHandlerRootView>
      <GestureDetector gesture={tap}>
        <View>
          <Score score={score} />
          <Canvas style={{ width, height }}>
            <ContextBridge>
              <Background>
                <Pipes />
              </Background>

              <Group transform={birdRotation} origin={birdOrigin}>
                <Image
                  image={bird}
                  x={width / 4}
                  y={birdY}
                  width={BIRD_WIDTH}
                  height={BIRD_HEIGHT}
                />
              </Group>
            </ContextBridge>
          </Canvas>
        </View>
      </GestureDetector>
    </GestureHandlerRootView>
  );
};

export default Game;
