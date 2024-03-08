import { View, Text, FlatList } from "react-native";

const games = [
  {
    id: 1,
    title: "Flappy Bird",
    img: require("../../assets/game-icons/flappy-bird-icon.png")
  },
  // {
  //   id: 2,
  //   title: "2048",
  // },
  // {
  //   id: 3,
  //   title: "Tetris",
  // },
  // {
  //   id: 4,
  //   title: "Snake",
  // },
  // {
  //   id: 5,
  //   title: "Pong",
  // },
  // {
  //   id: 6,
  //   title: "Space Invaders",
  // },
  // {
  //   id: 7,
  //   title: "Asteroids",
  // },
  // {
  //   id: 8,
  //   title: "Breakout",
  // },
]

export default function LibraryScreen() {
  return (
    <View style={{ justifyContent: "center", alignItems: "center", flex: 1 }}>
      <FlatList 
        data={games}
        renderItem={({ item }) => <Text>{item.title}</Text>}
        keyExtractor={item => item.id.toString()}
      />
    </View>
  );
}
