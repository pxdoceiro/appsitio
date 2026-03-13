export interface CustomCharacter {
  id: string;
  displayName: string;
  description: string;
  characteristics: string;
  photoUri: string;
  createdAt: number;
  isCustom: true;
}

export const CUSTOM_CHARACTERS_KEY = "custom_characters";

export async function getCustomCharacters(): Promise<Record<string, CustomCharacter>> {
  try {
    const AsyncStorage = await import("@react-native-async-storage/async-storage").then(
      (m) => m.default
    );
    const data = await AsyncStorage.getItem(CUSTOM_CHARACTERS_KEY);
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.error("Erro ao carregar personagens customizados:", error);
    return {};
  }
}

export async function saveCustomCharacter(character: CustomCharacter): Promise<void> {
  try {
    const AsyncStorage = await import("@react-native-async-storage/async-storage").then(
      (m) => m.default
    );
    const characters = await getCustomCharacters();
    characters[character.id] = character;
    await AsyncStorage.setItem(CUSTOM_CHARACTERS_KEY, JSON.stringify(characters));
  } catch (error) {
    console.error("Erro ao salvar personagem customizado:", error);
    throw error;
  }
}

export async function deleteCustomCharacter(characterId: string): Promise<void> {
  try {
    const AsyncStorage = await import("@react-native-async-storage/async-storage").then(
      (m) => m.default
    );
    const characters = await getCustomCharacters();
    delete characters[characterId];
    await AsyncStorage.setItem(CUSTOM_CHARACTERS_KEY, JSON.stringify(characters));
  } catch (error) {
    console.error("Erro ao deletar personagem customizado:", error);
    throw error;
  }
}
