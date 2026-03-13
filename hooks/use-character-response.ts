import { useState, useCallback } from "react";
import { trpc } from "@/lib/trpc";
import { useTextToSpeech } from "./use-text-to-speech";
import type { Character } from "@/lib/characters";

interface UseCharacterResponseOptions {
  onResponse: (text: string) => void;
  onError: (error: string) => void;
}

export function useCharacterResponse(
  character: Character,
  options: UseCharacterResponseOptions
) {
  const [isLoading, setIsLoading] = useState(false);
  const sendMessageMutation = trpc.chat.sendMessage.useMutation();
  const { speak } = useTextToSpeech(character);

  const getResponse = useCallback(
    async (
      userMessage: string,
      conversationHistory: Array<{ role: "user" | "assistant"; content: string }>
    ) => {
      setIsLoading(true);
      try {
        // Chamar API via tRPC
        const result = await sendMessageMutation.mutateAsync({
          characterId: character.id,
          characterName: character.displayName,
          systemPrompt: character.systemPrompt,
          messages: conversationHistory,
          userMessage: userMessage,
        });

        if (result.success) {
          const responseText = typeof result.response === "string" 
            ? result.response 
            : "Resposta inválida";
          options.onResponse(responseText);
          
          // Áudio será ativado apenas quando solicitado pelo usuário
          // await speak(responseText);
        } else {
          const errorText = typeof result.response === "string" 
            ? result.response 
            : "Erro desconhecido";
          options.onError(errorText);
        }
      } catch (error) {
        console.error("Erro ao obter resposta:", error);
        options.onError(
          error instanceof Error
            ? error.message
            : "Erro ao conectar com o servidor"
        );
      } finally {
        setIsLoading(false);
      }
    },
    [character, options, sendMessageMutation, speak]
  );

  return {
    getResponse,
    isLoading: isLoading || sendMessageMutation.isPending,
  };
}
