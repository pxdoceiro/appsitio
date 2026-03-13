import { Pressable, View, Text } from 'react-native';
import { useVoiceRecorder } from '@/hooks/use-voice-recorder';
import { cn } from '@/lib/utils';

interface VoiceRecorderButtonProps {
  onRecordingComplete: (uri: string) => void;
}

export function VoiceRecorderButton({ onRecordingComplete }: VoiceRecorderButtonProps) {
  const { isRecording, error, startRecording, stopRecording } = useVoiceRecorder();

  const handlePress = async () => {
    if (isRecording) {
      const uri = await stopRecording();
      if (uri) {
        onRecordingComplete(uri);
      }
    } else {
      await startRecording();
    }
  };

  return (
    <View className="gap-2">
      <Pressable
        onPress={handlePress}
        style={({ pressed }) => [
          {
            opacity: pressed ? 0.7 : 1,
          },
        ]}
        className={cn(
          'w-16 h-16 rounded-full items-center justify-center',
          isRecording ? 'bg-error' : 'bg-primary'
        )}
      >
        <Text className="text-2xl">{isRecording ? '⏹️' : '🎤'}</Text>
      </Pressable>
      {error && <Text className="text-error text-sm">{error}</Text>}
      {isRecording && <Text className="text-primary text-sm font-semibold">Gravando...</Text>}
    </View>
  );
}
