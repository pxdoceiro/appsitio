import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { CHARACTERS } from "@/lib/characters";

interface GroupResponseOptions {
  onResponse: (characterId: string, characterName: string, text: string) => Promise<void>;
  onError: (error: Error) => void;
}

export function useGroupResponse(characterIds: string[], options: GroupResponseOptions) {
  const [isLoading, setIsLoading] = useState(false);
  const sendMessageMutation = trpc.chat.sendMessage.useMutation();

  const getGroupResponse = async (
    userMessage: string,
    conversationHistory: Array<{ role: "user" | "assistant"; content: string }>
  ) => {
    try {
      setIsLoading(true);

      // Selecionar um personagem aleatório para responder (simular turnos)
      const randomCharacterId = characterIds[Math.floor(Math.random() * characterIds.length)];
      const character = CHARACTERS[randomCharacterId];

      if (!character) {
        throw new Error("Personagem não encontrado");
      }

      // Obter resposta do personagem
      const response = await sendMessageMutation.mutateAsync({
        characterId: randomCharacterId,
        characterName: character.displayName,
        systemPrompt: character.systemPrompt,
        messages: conversationHistory,
        userMessage,
      });

      // Chamar callback com a resposta
      await options.onResponse(
        randomCharacterId,
        character.displayName,
        response.success ? response.response : "Desculpe, ocorreu um erro ao processar sua mensagem.",
      );

      // Simular interação entre personagens (outro personagem responde)
      if (characterIds.length > 1 && Math.random() > 0.5) {
        // 50% de chance de outro personagem comentar
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Aguardar 1 segundo

        const otherCharacterId = characterIds.find((id) => id !== randomCharacterId);
        if (otherCharacterId) {
          const otherCharacter = CHARACTERS[otherCharacterId];

          // Criar prompt para o outro personagem comentar sobre a resposta anterior
        const interactionPrompt = response.success ? response.response : "";

          const interactionResponse = await sendMessageMutation.mutateAsync({
            characterId: otherCharacterId,
            characterName: otherCharacter!.displayName,
            systemPrompt: otherCharacter!.systemPrompt,
            messages: [
              ...conversationHistory,
              {
                role: "assistant",
                content: response.success ? response.response : "",
              },
            ],
            userMessage: interactionPrompt,
          });

          await options.onResponse(
            otherCharacterId,
            otherCharacter!.displayName,
            interactionResponse.success
              ? interactionResponse.response
              : "Desculpe, ocorreu um erro ao processar sua mensagem.",
          );
        }
      }
    } catch (error) {
      options.onError(error instanceof Error ? error : new Error("Erro desconhecido"));
    } finally {
      setIsLoading(false);
    }
  };

  return {
    getGroupResponse,
    isLoading: isLoading || sendMessageMutation.isPending,
  };
}
