import { StyleSheet, TouchableOpacity } from "react-native";

import { Text, View } from "../components/Themed";
import { RootStackScreenProps } from "../types";

export default function NotFoundScreen({
  navigation,
}: RootStackScreenProps<"NotFound">) {
  return (
    <View>
      <Text>This screen doesn't exist.</Text>
      <TouchableOpacity onPress={() => navigation.replace("Root")}>
        <Text className="text-red-500">Go to home screen!</Text>
      </TouchableOpacity>
    </View>
  );
}
