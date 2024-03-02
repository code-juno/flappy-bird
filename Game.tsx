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
  useDerivedValue,
  useSharedValue,
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

const Game = () => {
  const { width, height } = useWindowDimensions();
  const { bg, bird, pipeBottom, pipeTop, base } = useImages();
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

  const bgFirstTileX = useSharedValue(0);
  const baseFirstTileX = useSharedValue(0);

  useFrameCallback(({ timeSincePreviousFrame }) => {
    if (gameOver || !timeSincePreviousFrame) {
      return;
    }
    const dt = timeSincePreviousFrame / 1000;
    birdVelocityY.value = birdVelocityY.value + GRAVITY * dt;
    birdY.value = birdY.value + birdVelocityY.value * dt;
  });

  useEffect(() => {
    moveMap();
  }, []);

  function moveMap() {
    "worklet";

    const pipeDuration = 4000;
    const baseDuration = (pipeDuration * (width + PIPE_WIDTH)) / width;

    pipesX.value = withRepeat(
      withSequence(
        withTiming(width, { duration: 0 }),
        withTiming(-PIPE_WIDTH, {
          duration: pipeDuration,
          easing: Easing.linear,
        })
      ),
      -1,
      true
    );

    baseFirstTileX.value = withRepeat(
      withSequence(
        withTiming(width, { duration: 0 }),
        withTiming(0, { duration: baseDuration, easing: Easing.linear })
      ),
      -1,
      true
    );

    bgFirstTileX.value = withRepeat(
      withSequence(
        withTiming(width, { duration: 0 }),
        withTiming(0, { duration: 6000, easing: Easing.linear })
      ),
      -1,
      true
    );
  }

  const bgSecondTileX = useDerivedValue(() => {
    return bgFirstTileX.value - width;
  });

  const baseSecondTileX = useDerivedValue(() => {
    return baseFirstTileX.value - width;
  });

  useAnimatedReaction(
    () => birdY.value,
    (y) => {
      if (y < 0 || y > height - BASE_HEIGHT - BIRD_HEIGHT) {
        birdVelocityY.value = 0;
        pipesX.value = withTiming(pipesX.value, { duration: 0 });
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

  const tap = Gesture.Tap().onStart(() => {
    birdVelocityY.value = BIRD_FLAP_VELOCITY;
    if (gameOver) {
      runOnJS(setGameOver)(false);
      birdY.value = (height - BIRD_HEIGHT) / 2;
      moveMap();
    }
  });

  const Map = () => {
    return (
      <>
        <Image
          y={0}
          x={bgFirstTileX}
          image={bg}
          fit="fill"
          width={width + 2}
          height={height}
        />
        <Image
          y={0}
          x={bgSecondTileX}
          image={bg}
          fit="fill"
          width={width + 2}
          height={height}
        />

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

        <Image
          image={base}
          x={baseFirstTileX}
          y={height - BASE_HEIGHT}
          width={width}
          height={BASE_HEIGHT}
          fit={"fill"}
        />
        <Image
          image={base}
          x={baseSecondTileX}
          y={height - BASE_HEIGHT}
          width={width}
          height={BASE_HEIGHT}
          fit={"fill"}
        />
      </>
    );
  };

  return (
    <GestureHandlerRootView>
      <GestureDetector gesture={tap}>
        <View>
          <Score score={score} />
          <Canvas style={{ width, height }}>
            <Map />

            <Group transform={birdRotation} origin={birdOrigin}>
              <Image
                image={bird}
                x={width / 4}
                y={birdY}
                width={BIRD_WIDTH}
                height={BIRD_HEIGHT}
              />
            </Group>
          </Canvas>
        </View>
      </GestureDetector>
    </GestureHandlerRootView>
  );
};

export default Game;
