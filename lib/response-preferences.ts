import AsyncStorage from "@react-native-async-storage/async-storage";

export type ResponseStyle = "curtas" | "medias";

const RESPONSE_STYLE_KEY = "response_style";

export async function getResponseStyle(): Promise<ResponseStyle> {
  const stored = await AsyncStorage.getItem(RESPONSE_STYLE_KEY);
  if (stored === "curtas" || stored === "medias") return stored;
  return "curtas";
}

export async function setResponseStyle(style: ResponseStyle): Promise<void> {
  await AsyncStorage.setItem(RESPONSE_STYLE_KEY, style);
}
