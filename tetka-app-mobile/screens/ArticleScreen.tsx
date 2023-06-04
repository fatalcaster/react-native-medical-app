import React, {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import type {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from "@react-navigation/native-stack";
import { Audio, AVPlaybackStatus } from "expo-av";

import { Text, View } from "../components/Themed";
import { RootStackParamList } from "../types";
import { useFocusEffect } from "@react-navigation/native";
import { Pressable, Image, ScrollView } from "react-native";
import axios from "axios";
import URLs from "../constants/Urls";
import { FontAwesome } from "@expo/vector-icons";

type ArticleProps = NativeStackScreenProps<RootStackParamList, "Article">;

type ArticleType = {
  title: string;
  author: string;
  bannerImg: string;
  document: string;
  createdAt: string;
};

const getTheArticle = async (id: string) => {
  const response = await axios.get(URLs.getTheArticle(id));
  if (response.status === 200) {
    return response.data;
  }
  // console.log("RESPONSE", JSON.stringify(response.data));
  // const json
  // return JSON.parse(
  //   `{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Часовник или сат је инструмент за мерење времена. (Обично, за мерење времена у интервалима мањим од дана – у супротном volim teкалендар.) Сатови који се користе у техничке сврхе, или са изузетно великом прецизношћу се понекад називају хронометри. Сат у  својој најчешћој модерној форми (у употреби од 14. века) показује сате (часове), минуте, а понекад и секунде у периоду од 12 или 24 сата."}]},{"type":"image","attrs":{"src":"https://codedepo-article-bucket.s3.eu-central-1.amazonaws.com/6350f2c18037786725093ff1/0a3309d1-f23d-4110-a762-ef6e61020934?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIA5CIN2G6PKRUPJHPS%2F20221023%2Feu-central-1%2Fs3%2Faws4_request&X-Amz-Date=20221023T092142Z&X-Amz-Expires=3600&X-Amz-Signature=b7a38ade0135318ed0ec031cece9487055b65a5fedc55135bda9303e91aa4f21&X-Amz-SignedHeaders=host&x-id=GetObject","alt":null,"title":null}},{"type":"paragraph","content":[{"type":"text","text":"Часовник је један од најстаријих људских изума, који задовољава потребу мерења интервала времена краћих од природних јединица: дана, лунарног месеца, и године. Уређаји који раде на бази више физичких процеса се већ миленијумима користе. Сунчани часовник показује време путем приказивања позиције сенке на равној површини. Постоји читав низ временских мерила, добро познати пример је пешчани часовник. Водени часовници, заједно са сунчаним часовницима су вероватно најстарији инструменти за мерење времена. До знатног напретка је дошло са изумом отпуштања крунског точка, чиме је омогућен настанак првих механичких часовника око 1300. године у Европи, који су мерили време помоћу осцилујућих мерача времена као што су балансни точкови. Опружни сатови су се појавили током 15 века. Током 15. и 16. века, занат прављења сатова је цветао. До следећег напредка у тачности је дошло након 1656. године са изумом сата са клатном. Главни подстицај побољшању тачности и поузданости сатова био је значај прецизног вођења времена при навигацији. Електрични сат је био патентиран 1840. године. Развој електронике у 20. веку довео је до часовника без механичких делова.Часовник или сат је инструмент за мерење времена (Обично, за мерење времена у интервалима мањим од дана – у супротном календар.) Сатови који се користе у техничке сврхе, или са изузетно великом прецизношћу се понекад називају хронометри. Сат у својој најчешћој модерној форми (у употреби од 14. века) показује сате (часове), минуте, а понекад и секунде у периоду од 12 или 24 сата."}]},{"type":"image","attrs":{"src":"https://codedepo-article-bucket.s3.eu-central-1.amazonaws.com/6350f2c18037786725093ff1/1da2aed9-3afb-4c4e-ba10-48a7a856904d?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIA5CIN2G6PKRUPJHPS%2F20221023%2Feu-central-1%2Fs3%2Faws4_request&X-Amz-Date=20221023T092142Z&X-Amz-Expires=3600&X-Amz-Signature=5cc833d21b976e9673cd44f9926808b45e9bca12dc8033d4d4d6890d37b5c5d8&X-Amz-SignedHeaders=host&x-id=GetObject","alt":null,"title":null}},{"type":"heading","attrs":{"level":2},"content":[{"type":"text","text":"Историја"}]},{"type":"paragraph","content":[{"type":"text","text":"Часовник је један од најстаријих људских изума, који задовољава потребу мерења интервала времена краћих од природних јединица: дана, лунарног месеца, и године. Уређаји који раде на бази више физичких процеса се већ миленијумима користе. Сунчани часовник показује време путем приказивања позиције сенке на равној површини. Постоји читав низ временских мерила, добро познати пример је пешчани часовник. Водени часовници, заједно са сунчаним часовницима су вероватно најстарији инструменти за мерење времена. До знатног напретка је дошло са изумом отпуштања крунског точка, чиме је омогућен настанак првих механичких часовника око 1300. године у Европи, који су мерили време помоћу осцилујућих мерача времена као што су балансни точкови.Опружни сатови су се појавили током 15 века. Током 15. и 16. века, занат прављења сатова је цветао. До следећег напредка у тачности је дошло након 1656. године са изумом сата са клатном. Главни подстицај побољшању тачности и поузданости сатова био је значај прецизног вођења времена при навигацији. Електрични сат је био патентиран 1840. године. Развој електронике у 20. веку довео је до часовника без механичких делова. I sad se menja"}]}]}`
  // );
};

export default function ArticleScreen({ navigation, route }: ArticleProps) {
  const { articleId } = route.params;

  const [article, setArticle] = useState<ArticleType | null>(null);

  const parseDocument = (JSONDocument: string) => {
    const document = JSON.parse(JSONDocument);
    const parseHelper = function (content: any[]) {
      if (!content) return null;
      const obj = content.map(function (piece, index): ReactNode {
        switch (piece.type) {
          case "image":
            return (
              <Image
                resizeMode="center"
                className="block w-[100%] h-[200px] m-0 p-0"
                key={index}
                source={{ uri: piece.attrs.src }}
              />
            );
          case "paragraph":
            return (
              <Text className="text-xl mb-4" key={index}>
                {parseHelper(piece.content)}
              </Text>
            );
          case "heading":
            return (
              <Text key={index} className="text-3xl block font-bold mb-3 mt-12">
                {parseHelper(piece.content)?.map((c: any) => c)}
              </Text>
            );
          case "text":
            return piece.text;
        }
        return null;
      });
      return obj;
    };
    const parsedDocument = parseHelper(document.content);
    return parsedDocument;
  };

  if (!articleId) return <View>Ova stranica ne postoji</View>;

  useEffect(() => {
    const setTheArticle = async () => {
      const article = await getTheArticle(articleId);
      setArticle(article);
    };
    setTheArticle();
  }, []);
  const parsedArticle = useMemo(
    () => (article ? parseDocument(article?.document) : null),
    [article?.document]
  );

  if (article === null) return <Text>Loading</Text>;

  return (
    <>
      <View>
        <View lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
        <View className="relative">
          <Image
            className="h-[400px] w-[100%] "
            source={{
              uri: article.bannerImg,
            }}
          />
          <View className="w-[100%] h-[100%] absolute bg-black/[.20] " />
          <View className="absolute w-full bg-transparent bottom-0 flex flex-row justify-between">
            <Text className="text-3xl text-white m-5 font-bold">
              {article.title}
            </Text>
            <PlayButton
              size={30}
              classes={"max-h-[30px] self-end mb-4 mr-5"}
              id={articleId}
            />
          </View>
        </View>
        <ScrollView className="p-4">
          <View style={{ paddingBottom: "110%" }}>{parsedArticle}</View>
        </ScrollView>
      </View>
      <ContactButton
        classNames="absolute bottom-[5%] right-[10px]"
        navigation={navigation}
      />
    </>
  );
}
interface ContactButtonProps {
  classNames?: string;
  navigation: NativeStackNavigationProp<
    RootStackParamList,
    "Article",
    undefined
  >;
}
function ContactButton({ classNames, navigation }: ContactButtonProps) {
  return (
    <Pressable
      className={`bg-black rounded-full ${classNames}`}
      onPress={() => navigation.navigate("Contact")}
    >
      <FontAwesome
        // className="p-[10px]"
        style={{ padding: 15, width: 60, height: 60 }}
        name="envelope"
        color={"white"}
        size={30}
      />
    </Pressable>
  );
}

interface PlayButtonProps {
  id: string;
  classes?: string;
  size?: number;
}
function PlayButton({ id, classes, size }: PlayButtonProps) {
  const [audio, setAudio] = useState<Audio.Sound>();
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const getAudio = async () => {
    try {
      const response = await axios.get(URLs.getAudio(id));
      if (response.status === 200) {
        const { sound } = await Audio.Sound.createAsync({
          uri: response.data,
        });
        setAudio(() => sound);
        sound.playAsync();
        setIsPlaying(true);

        return true;
      }
    } catch (err) {
      console.error(err);
      return false;
    }
  };
  const togglePlay = async () => {
    if (!audio) await getAudio();
    if (!isPlaying && audio) {
      await audio.playAsync();
      setIsPlaying(true);
    } else if (audio) {
      await audio.pauseAsync();
      setIsPlaying(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      const unsubscribe = async () => {
        audio && (await audio.unloadAsync());
      };

      return () => unsubscribe();
    }, [audio])
  );

  return (
    <Pressable className={`${classes}`} onPress={() => togglePlay()}>
      <FontAwesome
        // className={}
        name={`${isPlaying ? "pause" : "play"}`}
        size={size || 30}
        color={"white"}
      />
    </Pressable>
  );
}
