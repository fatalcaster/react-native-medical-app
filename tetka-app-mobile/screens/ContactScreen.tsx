import { StatusBar } from "expo-status-bar";
import React from "react";
import { Pressable, TextInput } from "react-native";

import { Text, View } from "../components/Themed";

export default function ContactScreen() {
  return (
    <View className="h-full bg-gray-100 flex flex-col items-center">
      <TextInput
        className="p-4 pl-6 text-xl bg-white border-b-4 border-gray-100 w-full"
        placeholder="Ime"
      />
      <TextInput
        className="p-4 pl-6 text-xl bg-white border-b-4 border-gray-100 w-full"
        placeholder="Email"
      />
      <TextInput
        className="p-4 pl-6 h-[70%] bg-white w-full"
        placeholder="Tekst..."
        style={{ textAlignVertical: "top" }}
        multiline={true}
      />
      <Pressable onPress={() => {}} className="mt-6  bg-lime-400 py-4 px-12">
        <Text className="font-bold text-lg">Posalji</Text>
      </Pressable>
    </View>
  );
}
