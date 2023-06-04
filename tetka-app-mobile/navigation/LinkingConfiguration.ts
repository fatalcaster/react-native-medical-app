/**
 * Learn more about deep linking with React Navigation
 * https://reactnavigation.org/docs/deep-linking
 * https://reactnavigation.org/docs/configuring-links
 */

import { LinkingOptions } from "@react-navigation/native";
import * as Linking from "expo-linking";

import { RootStackParamList } from "../types";

const linking: LinkingOptions<RootStackParamList> = {
  prefixes: [Linking.createURL("/")],
  config: {
    screens: {
      Root: {
        screens: {
          HomeTab: {
            screens: {
              TabOneScreen: "one",
            },
          },
          InfoTab: {
            screens: {
              TabTwoScreen: "two",
            },
          },
        },
      },
      Article: {},
      Contact: "contact",
      NotFound: "*",
    },
  },
};

export default linking;
