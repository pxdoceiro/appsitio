import { useLocalSearchParams, useRouter } from "expo-router";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useEffect, useState, useRef } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ScreenContainer } from "@/components/screen-container";
import { MessageBubble } from "@/components/message-bubble";
import { useVoiceRecorder } from "@/hooks/use-voice-recorder";
import { useChat } from "@/hooks/use-chat";
import { useCharacterResponse } from "@/hooks/use-character-response";
import { CHARACTERS } from "@/lib/characters";

export default function VoiceCallScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [isCallActive, setIsCallActive] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [messages, setMessages] = useState<Array<{ id: string; text: string; isUser: boolean; timestamp: Date }>>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const callTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);

  const character = id ? CHARACTERS[id] : null;
  const { isRecording, recordingUri, error: recordingError, startRecording, stopRecording } = useVoiceRecorder();
  const { getResponse, isLoading } = useCharacterResponse(character!, {
    onResponse: (text) => {
      addMessage(text, false);
      setIsProcessing(false);
    },
    onError: (error) => {
      console.error("Erro:", error);
      setIsProcessing(false);
    },
  });

  if (!character) {
    return (
      <ScreenContainer className="items-center justify-center">
        <Text className="text-foreground">Personagem não encontrado</Text>
      </ScreenContainer>
    );
  }

  const addMessage = (text: string, isUser: boolean) => {
    const newMessage = {
      id: Date.now().toString(),
      text,
      isUser,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  const startCall = async () => {
    setIsCallActive(true);
    setCallDuration(0);
    setMessages([]);
    
    // Iniciar timer
    callTimerRef.current = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);

    // Começar a gravar
    await startRecording();
  };

  const endCall = async () => {
    setIsCallActive(false);
    
    // Parar timer
    if (callTimerRef.current) {
      clearInterval(callTimerRef.current);
      callTimerRef.current = null;
    }

    // Parar gravação
    if (isRecording) {
      await stopRecording();
    }
  };

  const handleSendVoiceMessage = async () => {
    if (!recordingUri) return;

    setIsProcessing(true);
    
    // Aqui você adicionaria a lógica de transcrição de áudio
    // Por enquanto, vamos simular uma mensagem de voz
    addMessage("🎙️ Mensagem de voz enviada", true);

    // Simular resposta do personagem
    setTimeout(() => {
      const responses = [
        "Que legal! Adorei sua mensagem!",
        "Muito interessante! Me conta mais!",
        "Que bacana! Vamos conversar mais sobre isso!",
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      addMessage(randomResponse, false);
      setIsProcessing(false);
    }, 1500);
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  if (!isCallActive) {
    return (
      <ScreenContainer className="flex-1 p-4 items-center justify-center gap-8">
        <View className="items-center gap-4">
          <Text className="text-3xl">📞</Text>
          <Text className="text-2xl font-bold text-foreground">
            Ligar para {character.displayName}
          </Text>
          <Text className="text-muted text-center">
            Toque para iniciar uma chamada de voz
          </Text>
        </View>

        <Pressable
          onPress={startCall}
          style={({ pressed }) => [
            {
              opacity: pressed ? 0.7 : 1,
              transform: [{ scale: pressed ? 0.95 : 1 }],
            },
          ]}
          className="w-24 h-24 rounded-full bg-primary items-center justify-center shadow-lg"
        >
          <Text className="text-5xl">📞</Text>
        </Pressable>

        <Pressable
          onPress={() => router.back()}
          className="mt-8"
        >
          <Text className="text-primary text-lg font-semibold">← Voltar</Text>
        </Pressable>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="flex-1 p-0" containerClassName="flex-1">
      {/* Call Header */}
      <View className="bg-surface border-b border-border px-4 py-4 items-center gap-2">
        <Text className="text-2xl font-bold text-foreground">
          {character.displayName}
        </Text>
        <Text className="text-lg text-primary font-semibold">
          {formatDuration(callDuration)}
        </Text>
        <Text className="text-sm text-muted">
          {isRecording ? "🔴 Gravando..." : "Chamada ativa"}
        </Text>
      </View>

      {/* Messages Area */}
      <ScrollView
        ref={scrollViewRef}
        className="flex-1 px-4 py-4"
        onContentSizeChange={() =>
          scrollViewRef.current?.scrollToEnd({ animated: true })
        }
      >
        {messages.length === 0 ? (
          <View className="flex-1 items-center justify-center py-8">
            <Text className="text-muted text-center text-base">
              Comece a falar com {character.displayName}!
            </Text>
          </View>
        ) : (
          messages.map((message) => (
            <MessageBubble
              key={message.id}
              text={message.text}
              isUser={message.isUser}
              timestamp={message.timestamp}
            />
          ))
        )}

        {isProcessing && (
          <View className="items-center py-4">
            <ActivityIndicator color="#2D5016" size="small" />
            <Text className="text-muted text-sm mt-2">Processando...</Text>
          </View>
        )}
      </ScrollView>

      {/* Call Controls */}
      <View className="border-t border-border bg-surface px-4 py-4 gap-3">
        <Pressable
          onPress={handleSendVoiceMessage}
          disabled={!recordingUri || isProcessing}
          style={({ pressed }) => [
            {
              opacity: pressed && recordingUri && !isProcessing ? 0.7 : 1,
            },
          ]}
          className="bg-primary p-4 rounded-full items-center justify-center"
        >
          {isProcessing ? (
            <ActivityIndicator color="#2D5016" size="small" />
          ) : (
            <Text className="text-lg font-semibold text-background">
              Enviar Mensagem 🎙️
            </Text>
          )}
        </Pressable>

        <Pressable
          onPress={endCall}
          style={({ pressed }) => [
            {
              opacity: pressed ? 0.7 : 1,
            },
          ]}
          className="bg-error p-4 rounded-full items-center justify-center"
        >
          <Text className="text-lg font-semibold text-background">
            Encerrar Chamada ☎️
          </Text>
        </Pressable>
      </View>
    </ScreenContainer>
  );
}
