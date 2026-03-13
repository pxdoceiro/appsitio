import { Pressable, Text, View } from "react-native";
import { Image } from "expo-image";

import { CHARACTER_IMAGES } from "@/lib/character-images";
import type { Character } from "@/lib/characters";

interface CharacterCardProps {
  character: Character;
  onPress: () => void;
}

const TEAM_LABELS: Record<Character["team"], string> = {
  sitio: "Sitio",
  perepe: "Perere",
  sitio2: "Sitio 2",
  arraial: "Arraial",
  personalizados: "Personalizados",
  praca: "Praca",
};

export function CharacterCard({ character, onPress }: CharacterCardProps) {
  const accentSoft = `${character.color}22`;
  const accentBorder = `${character.color}55`;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        {
          opacity: pressed ? 0.96 : 1,
          transform: [{ scale: pressed ? 0.985 : 1 }, { translateY: pressed ? 1 : 0 }],
        },
      ]}
      className="mb-4"
    >
      <View
        className="overflow-hidden rounded-3xl border bg-surface p-4"
        style={{
          borderColor: accentBorder,
          shadowColor: "#000000",
          shadowOpacity: 0.14,
          shadowRadius: 18,
          shadowOffset: { width: 0, height: 10 },
          elevation: 4,
        }}
      >
        <View
          className="mb-4 overflow-hidden rounded-[26px] border"
          style={{ borderColor: accentBorder, backgroundColor: accentSoft }}
        >
          <View className="flex-row items-center justify-between px-4 pb-1 pt-4">
            <View
              className="rounded-full border px-3 py-1"
              style={{ borderColor: accentBorder, backgroundColor: "rgba(255,255,255,0.65)" }}
            >
              <Text className="text-[11px] font-semibold uppercase tracking-[1.5px] text-background">
                {TEAM_LABELS[character.team]}
              </Text>
            </View>
            <Text className="text-xs font-medium text-foreground/70">IA personagem</Text>
          </View>

          <View className="items-center justify-center px-4 pb-4 pt-2">
            <Image
              source={CHARACTER_IMAGES[character.id as keyof typeof CHARACTER_IMAGES]}
              className="h-52 w-full"
              contentFit="contain"
              contentPosition="center"
              transition={150}
            />
          </View>
        </View>

        <View className="gap-3">
          <View className="gap-2">
            <Text className="text-[22px] font-bold leading-tight text-foreground" numberOfLines={2}>
              {character.displayName}
            </Text>
            <Text className="text-sm leading-6 text-muted" numberOfLines={2}>
              {character.description}
            </Text>
          </View>

          <View className="rounded-2xl border border-border/60 bg-background/20 px-3 py-3">
            <Text className="text-[11px] font-semibold uppercase tracking-[1.2px] text-primary">
              Estilo da conversa
            </Text>
            <Text className="mt-1 text-sm italic leading-5 text-foreground/80" numberOfLines={2}>
              {character.personality}
            </Text>
          </View>
        </View>

        <Pressable
          onPress={onPress}
          style={({ pressed }) => [{ opacity: pressed ? 0.9 : 1 }]}
          className="mt-4 flex-row items-center justify-center rounded-2xl bg-primary px-4 py-3"
        >
          <Text className="text-sm font-bold text-background">Iniciar conversa</Text>
        </Pressable>
      </View>
    </Pressable>
  );
}
