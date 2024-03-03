import React, { useEffect } from "react";
import { Image } from "@shopify/react-native-skia";
import { PIPE_HEIGHT, PIPE_WIDTH } from "../constants/gameConstants";
import { useWindowDimensions } from "react-native";
import { useGameContext } from "../context/useGameContext";
import useImages from "../hooks/useImages";
import { withRepeat, withSequence, withTiming, Easing } from "react-native-reanimated";

const Pipes = () => {
  const { width, height } = useWindowDimensions();
  const { gameOver, pipeOffset, pipesX } = useGameContext();
  const { pipeTop, pipeBottom } = useImages();

  useEffect(() => {
    if (gameOver) {
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

  return (
    <>
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
    </>
  );
};

export default Pipes;
