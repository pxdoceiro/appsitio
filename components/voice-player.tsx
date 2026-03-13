import { Pressable, View, Text } from 'react-native';
import { useVoicePlayer } from '@/hooks/use-voice-player';
import { useEffect } from 'react';

interface VoicePlayerProps {
  audioUri: string;
}

export function VoicePlayer({ audioUri }: VoicePlayerProps) {
  const { isPlaying, currentTime, duration, error, playAudio, stopAudio } = useVoicePlayer();

  useEffect(() => {
    if (audioUri) {
      playAudio(audioUri);
    }
  }, [audioUri]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View className="gap-2 items-center">
      <Pressable
        onPress={isPlaying ? stopAudio : () => playAudio(audioUri)}
        style={({ pressed }) => [
          {
            opacity: pressed ? 0.7 : 1,
          },
        ]}
        className="w-12 h-12 rounded-full bg-primary items-center justify-center"
      >
        <Text className="text-xl">{isPlaying ? '⏸️' : '▶️'}</Text>
      </Pressable>
      <Text className="text-sm text-muted">
        {formatTime(currentTime)} / {formatTime(duration)}
      </Text>
      {error && <Text className="text-error text-sm">{error}</Text>}
    </View>
  );
}
