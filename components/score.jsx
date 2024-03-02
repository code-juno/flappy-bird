import React from "react";
import { View, Text, Image } from "react-native";

const Score = ({ score }) => {
  const digitImages = [
    require("../assets/sprites/0.png"),
    require("../assets/sprites/1.png"),
    require("../assets/sprites/2.png"),
    require("../assets/sprites/3.png"),
    require("../assets/sprites/4.png"),
    require("../assets/sprites/5.png"),
    require("../assets/sprites/6.png"),
    require("../assets/sprites/7.png"),
    require("../assets/sprites/8.png"),
    require("../assets/sprites/9.png"),
  ];

  return (
    <View
      style={{
        position: "absolute",
        top: 100,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: "flex-start",
        alignItems: "center",
        zIndex: 10,
      }}
    >
      <View style={{ flexDirection: "row" }}>
        {score
          .toString()
          .split("")
          .map((digit, index) => (
            <Image
              key={index}
              source={digitImages[parseInt(digit)]}
            />
          ))}
      </View>
    </View>
  );
};

export default Score;
