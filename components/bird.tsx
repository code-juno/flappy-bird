import React, { useState } from "react";
import { Group, Image } from "@shopify/react-native-skia";
import useImages from "../hooks/useImages";
import { useGameContext } from "../context/useGameContext";
import { BIRD_HEIGHT, BIRD_WIDTH } from "../constants/gameConstants";
import { runOnJS, useAnimatedReaction } from "react-native-reanimated";

const Bird = () => {
  const { birdUpFlap, birdMidFlap, birdDownFlap } = useImages();
  const { birdY, birdX, birdOrigin, birdRotation, birdVelocityY } = useGameContext();
  const [birdImage, setBirdImage] = useState(birdMidFlap);

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
