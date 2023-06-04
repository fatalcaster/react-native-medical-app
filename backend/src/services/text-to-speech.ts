import textToSpeech from "@google-cloud/text-to-speech";
import { synthesiziePayload } from "../config/synthesize.config";

import dotenv from "dotenv";

dotenv.config();

// Creates a client
const client = new textToSpeech.TextToSpeechClient();
async function readText(text: string) {
  // Construct the request
  const request = synthesiziePayload(text);

  // Performs the text-to-speech request
  const [response] = await client.synthesizeSpeech(request);

  if (!response.audioContent) {
    throw Error("Something went wrong");
  }
  return response.audioContent;
}

export default readText;
