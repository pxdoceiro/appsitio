import { useEffect, useState } from 'react';
import { useAudioPlayer, useAudioPlayerStatus, setAudioModeAsync } from 'expo-audio';

export function useVoicePlayer() {
  const [audioUri, setAudioUri] = useState<string | null>(null);
  const player = useAudioPlayer(audioUri || '');
  const status = useAudioPlayerStatus(player);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        await setAudioModeAsync({
          playsInSilentMode: true,
        });
      } catch (err) {
        setError('Erro ao configurar áudio');
        console.error(err);
      }
    })();
  }, []);

  const playAudio = async (uri: string) => {
    try {
      setError(null);
      setAudioUri(uri);
      // Aguardar um frame para o player ser criado
      setTimeout(() => {
        player.play();
      }, 100);
    } catch (err) {
      setError('Erro ao reproduzir áudio');
      console.error(err);
    }
  };

  const stopAudio = () => {
    try {
      player.pause();
    } catch (err) {
      setError('Erro ao parar áudio');
      console.error(err);
    }
  };

  return {
    isPlaying: status.playing,
    currentTime: status.currentTime,
    duration: status.duration,
    error,
    playAudio,
    stopAudio,
  };
}
