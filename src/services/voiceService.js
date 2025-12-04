import { Audio } from 'expo-av';
import * as Speech from 'expo-speech';

/**
 * Voice Service for ClearMe
 * Handles voice recording and speech-to-text
 */

let recording = null;

/**
 * Request microphone permissions
 */
export const requestPermissions = async () => {
  try {
    const { status } = await Audio.requestPermissionsAsync();
    return status === 'granted';
  } catch (error) {
    console.error('Error requesting permissions:', error);
    return false;
  }
};

/**
 * Start recording
 */
export const startRecording = async () => {
  try {
    const hasPermission = await requestPermissions();
    if (!hasPermission) {
      throw new Error('Microphone permission not granted');
    }

    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
    });

    const { recording: newRecording } = await Audio.Recording.createAsync(
      Audio.RecordingOptionsPresets.HIGH_QUALITY
    );
    
    recording = newRecording;
    return recording;
  } catch (error) {
    console.error('Error starting recording:', error);
    throw error;
  }
};

/**
 * Stop recording and get URI
 */
export const stopRecording = async () => {
  try {
    if (!recording) {
      throw new Error('No recording in progress');
    }

    await recording.stopAndUnloadAsync();
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
    });

    const uri = recording.getURI();
    recording = null;
    return uri;
  } catch (error) {
    console.error('Error stopping recording:', error);
    throw error;
  }
};

/**
 * Transcribe audio to text
 * NOTE: This is a placeholder. For production, integrate:
 * - OpenAI Whisper API
 * - Google Cloud Speech-to-Text
 * - Azure Speech Services
 */
export const transcribeAudio = async (audioUri) => {
  try {
    // PLACEHOLDER: In production, send audio to transcription API
    // For now, return mock transcription
    
    // Example with OpenAI Whisper:
    // const formData = new FormData();
    // formData.append('file', {
    //   uri: audioUri,
    //   type: 'audio/m4a',
    //   name: 'recording.m4a'
    // });
    // formData.append('model', 'whisper-1');
    // 
    // const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': `Bearer ${OPENAI_API_KEY}`,
    //   },
    //   body: formData
    // });
    // 
    // const data = await response.json();
    // return data.text;

    // Mock transcription for MVP testing
    return "This is a sample transcription. In production, this will be the actual transcribed text from your voice recording.";
    
  } catch (error) {
    console.error('Error transcribing audio:', error);
    throw new Error('Failed to transcribe audio. Please try again.');
  }
};

/**
 * Speak text aloud
 */
export const speakText = async (text) => {
  try {
    await Speech.speak(text, {
      language: 'en',
      pitch: 1.0,
      rate: 0.9
    });
  } catch (error) {
    console.error('Error speaking text:', error);
  }
};

/**
 * Stop speaking
 */
export const stopSpeaking = async () => {
  try {
    await Speech.stop();
  } catch (error) {
    console.error('Error stopping speech:', error);
  }
};

/**
 * Check if currently recording
 */
export const isRecording = () => {
  return recording !== null;
};
