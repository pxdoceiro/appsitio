import { useLocalSearchParams, useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Image,
  Modal,
} from "react-native";
import { useEffect, useRef, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ScreenContainer } from "@/components/screen-container";
import { MessageBubble } from "@/components/message-bubble";
import { TypingIndicator } from "@/components/typing-indicator";
import { VoiceRecorderButton } from "@/components/voice-recorder-button";
import { AudioInput } from "@/components/audio-input";
import { useChat } from "@/hooks/use-chat";
import { useCharacterResponse } from "@/hooks/use-character-response";
import { CHARACTERS } from "@/lib/characters";
import { CHARACTER_IMAGES } from "@/lib/character-images";
import { getCustomCharacters, type CustomCharacter } from "@/lib/custom-characters";

export default function ChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [inputText, setInputText] = useState("");
  const [showVoiceRecorder, setShowVoiceRecorder] = useState(false);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [customPhotoUri, setCustomPhotoUri] = useState<string | null>(null);
  const [useCustomPhoto, setUseCustomPhoto] = useState(false);
  const [showAudioInput, setShowAudioInput] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const [character, setCharacter] = useState<any>(null);

  useEffect(() => {
    const loadCharacter = async () => {
      if (!id) return;

      // Tentar carregar personagem padrão
      if (CHARACTERS[id]) {
        setCharacter(CHARACTERS[id]);
        return;
      }

      // Tentar carregar personagem customizado
      const customChars = await getCustomCharacters();
      if (customChars[id]) {
        setCharacter(customChars[id]);
      }
    };

    loadCharacter();
  }, [id]);
  const { messages, addMessage, isTyping, setIsTyping } = useChat(id || "");
  const { getResponse, isLoading } = useCharacterResponse(character!, {
    onResponse: async (text) => {
      await addMessage(text, false);
      setIsTyping(false);
    },
    onError: (error) => {
      console.error("Erro:", error);
      setIsTyping(false);
    },
  });

  if (!character) {
    return (
      <ScreenContainer className="items-center justify-center">
        <Text className="text-foreground">Personagem não encontrado</Text>
      </ScreenContainer>
    );
  }

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage = inputText.trim();
    setInputText("");

    await addMessage(userMessage, true);
    setIsTyping(true);

    const conversationHistory: Array<{ role: "user" | "assistant"; content: string }> = messages.map((msg) => ({
      role: msg.isUser ? "user" : "assistant",
      content: msg.text,
    }));

    await getResponse(userMessage, conversationHistory);
  };

  const handleVoiceRecordingComplete = async (uri: string) => {
    setShowVoiceRecorder(false);
    console.log("Áudio gravado:", uri);
  };

  const handleAudioTranscript = async (transcript: string) => {
    setInputText(transcript);
    setShowAudioInput(false);
  };

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setCustomPhotoUri(result.assets[0].uri);
      setUseCustomPhoto(true);
      setShowPhotoModal(false);
    }
  };

  const currentPhotoUrl = useCustomPhoto && customPhotoUri ? customPhotoUri : CHARACTER_IMAGES[character.id];
  const currentPhotoSource =
    typeof currentPhotoUrl === "string" ? { uri: currentPhotoUrl } : currentPhotoUrl;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-background"
      keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
    >
      <ScreenContainer
        edges={["top", "left", "right"]}
        className="flex-1 p-0"
        containerClassName="flex-1"
      >
        {/* Header com Foto de Perfil */}
        <View className="bg-surface border-b border-border px-4 py-3 flex-row items-center justify-between gap-3">
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}
          >
            <Text className="text-primary text-lg font-semibold">← Voltar</Text>
          </Pressable>
          <Pressable
            onPress={() => setShowPhotoModal(true)}
            className="flex-1 items-center"
            style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
          >
            <Image
              source={currentPhotoSource}
              className="w-12 h-12 rounded-full mb-1 border-2 border-primary"
            />
            <Text className="text-sm font-bold text-foreground text-center">
              {character.displayName}
            </Text>
            <Text className="text-xs text-muted">Toque para mudar</Text>
          </Pressable>
          <View className="w-12" />
        </View>

        {/* Messages Area */}
        <ScrollView
          ref={scrollViewRef}
          className="flex-1 px-4 py-4"
          contentContainerStyle={{ flexGrow: 1 }}
          onContentSizeChange={() =>
            scrollViewRef.current?.scrollToEnd({ animated: true })
          }
        >
          {messages.length === 0 && !isTyping ? (
            <View className="flex-1 items-center justify-center">
              <Text className="text-muted text-center text-base">
                Comece uma conversa com {character.displayName}!
              </Text>
            </View>
          ) : (
            <View>
              {messages.map((message) => (
                <MessageBubble
                  key={message.id}
                  text={message.text}
                  isUser={message.isUser}
                  timestamp={message.timestamp}
                  characterImage={!message.isUser ? currentPhotoUrl : undefined}
                />
              ))}

              {isTyping && <TypingIndicator />}
            </View>
          )}
        </ScrollView>

        {/* Input Area */}
        <View className="border-t border-border bg-surface px-4 py-3 gap-3">
          {/* Voice Call Button */}
          <Pressable
            style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
            className="bg-primary p-3 rounded-full items-center justify-center"
          >
            <Text className="text-lg font-semibold text-background">📞 Ligar por Voz</Text>
          </Pressable>
          {showAudioInput && (
            <View className="items-center py-2">
              <AudioInput onTranscript={handleAudioTranscript} />
            </View>
          )}
          <View className="flex-row gap-2 items-center">
            <TextInput
              value={inputText}
              onChangeText={setInputText}
              placeholder="Digite sua mensagem..."
              placeholderTextColor="#999"
              className="flex-1 bg-background border border-border rounded-full px-4 py-3 text-foreground"
              returnKeyType="done"
              onSubmitEditing={handleSendMessage}
            />
            <Pressable
              onPress={() => setShowAudioInput(!showAudioInput)}
              style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
              className="bg-primary/70 p-3 rounded-full items-center justify-center"
            >
              <Text className="text-lg">🎤</Text>
            </Pressable>
            <Pressable
              onPress={handleSendMessage}
              disabled={!inputText.trim() || isLoading}
              style={({ pressed }) => [
                { opacity: pressed && inputText.trim() ? 0.7 : 1 },
              ]}
              className="bg-primary p-3 rounded-full items-center justify-center"
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text className="text-lg">➤</Text>
              )}
            </Pressable>
          </View>
        </View>
      </ScreenContainer>

      {/* Modal de Seleção de Foto */}
      <Modal
        visible={showPhotoModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowPhotoModal(false)}
      >
        <View className="flex-1 bg-black/50 items-center justify-center">
          <View className="bg-surface rounded-2xl p-6 w-4/5 max-w-sm">
            <Text className="text-lg font-bold text-foreground mb-4">
              Foto de {character.displayName}
            </Text>

            {/* Preview da foto atual */}
            <View className="items-center mb-6">
                <Image
                  source={currentPhotoSource}
                  className="w-32 h-32 rounded-lg border-2 border-primary"
                />
              <Text className="text-sm text-muted mt-2">
                {useCustomPhoto ? "Foto personalizada" : "Foto do sistema"}
              </Text>
            </View>

            {/* Botão para usar foto do sistema */}
            <Pressable
              onPress={() => {
                setUseCustomPhoto(false);
                setShowPhotoModal(false);
              }}
              className={`p-3 rounded-lg border-2 mb-3 ${
                !useCustomPhoto ? "bg-primary/10 border-primary" : "border-border"
              }`}
              style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
            >
              <Text className="text-center text-foreground font-semibold">
                📸 Usar Foto do Sistema
              </Text>
            </Pressable>

            {/* Botão para fazer upload */}
            <Pressable
              onPress={handlePickImage}
              className={`p-3 rounded-lg border-2 mb-3 ${
                useCustomPhoto ? "bg-primary/10 border-primary" : "border-border"
              }`}
              style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
            >
              <Text className="text-center text-foreground font-semibold">
                📁 Fazer Upload de Foto
              </Text>
            </Pressable>

            {/* Botão fechar */}
            <Pressable
              onPress={() => setShowPhotoModal(false)}
              className="bg-primary p-3 rounded-full items-center justify-center"
              style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
            >
              <Text className="text-background font-semibold">Fechar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}
