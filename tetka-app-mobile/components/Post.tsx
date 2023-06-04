import React from "react";
import { Text, View, Image, TouchableOpacity } from "react-native";

export enum ArticleStatus {
  Published = "published",
  Unpublished = "unpublished",
}
export interface PostProps {
  id: string;
  bannerImg: string;
  title: string;
  summary?: string;
  createdAt: Date;
  updatedAt: Date;
  onClick?: () => void;
}

export default function Post({
  title,
  summary,
  bannerImg,
  onClick,
}: PostProps) {
  return (
    <TouchableOpacity onPress={onClick}>
      <View className="rounded flex flex-row bg-white h-[150px] mb-[5%] shadow-md">
        <Image className="h-[100%] w-[20%] " source={{ uri: bannerImg }} />
        <View className="flex flex-col m-[3%] h-[80%] w-[75%]">
          <Text className="text-lg font-bold">{title}</Text>
          <Text numberOfLines={4} className="">
            {summary}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
