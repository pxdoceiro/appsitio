import { useEffect, useState } from 'react';
import {
  useAudioRecorder,
  useAudioRecorderState,
  RecordingPresets,
  requestRecordingPermissionsAsync,
  setAudioModeAsync,
} from 'expo-audio';

export function useVoiceRecorder() {
  const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const recorderState = useAudioRecorderState(audioRecorder);
  const [recordingUri, setRecordingUri] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const status = await requestRecordingPermissionsAsync();
        if (!status.granted) {
          setError('Permissão para acessar o microfone foi negada');
          return;
        }

        await setAudioModeAsync({
          playsInSilentMode: true,
          allowsRecording: true,
        });
      } catch (err) {
        setError('Erro ao configurar áudio');
        console.error(err);
      }
    })();
  }, []);

  const startRecording = async () => {
    try {
      setError(null);
      await audioRecorder.prepareToRecordAsync();
      audioRecorder.record();
    } catch (err) {
      setError('Erro ao iniciar gravação');
      console.error(err);
    }
  };

  const stopRecording = async () => {
    try {
      await audioRecorder.stop();
      setRecordingUri(audioRecorder.uri);
      return audioRecorder.uri;
    } catch (err) {
      setError('Erro ao parar gravação');
      console.error(err);
      return null;
    }
  };

  return {
    isRecording: recorderState.isRecording,
    recordingUri,
    error,
    startRecording,
    stopRecording,
  };
}
