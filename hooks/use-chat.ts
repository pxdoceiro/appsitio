import { useState, useCallback, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const CHAT_STORAGE_KEY = "sitio_chat_";

export function useChat(characterId: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  // Carregar histórico de chat ao montar
  useEffect(() => {
    loadChatHistory();
  }, [characterId]);

  const loadChatHistory = useCallback(async () => {
    try {
      const storageKey = `${CHAT_STORAGE_KEY}${characterId}`;
      const saved = await AsyncStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Converter timestamps de volta para Date
        const messagesWithDates = parsed.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        }));
        setMessages(messagesWithDates);
      }
    } catch (error) {
      console.error("Erro ao carregar histórico:", error);
    }
  }, [characterId]);

  const saveChatHistory = useCallback(
    async (updatedMessages: Message[]) => {
      try {
        const storageKey = `${CHAT_STORAGE_KEY}${characterId}`;
        await AsyncStorage.setItem(storageKey, JSON.stringify(updatedMessages));
      } catch (error) {
        console.error("Erro ao salvar histórico:", error);
      }
    },
    [characterId]
  );

  const addMessage = useCallback(
    async (text: string, isUser: boolean) => {
      const newMessage: Message = {
        id: Date.now().toString(),
        text,
        isUser,
        timestamp: new Date(),
      };

      setMessages((prev) => {
        const updated = [...prev, newMessage];
        saveChatHistory(updated);
        return updated;
      });

      return newMessage;
    },
    [saveChatHistory]
  );

  const clearHistory = useCallback(async () => {
    try {
      const storageKey = `${CHAT_STORAGE_KEY}${characterId}`;
      await AsyncStorage.removeItem(storageKey);
      setMessages([]);
    } catch (error) {
      console.error("Erro ao limpar histórico:", error);
    }
  }, [characterId]);

  return {
    messages,
    isLoading,
    isTyping,
    setIsTyping,
    addMessage,
    clearHistory,
  };
}
