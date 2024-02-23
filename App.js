import React from "react";
import { Canvas, Image, useImage } from "@shopify/react-native-skia";
import { useWindowDimensions } from "react-native";

const BIRD_WIDTH = 64;
const BIRD_HEIGHT = 48;
const PIPE_WIDTH = 104;
const PIPE_HEIGHT = 640;

const App = () => {
  const { width, height } = useWindowDimensions();
  const bg = useImage(require("./assets/sprites/background-day.png"));
  const bird = useImage(require("./assets/sprites/yellowbird-upflap.png"));
  const pipeBottom = useImage(require("./assets/sprites/pipe-green.png"));
  const pipeTop = useImage(require("./assets/sprites/pipe-green-top.png"));
  const pipeOffset = 0;

  return (
    <Canvas style={{ width, height }}>
      <Image image={bg} fit="cover" width={width} height={height} />
      <Image image={pipeTop} x={width / 2} y={pipeOffset - PIPE_HEIGHT / 2} width={PIPE_WIDTH} height={PIPE_HEIGHT} />
      <Image image={pipeBottom} x={width / 2} y={pipeOffset + height - PIPE_HEIGHT / 2} width={PIPE_WIDTH} height={PIPE_HEIGHT} />
      <Image image={bird} x={width / 4} y={(height - BIRD_HEIGHT) / 2} width={BIRD_WIDTH} height={BIRD_HEIGHT} />


    </Canvas>
  );
};

export default App;