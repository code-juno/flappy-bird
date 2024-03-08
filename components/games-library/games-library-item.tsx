import { StyleSheet, Text, TouchableOpacity, View, Image, ImageSourcePropType } from "react-native";
import React from "react";
import { Link } from "expo-router";

type GamesLibraryItemProps = {
  title: string;
  image: ImageSourcePropType;
  href: string;
};

const GamesLibraryItem: React.FC<GamesLibraryItemProps> = ({
  title,
  image,
  href,
}) => {
  return (
    <Link href={"(games)/flappy-bird"} asChild>
      <TouchableOpacity >
        <View style={styles.container}>
          <Image source={image} style={styles.image}/>
          <Text style={styles.text}>{title}</Text>
        </View>
      </TouchableOpacity>
    </Link>
  );
};

export default GamesLibraryItem;

const styles = StyleSheet.create({
  container: {
    padding: 10,
    margin: 10,
    borderRadius: 10,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  text: {
    textAlign: "center",
    marginVertical: 4,
  },
});
