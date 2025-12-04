import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, Alert, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import Button from '../components/Button';
import Card from '../components/Card';
import { startRecording, stopRecording, transcribeAudio } from '../services/voiceService';
import { improveVoiceText } from '../services/aiService';
import { saveToHistory } from '../services/storageService';
import { colors, gradients } from '../theme/colors';
import { spacing, borderRadius } from '../theme/spacing';

/**
 * Voice Clarity Screen - Core Feature C
 */
const VoiceClarityScreen = ({ navigation }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcribedText, setTranscribedText] = useState('');
  const [improvedText, setImprovedText] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pulseAnim] = useState(new Animated.Value(1));

  const startPulseAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const stopPulseAnimation = () => {
    pulseAnim.stopAnimation();
    pulseAnim.setValue(1);
  };

  const handleStartRecording = async () => {
    try {
      await startRecording();
      setIsRecording(true);
      startPulseAnimation();
    } catch (error) {
      Alert.alert('Error', 'Failed to start recording. Please check microphone permissions.');
    }
  };

  const handleStopRecording = async () => {
    try {
      setIsRecording(false);
      stopPulseAnimation();
      setLoading(true);

      const audioUri = await stopRecording();
      const transcribed = await transcribeAudio(audioUri);
      setTranscribedText(transcribed);

      // Automatically improve the transcribed text
      const improved = await improveVoiceText(transcribed);
      setImprovedText(improved);

      // Save to history
      await saveToHistory({
        type: 'voice',
        transcribed: transcribed,
        results: improved
      });

    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async (text, label) => {
    await Clipboard.setStringAsync(text);
    Alert.alert('Copied!', `${label} copied to clipboard`);
  };

  const handleClear = () => {
    setTranscribedText('');
    setImprovedText(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={gradients.success}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Ionicons name="mic-outline" size={32} color="#FFFFFF" />
          <Text style={styles.title}>Voice to Clarity</Text>
          <Text style={styles.subtitle}>Speak and get improved text</Text>
        </View>
      </LinearGradient>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {!transcribedText && (
          <View style={styles.recordingSection}>
            <View style={styles.micContainer}>
              <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
                <TouchableOpacity
                  style={[
                    styles.micButton,
                    isRecording && styles.micButtonRecording
                  ]}
                  onPress={isRecording ? handleStopRecording : handleStartRecording}
                  disabled={loading}
                >
                  <Ionicons 
                    name={isRecording ? "stop" : "mic"} 
                    size={48} 
                    color="#FFFFFF" 
                  />
                </TouchableOpacity>
              </Animated.View>
            </View>

            <Text style={styles.recordingStatus}>
              {isRecording ? '🔴 Recording...' : 'Tap to start recording'}
            </Text>

            {isRecording && (
              <Text style={styles.recordingHint}>
                Tap again to stop and process
              </Text>
            )}

            {loading && (
              <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Processing your voice...</Text>
              </View>
            )}
          </View>
        )}

        {transcribedText && !loading && (
          <View style={styles.resultsSection}>
            <Text style={styles.resultsTitle}>🎤 Your Voice</Text>

            {/* Transcribed Text */}
            <Card variant="elevated" style={styles.resultCard}>
              <View style={styles.resultHeader}>
                <View style={styles.resultTitleRow}>
                  <Ionicons name="text" size={24} color={colors.textSecondary} />
                  <Text style={styles.resultTitle}>Transcribed</Text>
                </View>
                <TouchableOpacity 
                  onPress={() => handleCopy(transcribedText, 'Transcribed text')}
                  style={styles.copyButton}
                >
                  <Ionicons name="copy-outline" size={20} color={colors.primary} />
                </TouchableOpacity>
              </View>
              <Text style={styles.resultText}>{transcribedText}</Text>
            </Card>

            {improvedText && (
              <>
                <Text style={styles.resultsTitle}>✨ Improved Versions</Text>

                {/* Clear Version */}
                <Card variant="elevated" style={styles.resultCard}>
                  <View style={styles.resultHeader}>
                    <View style={styles.resultTitleRow}>
                      <Ionicons name="checkmark-circle" size={24} color={colors.success} />
                      <Text style={styles.resultTitle}>Clear Version</Text>
                    </View>
                    <TouchableOpacity 
                      onPress={() => handleCopy(improvedText.clear, 'Clear version')}
                      style={styles.copyButton}
                    >
                      <Ionicons name="copy-outline" size={20} color={colors.primary} />
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.resultText}>{improvedText.clear}</Text>
                </Card>

                {/* Professional Version */}
                <Card variant="elevated" style={styles.resultCard}>
                  <View style={styles.resultHeader}>
                    <View style={styles.resultTitleRow}>
                      <Ionicons name="briefcase" size={24} color={colors.primary} />
                      <Text style={styles.resultTitle}>Professional Version</Text>
                    </View>
                    <TouchableOpacity 
                      onPress={() => handleCopy(improvedText.professional, 'Professional version')}
                      style={styles.copyButton}
                    >
                      <Ionicons name="copy-outline" size={20} color={colors.primary} />
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.resultText}>{improvedText.professional}</Text>
                </Card>

                {/* Concise Version */}
                <Card variant="elevated" style={styles.resultCard}>
                  <View style={styles.resultHeader}>
                    <View style={styles.resultTitleRow}>
                      <Ionicons name="flash" size={24} color={colors.warning} />
                      <Text style={styles.resultTitle}>Concise Version</Text>
                    </View>
                    <TouchableOpacity 
                      onPress={() => handleCopy(improvedText.concise, 'Concise version')}
                      style={styles.copyButton}
                    >
                      <Ionicons name="copy-outline" size={20} color={colors.primary} />
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.resultText}>{improvedText.concise}</Text>
                </Card>
              </>
            )}

            <Button
              title="Record Again"
              onPress={handleClear}
              variant="gradient"
              fullWidth
              icon={<Ionicons name="mic" size={20} color="#FFFFFF" />}
              style={styles.recordAgainButton}
            />
          </View>
        )}

        {!transcribedText && !isRecording && !loading && (
          <View style={styles.tipsSection}>
            <Text style={styles.tipsTitle}>💡 Tips for Clear Recording</Text>
            <View style={styles.tip}>
              <Ionicons name="volume-high" size={20} color={colors.success} />
              <Text style={styles.tipText}>Speak clearly and at normal pace</Text>
            </View>
            <View style={styles.tip}>
              <Ionicons name="location" size={20} color={colors.success} />
              <Text style={styles.tipText}>Find a quiet environment</Text>
            </View>
            <View style={styles.tip}>
              <Ionicons name="phone-portrait" size={20} color={colors.success} />
              <Text style={styles.tipText}>Hold phone close to your mouth</Text>
            </View>
            <View style={styles.tip}>
              <Ionicons name="time" size={20} color={colors.success} />
              <Text style={styles.tipText}>Keep recordings under 2 minutes</Text>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingTop: spacing.xl,
    paddingBottom: spacing.xl,
    paddingHorizontal: spacing.lg,
    borderBottomLeftRadius: borderRadius['2xl'],
    borderBottomRightRadius: borderRadius['2xl'],
  },
  backButton: {
    marginBottom: spacing.md,
  },
  headerContent: {
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: spacing.sm,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: spacing.xs,
  },
  content: {
    flex: 1,
  },
  recordingSection: {
    alignItems: 'center',
    paddingVertical: spacing['3xl'],
  },
  micContainer: {
    marginBottom: spacing.xl,
  },
  micButton: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.success,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.success,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  micButtonRecording: {
    backgroundColor: colors.error,
    shadowColor: colors.error,
  },
  recordingStatus: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  recordingHint: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  loadingContainer: {
    marginTop: spacing.xl,
  },
  loadingText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  resultsSection: {
    padding: spacing.lg,
  },
  resultsTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.lg,
  },
  resultCard: {
    marginBottom: spacing.md,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  resultTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  copyButton: {
    padding: spacing.sm,
  },
  resultText: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
  },
  recordAgainButton: {
    marginTop: spacing.md,
  },
  tipsSection: {
    padding: spacing.lg,
    backgroundColor: colors.surface,
    margin: spacing.lg,
    borderRadius: borderRadius.lg,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.md,
  },
  tip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  tipText: {
    fontSize: 14,
    color: colors.textSecondary,
    flex: 1,
  },
});

export default VoiceClarityScreen;
