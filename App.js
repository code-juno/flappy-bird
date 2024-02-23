import React from "react";
import { Canvas, Image } from "@shopify/react-native-skia";
import { useWindowDimensions } from "react-native"; 
import { useImage } from "@shopify/react-native-skia";

const App = () => {
  const { width, height } = useWindowDimensions();
  const background = useImage(require("./assets/sprites/background-day.png"));

  return (
    <Canvas style={{ width, height }}>
      <Image image={background} fit="cover" x={0} y={0} width={width} height={height} />
    </Canvas>
  );
};
 
export default App;