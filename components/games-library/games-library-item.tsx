import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";

type GamesLibraryItemProps = {
  title: string;
  image: string;
  onPress: () => void;
};

const GamesLibraryItem: React.FC<GamesLibraryItemProps> = ({title, image, onPress}) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View>
        <Text>{image}</Text>
        <Text>{title}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default GamesLibraryItem;

const styles = StyleSheet.create({});
