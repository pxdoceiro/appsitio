import { useState, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface GroupMessage {
  id: string;
  text: string;
  characterId: string;
  characterName: string;
  isUser: boolean;
  timestamp: number;
}

export interface Group {
  id: string;
  name: string;
  characterIds: string[];
  createdAt: number;
}

export function useGroupChat(groupId: string) {
  const [messages, setMessages] = useState<GroupMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  // Carregar histórico de mensagens do grupo
  const loadMessages = useCallback(async () => {
    try {
      const stored = await AsyncStorage.getItem(`group_messages_${groupId}`);
      if (stored) {
        setMessages(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Erro ao carregar mensagens:", error);
    }
  }, [groupId]);

  // Adicionar mensagem ao grupo
  const addMessage = useCallback(
    async (text: string, characterId: string, characterName: string, isUser: boolean = false) => {
      const newMessage: GroupMessage = {
        id: Date.now().toString(),
        text,
        characterId,
        characterName,
        isUser,
        timestamp: Date.now(),
      };

      const updatedMessages = [...messages, newMessage];
      setMessages(updatedMessages);

      try {
        await AsyncStorage.setItem(`group_messages_${groupId}`, JSON.stringify(updatedMessages));
      } catch (error) {
        console.error("Erro ao salvar mensagem:", error);
      }

      return newMessage;
    },
    [messages, groupId]
  );

  // Limpar histórico do grupo
  const clearMessages = useCallback(async () => {
    try {
      await AsyncStorage.removeItem(`group_messages_${groupId}`);
      setMessages([]);
    } catch (error) {
      console.error("Erro ao limpar mensagens:", error);
    }
  }, [groupId]);

  return {
    messages,
    isTyping,
    setIsTyping,
    addMessage,
    loadMessages,
    clearMessages,
  };
}
