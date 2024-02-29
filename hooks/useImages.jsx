import React from 'react'
import { useImage } from "@shopify/react-native-skia";

const useImages = () => {
  const bg = useImage(require("../assets/sprites/background-day.png"));
  const bird = useImage(require("../assets/sprites/yellowbird-upflap.png"));
  const pipeBottom = useImage(require("../assets/sprites/pipe-green.png"));
  const pipeTop = useImage(require("../assets/sprites/pipe-green-top.png"));
  const base = useImage(require("../assets/sprites/base.png"));

  return { bg, bird, pipeBottom, pipeTop, base };
}

export default useImages;