import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import TextInput from '../components/TextInput';
import Button from '../components/Button';
import Card from '../components/Card';
import { improveText } from '../services/aiService';
import { saveToHistory } from '../services/storageService';
import { colors, gradients } from '../theme/colors';
import { spacing, borderRadius } from '../theme/spacing';

/**
 * Improve Writing Screen - Core Feature A
 */
const ImproveWritingScreen = ({ navigation }) => {
  const [inputText, setInputText] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImprove = async () => {
    if (!inputText.trim()) {
      Alert.alert('Error', 'Please enter some text to improve');
      return;
    }

    setLoading(true);
    try {
      const improved = await improveText(inputText);
      setResults(improved);
      
      // Save to history
      await saveToHistory({
        type: 'improve',
        original: inputText,
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
    setInputText('');
    setResults(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={gradients.primary}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Ionicons name="create-outline" size={32} color="#FFFFFF" />
          <Text style={styles.title}>Improve Writing</Text>
          <Text style={styles.subtitle}>Get clear, professional versions</Text>
        </View>
      </LinearGradient>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <TextInput
            label="Your Text"
            placeholder="Type or paste your message here..."
            value={inputText}
            onChangeText={setInputText}
            multiline
            numberOfLines={6}
            maxLength={2000}
            showCharCount
          />

          <View style={styles.buttonRow}>
            <Button
              title="Improve"
              onPress={handleImprove}
              variant="gradient"
              loading={loading}
              disabled={!inputText.trim()}
              icon={<Ionicons name="sparkles" size={20} color="#FFFFFF" />}
              style={styles.improveButton}
            />
            {(inputText || results) && (
              <Button
                title="Clear"
                onPress={handleClear}
                variant="outline"
                style={styles.clearButton}
              />
            )}
          </View>
        </View>

        {results && (
          <View style={styles.resultsSection}>
            <Text style={styles.resultsTitle}>✨ Improved Versions</Text>

            {/* Clear Version */}
            <Card variant="elevated" style={styles.resultCard}>
              <View style={styles.resultHeader}>
                <View style={styles.resultTitleRow}>
                  <Ionicons name="checkmark-circle" size={24} color={colors.success} />
                  <Text style={styles.resultTitle}>Clear Version</Text>
                </View>
                <TouchableOpacity 
                  onPress={() => handleCopy(results.clear, 'Clear version')}
                  style={styles.copyButton}
                >
                  <Ionicons name="copy-outline" size={20} color={colors.primary} />
                </TouchableOpacity>
              </View>
              <Text style={styles.resultText}>{results.clear}</Text>
            </Card>

            {/* Professional Version */}
            <Card variant="elevated" style={styles.resultCard}>
              <View style={styles.resultHeader}>
                <View style={styles.resultTitleRow}>
                  <Ionicons name="briefcase" size={24} color={colors.primary} />
                  <Text style={styles.resultTitle}>Professional Version</Text>
                </View>
                <TouchableOpacity 
                  onPress={() => handleCopy(results.professional, 'Professional version')}
                  style={styles.copyButton}
                >
                  <Ionicons name="copy-outline" size={20} color={colors.primary} />
                </TouchableOpacity>
              </View>
              <Text style={styles.resultText}>{results.professional}</Text>
            </Card>

            {/* Concise Version */}
            <Card variant="elevated" style={styles.resultCard}>
              <View style={styles.resultHeader}>
                <View style={styles.resultTitleRow}>
                  <Ionicons name="flash" size={24} color={colors.warning} />
                  <Text style={styles.resultTitle}>Concise Version</Text>
                </View>
                <TouchableOpacity 
                  onPress={() => handleCopy(results.concise, 'Concise version')}
                  style={styles.copyButton}
                >
                  <Ionicons name="copy-outline" size={20} color={colors.primary} />
                </TouchableOpacity>
              </View>
              <Text style={styles.resultText}>{results.concise}</Text>
            </Card>

            <Button
              title="Improve Another Text"
              onPress={handleClear}
              variant="outline"
              fullWidth
              style={styles.anotherButton}
            />
          </View>
        )}

        {!results && (
          <View style={styles.tipsSection}>
            <Text style={styles.tipsTitle}>💡 Tips for Best Results</Text>
            <View style={styles.tip}>
              <Ionicons name="checkmark-circle" size={20} color={colors.success} />
              <Text style={styles.tipText}>Be specific about what you want to say</Text>
            </View>
            <View style={styles.tip}>
              <Ionicons name="checkmark-circle" size={20} color={colors.success} />
              <Text style={styles.tipText}>Include relevant context</Text>
            </View>
            <View style={styles.tip}>
              <Ionicons name="checkmark-circle" size={20} color={colors.success} />
              <Text style={styles.tipText}>Don't worry about grammar - we'll fix it!</Text>
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
  section: {
    padding: spacing.lg,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  improveButton: {
    flex: 1,
  },
  clearButton: {
    paddingHorizontal: spacing.lg,
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
  anotherButton: {
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

export default ImproveWritingScreen;
