import * as WebBrowser from "expo-web-browser";
import { Text, View } from "./Themed";

function handleHelpPress() {
  WebBrowser.openBrowserAsync(
    "https://docs.expo.io/get-started/create-a-new-app/#opening-the-app-on-your-phonetablet"
  );
}
