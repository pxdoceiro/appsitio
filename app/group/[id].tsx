import { useLocalSearchParams, useRouter } from "expo-router";
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
} from "react-native";
import { useEffect, useRef, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ScreenContainer } from "@/components/screen-container";
import { TypingIndicator } from "@/components/typing-indicator";
import { useGroupChat, type GroupMessage } from "@/hooks/use-group-chat";
import { useGroupResponse } from "@/hooks/use-group-response";
import { CHARACTERS } from "@/lib/characters";
import { CHARACTER_IMAGES } from "@/lib/character-images";

interface Group {
  id: string;
  name: string;
  characterIds: string[];
  createdAt: number;
}

export default function GroupChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [inputText, setInputText] = useState("");
  const [group, setGroup] = useState<Group | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);

  const { messages, isTyping, setIsTyping, addMessage, loadMessages } = useGroupChat(id || "");
  const { getGroupResponse, isLoading } = useGroupResponse(group?.characterIds || [], {
    onResponse: async (characterId, characterName, text) => {
      await addMessage(text, characterId, characterName, false);
    },
    onError: (error) => {
      console.error("Erro:", error);
      setIsTyping(false);
    },
  });

  // Carregar grupo
  useEffect(() => {
    const loadGroup = async () => {
      try {
        const groups = await AsyncStorage.getItem("groups");
        if (groups) {
          const groupsList: Group[] = JSON.parse(groups);
          const foundGroup = groupsList.find((g) => g.id === id);
          setGroup(foundGroup || null);
        }
      } catch (error) {
        console.error("Erro ao carregar grupo:", error);
      }
    };

    loadGroup();
  }, [id]);

  // Carregar mensagens
  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  if (!group) {
    return (
      <ScreenContainer className="items-center justify-center">
        <Text className="text-foreground">Grupo não encontrado</Text>
      </ScreenContainer>
    );
  }

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage = inputText.trim();
    setInputText("");

    // Adicionar mensagem do usuário
    await addMessage(userMessage, "user", "Você", true);
    setIsTyping(true);

    const conversationHistory = messages.map((msg) => ({
      role: msg.isUser ? ("user" as const) : ("assistant" as const),
      content: msg.text,
    }));

    await getGroupResponse(userMessage, conversationHistory);
    setIsTyping(false);
  };

  const groupCharacterNames = group.characterIds
    .map((id) => CHARACTERS[id]?.displayName)
    .join(", ");

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
        {/* Header */}
        <View className="bg-surface border-b border-border px-4 py-3 flex-row items-center justify-between gap-3">
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}
          >
            <Text className="text-primary text-lg font-semibold">← Voltar</Text>
          </Pressable>
          <View className="flex-1 items-center">
            <Text className="text-sm font-bold text-foreground text-center">
              {group.name}
            </Text>
            <Text className="text-xs text-muted text-center">
              {group.characterIds.length} personagem{group.characterIds.length > 1 ? "s" : ""}
            </Text>
          </View>
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
                Comece uma conversa com {groupCharacterNames}!
              </Text>
            </View>
          ) : (
            <View>
              {messages.map((message) => (
                <View
                  key={message.id}
                  className={`mb-3 flex-row ${message.isUser ? "justify-end" : "justify-start"}`}
                >
                  {!message.isUser && (
                    <Image
                      source={
                        typeof CHARACTER_IMAGES[message.characterId] === "string"
                          ? { uri: CHARACTER_IMAGES[message.characterId] }
                          : CHARACTER_IMAGES[message.characterId]
                      }
                      className="w-8 h-8 rounded-full mr-2 mt-1"
                    />
                  )}
                  <View
                    className={`max-w-xs rounded-lg px-3 py-2 ${
                      message.isUser ? "bg-primary" : "bg-surface border border-border"
                    }`}
                  >
                    {!message.isUser && (
                      <Text className="text-xs font-bold text-primary mb-1">
                        {message.characterName}
                      </Text>
                    )}
                    <Text
                      className={`text-sm ${
                        message.isUser ? "text-background" : "text-foreground"
                      }`}
                    >
                      {message.text}
                    </Text>
                  </View>
                </View>
              ))}

              {isTyping && <TypingIndicator />}
            </View>
          )}
        </ScrollView>

        {/* Input Area */}
        <View className="border-t border-border bg-surface px-4 py-3 gap-2">
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
    </KeyboardAvoidingView>
  );
}
