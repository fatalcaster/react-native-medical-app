import { google } from "@google-cloud/text-to-speech/build/protos/protos";

function synthesiziePayload(
  text: string
): google.cloud.texttospeech.v1.ISynthesizeSpeechRequest {
  return {
    audioConfig: {
      audioEncoding: "MP3",
      pitch: 0,
      speakingRate: 1,
    },
    input: {
      text: text,
    },
    voice: {
      languageCode: "sr-RS",
      name: "sr-rs-Standard-A",
    },
  };
}
export { synthesiziePayload };
// https://texttospeech.googleapis.com/v1beta1/text:synthesize
