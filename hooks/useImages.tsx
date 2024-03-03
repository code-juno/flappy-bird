import { useImage } from "@shopify/react-native-skia";

const useImages = () => {
  const bg = useImage(require("../assets/sprites/background-day.png"));
  const birdUpFlap = useImage(require("../assets/sprites/yellowbird-upflap.png"));
  const birdMidFlap = useImage(require("../assets/sprites/yellowbird-midflap.png"));
  const birdDownFlap = useImage(require("../assets/sprites/yellowbird-downflap.png"));

  const pipeBottom = useImage(require("../assets/sprites/pipe-green.png"));
  const pipeTop = useImage(require("../assets/sprites/pipe-green-top.png"));
  const base = useImage(require("../assets/sprites/base.png"));

  return { bg, birdUpFlap, birdMidFlap, birdDownFlap, pipeBottom, pipeTop, base };
};

export default useImages;
