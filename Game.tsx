import { Canvas } from "@shopify/react-native-skia";
import { useWindowDimensions, View } from "react-native";
import { useAnimatedReaction, useFrameCallback, runOnJS } from "react-native-reanimated";
import { GestureDetector, Gesture, GestureHandlerRootView } from "react-native-gesture-handler";
import Score from "./components/score";
import { useGameContext } from "./context/useGameContext";
import {
  BASE_HEIGHT,
  BIRD_FLAP_VELOCITY,
  BIRD_HEIGHT,
  BIRD_WIDTH,
  GRAVITY,
  PIPE_HEIGHT,
  PIPE_WIDTH,
} from "./constants/gameConstants";
import Background from "./components/background";
import { useContextBridge } from "its-fine";
import Pipes from "./components/pipes";
import Bird from "./components/bird";

const Game = () => {
  const { width, height } = useWindowDimensions();
  const { gameOver, setGameOver, score, setScore, pipesX, topPipeY, bottomPipeY, birdX, birdY, birdVelocityY, collision, setCollision } =
    useGameContext();
  const ContextBridge = useContextBridge();

  useFrameCallback(({ timeSincePreviousFrame }) => {
    if (gameOver || !timeSincePreviousFrame) {
      return;
    }
    const dt = timeSincePreviousFrame / 1000;
    birdVelocityY.value = birdVelocityY.value + GRAVITY * dt;
    birdY.value = birdY.value + birdVelocityY.value * dt;
  });

  useAnimatedReaction(
    () => birdY.value,
    (y) => {
      if (y < 0 || y > height - BASE_HEIGHT - BIRD_HEIGHT) {
        runOnJS(setGameOver)(true);
        birdVelocityY.value = 0;
      }
    }
  );

  useAnimatedReaction(
    () => pipesX.value,
    (x, xPrev) => {
      if (xPrev && xPrev > birdX - PIPE_WIDTH / 2 && x <= birdX - PIPE_WIDTH / 2) {
        runOnJS(setScore)(score + 1);
      }
    }
  );

  const resetGame = () => {
    setCollision(false);
    setScore(0);
    setGameOver(false);
  };

  const tap = Gesture.Tap().onStart(() => {
    if(collision && !gameOver) return;
    birdVelocityY.value = BIRD_FLAP_VELOCITY;
    if (gameOver) {
      runOnJS(resetGame)();
      birdY.value = (height - BIRD_HEIGHT) / 2;
    }
  });

  // check if the bird has collided with a pipe
  useAnimatedReaction(
    () => pipesX.value,
    (pipesX) => {
      if (birdX + BIRD_WIDTH > pipesX - 5 && birdX < pipesX + PIPE_WIDTH) {
        const topPipe = topPipeY.value + PIPE_HEIGHT;
        if (birdY.value < topPipe || birdY.value + BIRD_HEIGHT > bottomPipeY.value) {
          birdVelocityY.value = 500;
          runOnJS(setCollision)(true);
        }
      }
    }
  );

  return (
    <GestureHandlerRootView>
      <GestureDetector gesture={tap}>
        <View>
          <Score score={score} />
          <Canvas style={{ width, height }}>
            <ContextBridge>
              <Background>
                <Pipes />
              </Background>
              <Bird />
            </ContextBridge>
          </Canvas>
        </View>
      </GestureDetector>
    </GestureHandlerRootView>
  );
};

export default Game;
