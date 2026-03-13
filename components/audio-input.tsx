import { View, Pressable, Text, ActivityIndicator, Alert } from "react-native";
import { useEffect, useRef, useState } from "react";
import * as FileSystem from "expo-file-system";
import { Audio } from "expo-audio";
import { trpc } from "@/lib/trpc";

interface AudioInputProps {
  onTranscript: (text: string) => void;
  disabled?: boolean;
}

export function AudioInput({ onTranscript, disabled = false }: AudioInputProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const recordingRef = useRef<Audio.Recording | null>(null);
  const transcribeMutation = trpc.audio.transcribe.useMutation();

  useEffect(() => {
    // Initialize audio
    const initAudio = async () => {
      try {
        await Audio.requestPermissionsAsync();
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
          staysActiveInBackground: false,
        });
      } catch (error) {
        console.error("Erro ao inicializar áudio:", error);
      }
    };

    initAudio();

    return () => {
      // Cleanup
      if (recordingRef.current) {
        recordingRef.current.stopAndUnloadAsync();
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      setIsRecording(true);
      const recording = new Audio.Recording();
      await recording.prepareToRecordAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
      await recording.startAsync();
      recordingRef.current = recording;
    } catch (error) {
      console.error("Erro ao iniciar gravação:", error);
      Alert.alert("Erro", "Não foi possível iniciar a gravação");
      setIsRecording(false);
    }
  };

  const stopRecording = async () => {
    try {
      if (!recordingRef.current) return;

      setIsRecording(false);
      setIsTranscribing(true);

      await recordingRef.current.stopAndUnloadAsync();
      const uri = recordingRef.current.getURI();

      if (!uri) {
        Alert.alert("Erro", "Não foi possível obter o arquivo de áudio");
        setIsTranscribing(false);
        return;
      }

      // Ler o arquivo de áudio como base64
      const audioBase64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Criar data URL para enviar ao servidor
      const audioDataUrl = `data:audio/m4a;base64,${audioBase64}`;

      // Chamar transcrição via tRPC
      const result = await transcribeMutation.mutateAsync({
        audioUrl: audioDataUrl,
        language: "pt",
      });

      if (result.success && result.text) {
        onTranscript(result.text);
      } else {
        Alert.alert("Erro", result.error || "Não foi possível transcrever o áudio");
      }

      recordingRef.current = null;
      setIsTranscribing(false);

      // Limpar arquivo local
      await FileSystem.deleteAsync(uri, { idempotent: true });
    } catch (error) {
      console.error("Erro ao parar gravação:", error);
      Alert.alert("Erro", "Não foi possível processar o áudio");
      setIsTranscribing(false);
    }
  };

  return (
    <View className="flex-row gap-2 items-center">
      <Pressable
        onPress={isRecording ? stopRecording : startRecording}
        disabled={disabled || isTranscribing}
        style={({ pressed }) => [
          {
            opacity: pressed && !disabled && !isTranscribing ? 0.7 : 1,
          },
        ]}
        className={`p-3 rounded-full items-center justify-center ${
          isRecording ? "bg-red-500" : "bg-primary"
        } ${disabled || isTranscribing ? "opacity-50" : ""}`}
      >
        {isTranscribing ? (
          <ActivityIndicator color="#fff" size="small" />
        ) : (
          <Text className="text-lg">{isRecording ? "⏹️" : "🎤"}</Text>
        )}
      </Pressable>
      {isRecording && (
        <Text className="text-sm text-red-500 font-semibold animate-pulse">
          Gravando...
        </Text>
      )}
      {isTranscribing && (
        <Text className="text-sm text-primary font-semibold">
          Transcrevendo...
        </Text>
      )}
    </View>
  );
}
