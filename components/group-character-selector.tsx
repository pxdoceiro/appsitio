import { View, Text, Pressable, ScrollView, Image } from "react-native";
import { useState } from "react";
import { CHARACTERS } from "@/lib/characters";
import { CHARACTER_IMAGES } from "@/lib/character-images";
import { cn } from "@/lib/utils";

interface GroupCharacterSelectorProps {
  selectedIds: string[];
  onSelectionChange: (ids: string[]) => void;
  maxCharacters?: number;
}

export function GroupCharacterSelector({
  selectedIds,
  onSelectionChange,
  maxCharacters = 5,
}: GroupCharacterSelectorProps) {
  const handleToggleCharacter = (characterId: string) => {
    if (selectedIds.includes(characterId)) {
      // Remover personagem
      onSelectionChange(selectedIds.filter((id) => id !== characterId));
    } else if (selectedIds.length < maxCharacters) {
      // Adicionar personagem
      onSelectionChange([...selectedIds, characterId]);
    }
  };

  const characterEntries = Object.entries(CHARACTERS);

  return (
    <View className="flex-1 gap-4">
      <View className="px-4">
        <Text className="text-lg font-bold text-foreground mb-2">
          Selecione até {maxCharacters} personagens
        </Text>
        <Text className="text-sm text-muted">
          Selecionados: {selectedIds.length}/{maxCharacters}
        </Text>
      </View>

      <ScrollView className="flex-1 px-4" contentContainerStyle={{ gap: 12 }}>
        {characterEntries.map(([id, character]) => {
          const isSelected = selectedIds.includes(id);
          const isDisabled = !isSelected && selectedIds.length >= maxCharacters;

          return (
            <Pressable
              key={id}
              onPress={() => !isDisabled && handleToggleCharacter(id)}
              disabled={isDisabled}
              style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
              className={cn(
                "flex-row items-center gap-3 p-3 rounded-lg border-2",
                isSelected ? "bg-primary/10 border-primary" : "border-border",
                isDisabled && "opacity-50"
              )}
            >
              <Image
                source={
                  typeof CHARACTER_IMAGES[id] === "string"
                    ? { uri: CHARACTER_IMAGES[id] }
                    : CHARACTER_IMAGES[id]
                }
                className="w-12 h-12 rounded-full"
              />
              <View className="flex-1">
                <Text className="font-semibold text-foreground">
                  {character.displayName}
                </Text>
                <Text className="text-xs text-muted">{character.description}</Text>
              </View>
              {isSelected && (
                <View className="w-6 h-6 rounded-full bg-primary items-center justify-center">
                  <Text className="text-white text-sm font-bold">✓</Text>
                </View>
              )}
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}
