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

  useEffect(() => {
    console.log("gameOver Game", gameOver);
    if (gameOver) {
      birdVelocityY.value = 0;
      pipesX.value = withTiming(pipesX.value, { duration: 0 });
      return;
    }
    pipesX.value = withRepeat(
      withSequence(
        withTiming(width, { duration: 0 }),
        withTiming(-PIPE_WIDTH, {
          duration: 4000,
          easing: Easing.linear,
        })
      ),
      -1,
      true
    );
  }, [gameOver]);

  useAnimatedReaction(
    () => birdY.value,
    (y) => {
      if (y < 0 || y > height - BASE_HEIGHT - BIRD_HEIGHT) {
        runOnJS(setGameOver)(true);
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
                <Image
                  image={pipeTop}
                  x={pipesX}
                  y={pipeOffset - PIPE_HEIGHT / 2}
                  width={PIPE_WIDTH}
                  height={PIPE_HEIGHT}
                />
                <Image
                  image={pipeBottom}
                  x={pipesX}
                  y={pipeOffset + height - PIPE_HEIGHT / 2}
                  width={PIPE_WIDTH}
                  height={PIPE_HEIGHT}
                />
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
