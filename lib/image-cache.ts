import { Asset } from "expo-asset";
import { Image as ExpoImage } from "expo-image";
import { CHARACTER_IMAGES } from "@/lib/character-images";

export async function preloadCharacterImages(ids: string[]) {
  const localAssets: number[] = [];
  const remoteUrls: string[] = [];

  ids.forEach((id) => {
    const source = CHARACTER_IMAGES[id];
    if (!source) return;
    if (typeof source === "string") {
      remoteUrls.push(source);
      return;
    }
    localAssets.push(source);
  });

  const tasks: Array<Promise<unknown>> = [];
  if (localAssets.length > 0) {
    tasks.push(Asset.loadAsync(localAssets));
  }
  if (remoteUrls.length > 0) {
    tasks.push(ExpoImage.prefetch(remoteUrls));
  }

  if (tasks.length === 0) return;
  await Promise.all(tasks);
}
