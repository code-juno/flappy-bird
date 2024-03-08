import React, { useEffect } from "react";
import { Image } from "@shopify/react-native-skia";
import { PIPE_HEIGHT, PIPE_WIDTH } from "../../constants/gameConstants";
import { useWindowDimensions } from "react-native";
import { useGameContext } from "../../context/useGameContext";
import useImages from "../../hooks/useImages";
import { withRepeat, withSequence, withTiming, Easing } from "react-native-reanimated";

const Pipes = () => {
  const { width } = useWindowDimensions();
  const { gameOver, pipeOffset, pipesX, topPipeY, bottomPipeY, collision } = useGameContext();
  const { pipeTop, pipeBottom } = useImages();

  useEffect(() => {
    if (gameOver ||
       collision) {
      pipesX.value = withTiming(pipesX.value, { duration: 0 });
      pipeOffset.value = withTiming(pipeOffset.value, { duration: 0 });
      return;
    }
    pipesX.value = withRepeat(
      withSequence(
        withTiming(width, { duration: 0 }, () => {
          if(gameOver) return;
          pipeOffset.value = (2 * Math.random() - 1) * PIPE_HEIGHT * 0.3;
        }),
        withTiming(-PIPE_WIDTH, {
          duration: 4000,
          easing: Easing.linear,
        })
      ),
      -1,
      true
    );
  }, [gameOver, collision]);

  return (
    <>
      <Image
        image={pipeTop}
        x={pipesX}
        y={topPipeY}
        width={PIPE_WIDTH}
        height={PIPE_HEIGHT}
      />
      <Image
        image={pipeBottom}
        x={pipesX}
        y={bottomPipeY}
        width={PIPE_WIDTH}
        height={PIPE_HEIGHT}
      />
    </>
  );
};

export default Pipes;
