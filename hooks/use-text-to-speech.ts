import { useEffect, useState } from 'react';
import * as Speech from 'expo-speech';
import type { Character } from '@/lib/characters';

interface VoiceConfig {
  pitch?: number;
  rate?: number;
  language?: string;
}

export function useTextToSpeech(character?: Character) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      Speech.stop();
    };
  }, []);

  const speak = async (text: string, customConfig?: VoiceConfig) => {
    try {
      setError(null);
      const isSpeakingNow = await Speech.isSpeakingAsync();
      
      if (isSpeakingNow) {
        await Speech.stop();
      }

      setIsSpeaking(true);
      
      // Usar configuração do personagem ou customizada
      const voiceConfig = customConfig || character?.voiceConfig || {};
      
      Speech.speak(text, {
        language: voiceConfig.language || 'pt-BR',
        pitch: voiceConfig.pitch ?? 1.0,
        rate: voiceConfig.rate ?? 0.9,
        onDone: () => setIsSpeaking(false),
        onError: (error: any) => {
          setError('Erro ao reproduzir áudio');
          setIsSpeaking(false);
          console.error('Speech error:', error);
        },
      });
    } catch (err) {
      setError('Erro ao iniciar fala');
      setIsSpeaking(false);
      console.error(err);
    }
  };

  const stop = async () => {
    try {
      await Speech.stop();
      setIsSpeaking(false);
    } catch (err) {
      console.error('Error stopping speech:', err);
    }
  };

  return {
    isSpeaking,
    error,
    speak,
    stop,
  };
}
