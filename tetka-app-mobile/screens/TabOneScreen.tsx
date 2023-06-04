import { Text, View } from "../components/Themed";
import { RootTabScreenProps } from "../types";
import Post, { PostProps } from "../components/Post";
import React, { useEffect, useState } from "react";
import { FlatList, ListRenderItem, Animated } from "react-native";
import axios from "axios";
import URLs from "../constants/Urls";
import Spinner from "../components/Spinner";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen({
  navigation,
}: RootTabScreenProps<"HomeTab">) {
  const [articles, setArticles] = useState<PostProps[]>([]);
  const getPosts = async () => {
    try {
      const response = await axios.get(URLs.getArticles);
      if (response.status === 200) {
        setArticles(response.data);
      }
    } catch (err) {
      console.error("Something went wrong - couldn't get");
    }

    // throw new Error(err)
    // return ;
  };

  useEffect(() => {
    getPosts();
  }, []);

  const renderPost: ListRenderItem<PostProps> = ({ item }) => (
    <Post
      onClick={() => navigation.navigate("Article", { articleId: item.id })}
      {...item}
    />
  );
  if (!articles.length) {
    return <Spinner />;
  }

  return (
    <SafeAreaView style={{ marginTop: "10%" }}>
      <View lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <FlatList<PostProps>
        data={articles}
        renderItem={renderPost}
        keyExtractor={(post) => post.id}
        className=" bg-gray-100  h-full p-[5%] mb-[5%]"
      />
      <Text>Test One</Text>
    </SafeAreaView>
  );
}
