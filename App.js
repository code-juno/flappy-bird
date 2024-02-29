import React, { useEffect } from "react";
import { Canvas, Image } from "@shopify/react-native-skia";
import { useWindowDimensions } from "react-native";
import { useFrameCallback, useSharedValue, withRepeat, withSequence, withTiming } from "react-native-reanimated";
import { GestureDetector, Gesture, GestureHandlerRootView } from 'react-native-gesture-handler';
import useImages from "./hooks/useImages";

const BIRD_WIDTH = 64;
const BIRD_HEIGHT = 48;
const BIRD_FLAP_VELOCITY = -500;

const PIPE_WIDTH = 104;
const PIPE_HEIGHT = 640;

const BASE_HEIGHT = 100;

const GRAVITY = 500;


const App = () => {
  const { width, height } = useWindowDimensions();
  const { bg, bird, pipeBottom, pipeTop, base } = useImages();

  const pipeOffset = 0;
  const pipesX = useSharedValue(width);
  const birdY = useSharedValue((height - BIRD_HEIGHT) / 2);
  const birdVelocityY = useSharedValue(0);

  useFrameCallback(({ timeSincePreviousFrame }) => {
    const dt = timeSincePreviousFrame / 1000;
    birdVelocityY.value = birdVelocityY.value + GRAVITY * dt;
    birdY.value = birdY.value + birdVelocityY.value * dt;
  })

  useEffect(() => {
    pipesX.value = withRepeat(
      withSequence(
        withTiming(-PIPE_WIDTH, { duration: 4000 }),
        withTiming(width, { duration: 0 })
      ),
      -1,
      true
    );
  }, []);

  const tap = Gesture.Tap().onStart(() => {
    birdVelocityY.value = BIRD_FLAP_VELOCITY;
  });

  return (
    <GestureHandlerRootView>
      <GestureDetector gesture={tap}>
        <Canvas style={{ width, height }}>
          <Image image={bg} fit="cover" width={width} height={height} />

          <Image image={pipeTop} x={pipesX} y={pipeOffset - PIPE_HEIGHT / 2} width={PIPE_WIDTH} height={PIPE_HEIGHT} />
          <Image image={pipeBottom} x={pipesX} y={pipeOffset + height - PIPE_HEIGHT / 2} width={PIPE_WIDTH} height={PIPE_HEIGHT} />

          <Image image={base} x={0} y={height - BASE_HEIGHT} width={width} height={BASE_HEIGHT} fit={"cover"} />

          <Image image={bird} x={width / 4} y={birdY} width={BIRD_WIDTH} height={BIRD_HEIGHT} />
        </Canvas>
      </GestureDetector>
    </GestureHandlerRootView>
  );
};

export default App;