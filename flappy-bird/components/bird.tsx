import React, { useState } from "react";
import { Group, Image } from "@shopify/react-native-skia";
import useImages from "../hooks/useImages";
import { useGameContext } from "../context/useGameContext";
import { BIRD_HEIGHT, BIRD_WIDTH } from "../constants/gameConstants";
import { Extrapolation, interpolate, runOnJS, useAnimatedReaction, useDerivedValue } from "react-native-reanimated";

const Bird = () => {
  const { birdUpFlap, birdMidFlap, birdDownFlap } = useImages();
  const { birdY, birdX, birdVelocityY, gameOver } = useGameContext();
  const [birdImage, setBirdImage] = useState(birdMidFlap);
  
  const birdOrigin = useDerivedValue(() => {
    return { x: birdX + BIRD_WIDTH / 2, y: birdY.value + BIRD_HEIGHT / 2 };
  });
  const birdRotation = useDerivedValue(() => {
    return [
      {
        rotate: gameOver ? Math.PI / 2 : interpolate(
          birdVelocityY.value,
          [-500, 500, 1000],
          [-Math.PI / 4, Math.PI / 4, Math.PI / 2],
          Extrapolation.CLAMP
        ),
      },
    ];
  });
  
  useAnimatedReaction(
    () => birdVelocityY.value,
    (velocityY, prevVelocityY) => {
      if (velocityY < -100 && prevVelocityY > -100) {
        runOnJS(setBirdImage)(birdUpFlap);
      } else if (velocityY > 100 && prevVelocityY < 100) {
        runOnJS(setBirdImage)(birdDownFlap);
      } else if (velocityY < 100 && prevVelocityY > 100 || velocityY > -100 && prevVelocityY < -100) {
        runOnJS(setBirdImage)(birdMidFlap);
      } 
    }
  )

  return (
    <Group transform={birdRotation} origin={birdOrigin}>
        <Image image={birdImage} x={birdX} y={birdY} width={BIRD_WIDTH} height={BIRD_HEIGHT} />
    </Group>
  );
};

export default Bird;
