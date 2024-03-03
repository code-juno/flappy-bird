import React, { PropsWithChildren, useEffect } from "react";
import { Image } from "@shopify/react-native-skia";
import useImages from "../hooks/useImages";
import { useWindowDimensions } from "react-native";
import { BASE_HEIGHT } from "../constants/gameConstants";
import {
  Easing,
  withRepeat,
  withSequence,
  withTiming,
  useDerivedValue,
  useSharedValue,
} from "react-native-reanimated";
import { useGameContext } from "../context/useGameContext";

const Background: React.FC<PropsWithChildren> = ({ children }) => {
  const { width, height } = useWindowDimensions();
  const bgFirstTileX = useSharedValue(0);
  const baseFirstTileX = useSharedValue(0);
  const { bg, base } = useImages();
  const { gameOver } = useGameContext();

  useEffect(() => {
    if (gameOver) {
      bgFirstTileX.value = withTiming(bgFirstTileX.value, { duration: 0 });
      baseFirstTileX.value = withTiming(bgFirstTileX.value, { duration: 0 });
      return;
    }
    baseFirstTileX.value = withRepeat(
      withSequence(
        withTiming(width, { duration: 0 }),
        withTiming(0, { duration: 3200, easing: Easing.linear })
      ),
      -1,
      true
    );

    bgFirstTileX.value = withRepeat(
      withSequence(
        withTiming(width, { duration: 0 }),
        withTiming(0, { duration: 8000, easing: Easing.linear })
      ),
      -1,
      true
    );
  }, [gameOver]);

  const bgSecondTileX = useDerivedValue(() => {
    return bgFirstTileX.value - width;
  });

  const baseSecondTileX = useDerivedValue(() => {
    return baseFirstTileX.value - width;
  });

  return (
    <>
      <Image y={0} x={bgFirstTileX} image={bg} fit="fill" width={width + 2} height={height} />
      <Image y={0} x={bgSecondTileX} image={bg} fit="fill" width={width + 2} height={height} />

      {children}

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

export default Background;
