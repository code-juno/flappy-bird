import React from "react";
import { Group, Image } from "@shopify/react-native-skia";
import useImages from "../hooks/useImages";
import { useGameContext } from "../context/useGameContext";
import { BIRD_HEIGHT, BIRD_WIDTH } from "../constants/gameConstants";
import { useWindowDimensions } from "react-native";

const Bird = () => {
  const { bird } = useImages();
  const { birdY, birdX, birdOrigin, birdRotation } = useGameContext();

  return (
    <Group transform={birdRotation} origin={birdOrigin}>
      <Image
        image={bird}
        x={birdX}
        y={birdY}
        width={BIRD_WIDTH}
        height={BIRD_HEIGHT}
      />
    </Group>
  );
};

export default Bird;
