import { useRouter } from "expo-router";
import { View, Text, Pressable, TextInput } from "react-native";
import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { ScreenContainer } from "@/components/screen-container";
import { GroupCharacterSelector } from "@/components/group-character-selector";

export default function CreateGroupScreen() {
  const router = useRouter();
  const [groupName, setGroupName] = useState("");
  const [selectedCharacterIds, setSelectedCharacterIds] = useState<string[]>([]);

  const handleCreateGroup = async () => {
    if (!groupName.trim() || selectedCharacterIds.length === 0) {
      alert("Por favor, preencha o nome e selecione pelo menos 1 personagem");
      return;
    }

    try {
      const groupId = Date.now().toString();
      const group = {
        id: groupId,
        name: groupName,
        characterIds: selectedCharacterIds,
        createdAt: Date.now(),
      };

      // Salvar grupo
      const groups = await AsyncStorage.getItem("groups");
      const groupsList = groups ? JSON.parse(groups) : [];
      groupsList.push(group);
      await AsyncStorage.setItem("groups", JSON.stringify(groupsList));

      // Navegar para o chat do grupo
      router.push(`/group/${groupId}`);
    } catch (error) {
      console.error("Erro ao criar grupo:", error);
      alert("Erro ao criar grupo");
    }
  };

  return (
    <ScreenContainer className="flex-1 p-0" containerClassName="flex-1">
      {/* Header */}
      <View className="bg-surface border-b border-border px-4 py-3 flex-row items-center justify-between">
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}
        >
          <Text className="text-primary text-lg font-semibold">← Voltar</Text>
        </Pressable>
        <Text className="text-lg font-bold text-foreground">Criar Grupo</Text>
        <View className="w-12" />
      </View>

      {/* Content */}
      <View className="flex-1 px-4 py-4 gap-4">
        {/* Nome do Grupo */}
        <View className="gap-2">
          <Text className="text-sm font-semibold text-foreground">Nome do Grupo</Text>
          <TextInput
            value={groupName}
            onChangeText={setGroupName}
            placeholder="Ex: Aventura no Sítio"
            placeholderTextColor="#999"
            className="bg-background border border-border rounded-lg px-4 py-3 text-foreground"
          />
        </View>

        {/* Seletor de Personagens */}
        <View className="flex-1">
          <GroupCharacterSelector
            selectedIds={selectedCharacterIds}
            onSelectionChange={setSelectedCharacterIds}
            maxCharacters={5}
          />
        </View>

        {/* Botão Criar */}
        <Pressable
          onPress={handleCreateGroup}
          disabled={!groupName.trim() || selectedCharacterIds.length === 0}
          style={({ pressed }) => [
            { opacity: pressed ? 0.7 : 1 },
          ]}
          className="bg-primary p-4 rounded-full items-center justify-center"
        >
          <Text className="text-lg font-bold text-background">
            Criar Grupo ({selectedCharacterIds.length}/5)
          </Text>
        </Pressable>
      </View>
    </ScreenContainer>
  );
}
