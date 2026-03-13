import { useRouter } from "expo-router";
import {
  View,
  Text,
  Pressable,
  TextInput,
  ScrollView,
  Image,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { useState, useEffect } from "react";
import * as ImagePicker from "expo-image-picker";

import { ScreenContainer } from "@/components/screen-container";
import { saveCustomCharacter } from "@/lib/custom-characters";

export default function AddCharacterScreen() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [characteristics, setCharacteristics] = useState("");
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Request image picker permissions on mount
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permissão necessária",
          "Precisamos de acesso à sua galeria para selecionar fotos"
        );
      }
    })();
  }, []);

  const handlePickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setPhotoUri(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Erro ao selecionar imagem:", error);
      Alert.alert("Erro", "Erro ao selecionar imagem. Tente novamente.");
    }
  };

  const handleCreateCharacter = async () => {
    if (!name.trim()) {
      Alert.alert("Erro", "Por favor, preencha o nome do personagem");
      return;
    }
    if (!description.trim()) {
      Alert.alert("Erro", "Por favor, preencha a descrição");
      return;
    }
    if (!characteristics.trim()) {
      Alert.alert("Erro", "Por favor, preencha as características");
      return;
    }
    if (!photoUri) {
      Alert.alert("Erro", "Por favor, selecione uma foto");
      return;
    }

    try {
      setIsLoading(true);

      const customCharacter = {
        id: `custom_${Date.now()}`,
        displayName: name.trim(),
        description: description.trim(),
        characteristics: characteristics.trim(),
        photoUri,
        createdAt: Date.now(),
        isCustom: true as const,
      };

      await saveCustomCharacter(customCharacter);

      Alert.alert("Sucesso", "Personagem criado com sucesso!", [
        {
          text: "OK",
          onPress: () => {
            router.back();
          },
        },
      ]);
    } catch (error) {
      console.error("Erro ao criar personagem:", error);
      Alert.alert("Erro", "Erro ao criar personagem. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-background"
    >
      <ScreenContainer edges={["top", "left", "right"]} className="flex-1 p-0">
        {/* Header */}
        <View className="bg-surface border-b border-border px-4 py-3 flex-row items-center justify-between">
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}
          >
            <Text className="text-primary text-lg font-semibold">← Voltar</Text>
          </Pressable>
          <Text className="text-lg font-bold text-foreground">Novo Personagem</Text>
          <View className="w-12" />
        </View>

        {/* Content */}
        <ScrollView className="flex-1 px-4 py-4" contentContainerStyle={{ gap: 16, paddingBottom: 20 }}>
          {/* Foto */}
          <View className="gap-2">
            <Text className="text-sm font-semibold text-foreground">Foto do Personagem</Text>
            <Pressable
              onPress={handlePickImage}
              disabled={isLoading}
              style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}
              className="bg-surface border-2 border-dashed border-border rounded-lg p-4 items-center justify-center min-h-[200px]"
            >
              {photoUri ? (
                <Image source={{ uri: photoUri }} className="w-32 h-32 rounded-lg" />
              ) : (
                <View className="items-center gap-2">
                  <Text className="text-3xl">📸</Text>
                  <Text className="text-foreground font-semibold">Selecionar Foto</Text>
                  <Text className="text-xs text-muted">Toque para escolher uma imagem</Text>
                </View>
              )}
            </Pressable>
          </View>

          {/* Nome */}
          <View className="gap-2">
            <Text className="text-sm font-semibold text-foreground">Nome</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Ex: Tia Nastácia"
              placeholderTextColor="#999"
              editable={!isLoading}
              className="bg-background border border-border rounded-lg px-4 py-3 text-foreground"
            />
          </View>

          {/* Descrição */}
          <View className="gap-2">
            <Text className="text-sm font-semibold text-foreground">Descrição</Text>
            <TextInput
              value={description}
              onChangeText={setDescription}
              placeholder="Ex: Cozinheira do Sítio"
              placeholderTextColor="#999"
              editable={!isLoading}
              className="bg-background border border-border rounded-lg px-4 py-3 text-foreground"
            />
          </View>

          {/* Características */}
          <View className="gap-2">
            <Text className="text-sm font-semibold text-foreground">Características</Text>
            <Text className="text-xs text-muted">
              Descreva a personalidade e características para o chat gerar respostas adequadas
            </Text>
            <TextInput
              value={characteristics}
              onChangeText={setCharacteristics}
              placeholder="Ex: Amigável, cozinheira experiente, adora contar histórias, fala com sotaque caipira..."
              placeholderTextColor="#999"
              multiline
              numberOfLines={4}
              editable={!isLoading}
              className="bg-background border border-border rounded-lg px-4 py-3 text-foreground"
              textAlignVertical="top"
            />
          </View>

          {/* Botão Criar */}
          <Pressable
            onPress={handleCreateCharacter}
            disabled={isLoading || !name.trim() || !description.trim() || !characteristics.trim() || !photoUri}
            style={({ pressed }) => [
              { opacity: pressed && !isLoading ? 0.7 : 1 },
            ]}
            className="bg-primary p-4 rounded-full items-center justify-center mt-4"
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-lg font-bold text-background">Criar Personagem</Text>
            )}
          </Pressable>
        </ScrollView>
      </ScreenContainer>
    </KeyboardAvoidingView>
  );
}
