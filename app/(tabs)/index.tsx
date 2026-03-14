import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  FlatList,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
  useWindowDimensions,
  InteractionManager,
} from "react-native";

import { CharacterCard } from "@/components/character-card";
import { ScreenContainer } from "@/components/screen-container";
import {
  ARRAIAL_CHARACTERS,
  PEREPE_CHARACTERS,
  PERSONALIZADOS_CHARACTERS,
  PRACA_CHARACTERS,
  SITIO2_CHARACTERS,
  SITIO_CHARACTERS,
} from "@/lib/characters";
import { preloadCharacterImages } from "@/lib/image-cache";

type HomeTab = "sitio" | "perepe" | "sitio2" | "arraial" | "personalizados" | "praca";

const TAB_ITEMS: Array<{ key: HomeTab; label: string }> = [
  { key: "sitio", label: "Sitio" },
  { key: "perepe", label: "Perere" },
  { key: "sitio2", label: "Sitio 2" },
  { key: "arraial", label: "Arraial dos Tucanos" },
  { key: "personalizados", label: "Personalizados" },
  { key: "praca", label: "Praca" },
];

export default function HomeScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const [searchText, setSearchText] = useState("");
  const [activeTab, setActiveTab] = useState<HomeTab>("sitio");
  const [groupCount, setGroupCount] = useState(0);
  const lastPreloadKeyRef = useRef("");

  const loadData = useCallback(async () => {
    try {
      const groups = await AsyncStorage.getItem("groups");
      if (groups) {
        const groupsList = JSON.parse(groups);
        setGroupCount(groupsList.length);
      } else {
        setGroupCount(0);
      }
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData]),
  );

  const characters =
    activeTab === "sitio"
      ? SITIO_CHARACTERS
      : activeTab === "perepe"
        ? PEREPE_CHARACTERS
        : activeTab === "sitio2"
          ? SITIO2_CHARACTERS
          : activeTab === "arraial"
            ? ARRAIAL_CHARACTERS
          : activeTab === "personalizados"
            ? PERSONALIZADOS_CHARACTERS
            : PRACA_CHARACTERS;

  const filteredCharacters = characters.filter((character) =>
    character.displayName.toLowerCase().includes(searchText.toLowerCase().trim()),
  );

  const numColumns = width >= 1280 ? 3 : width >= 760 ? 2 : 1;

  useEffect(() => {
    const idsToPreload = filteredCharacters.slice(0, 12).map((character) => character.id);
    const preloadKey = `${activeTab}:${idsToPreload.join(",")}`;
    if (preloadKey === lastPreloadKeyRef.current) return;
    lastPreloadKeyRef.current = preloadKey;

    const task = InteractionManager.runAfterInteractions(() => {
      preloadCharacterImages(idsToPreload).catch(() => {});
    });

    return () => task.cancel();
  }, [activeTab, filteredCharacters]);

  return (
    <ScreenContainer className="flex-1 p-0" containerClassName="flex-1">
      <FlatList
        key={numColumns}
        data={filteredCharacters}
        keyExtractor={(item) => item.id}
        numColumns={numColumns}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16, paddingBottom: 28 }}
        columnWrapperStyle={numColumns > 1 ? { gap: 16 } : undefined}
        ListHeaderComponent={
          <View className="mb-6 gap-4">
            <View className="overflow-hidden rounded-[32px] border border-border/70 bg-surface px-5 py-5">
              <View className="flex-row items-start justify-between gap-3">
                <View className="flex-1 gap-2 pr-3">
                  <Text className="text-[12px] font-semibold uppercase tracking-[2px] text-primary">
                    Universo do Sitio
                  </Text>
                  <Text className="text-3xl font-bold leading-tight text-foreground">
                    Escolha quem vai entrar na conversa
                  </Text>
                  <Text className="text-sm leading-6 text-muted">
                    Visual mais limpo, busca mais direta e cards com a arte inteira aparecendo.
                  </Text>
                </View>

                <Pressable
                  onPress={() => router.push("/group/create")}
                  style={({ pressed }) => [{ opacity: pressed ? 0.72 : 1 }]}
                  className="self-start rounded-2xl bg-primary px-4 py-3"
                >
                  <Text className="text-sm font-bold text-background">+ Grupo</Text>
                </Pressable>
              </View>

              <View className="mt-4 flex-row flex-wrap gap-2">
                <View className="rounded-full border border-border/70 bg-background/30 px-3 py-2">
                  <Text className="text-xs font-medium text-foreground">
                    {filteredCharacters.length} personagens visiveis
                  </Text>
                </View>
                <View className="rounded-full border border-border/70 bg-background/30 px-3 py-2">
                  <Text className="text-xs font-medium text-foreground">{groupCount} grupos salvos</Text>
                </View>
              </View>

              <View className="mt-5 rounded-[24px] border border-border/70 bg-background/35 px-4 py-3">
                <Text className="mb-2 text-[11px] font-semibold uppercase tracking-[1.5px] text-primary">
                  Buscar personagem
                </Text>
                <View className="flex-row items-center gap-3">
                  <Text className="text-base text-foreground/70">Buscar</Text>
                  <TextInput
                    value={searchText}
                    onChangeText={setSearchText}
                    placeholder="Digite um nome"
                    placeholderTextColor="#B8CCB5"
                    className="flex-1 text-base text-foreground"
                  />
                </View>
              </View>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 10, paddingRight: 8 }}
            >
              {TAB_ITEMS.map((tab) => {
                const active = tab.key === activeTab;

                return (
                  <Pressable
                    key={tab.key}
                    onPress={() => setActiveTab(tab.key)}
                    style={({ pressed }) => [{ opacity: pressed ? 0.72 : 1 }]}
                    className={
                      active
                        ? "rounded-full border border-primary bg-primary px-4 py-3"
                        : "rounded-full border border-border/70 bg-surface px-4 py-3"
                    }
                  >
                    <Text
                      className={
                        active
                          ? "text-sm font-bold text-background"
                          : "text-sm font-semibold text-foreground"
                      }
                    >
                      {tab.label}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>

            <View className="flex-row items-center justify-between px-1">
              <Text className="text-lg font-bold text-foreground">Personagens em destaque</Text>
              <Text className="text-sm text-muted">Toque para abrir o chat</Text>
            </View>
          </View>
        }
        renderItem={({ item }) => (
          <View className={numColumns > 1 ? "flex-1" : undefined}>
            <CharacterCard character={item} onPress={() => router.push(`/chat/${item.id}`)} />
          </View>
        )}
        ListEmptyComponent={
          <View className="items-center justify-center rounded-3xl border border-border/70 bg-surface px-6 py-12">
            <Text className="text-lg font-bold text-foreground">Nada encontrado</Text>
            <Text className="mt-2 text-center text-sm leading-6 text-muted">
              Tente outro nome ou troque a categoria acima.
            </Text>
          </View>
        }
      />
    </ScreenContainer>
  );
}


