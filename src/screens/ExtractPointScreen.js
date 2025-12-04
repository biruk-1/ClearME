import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import TextInput from '../components/TextInput';
import Button from '../components/Button';
import Card from '../components/Card';
import { extractMainPoint } from '../services/aiService';
import { saveToHistory } from '../services/storageService';
import { colors, gradients } from '../theme/colors';
import { spacing, borderRadius } from '../theme/spacing';

/**
 * Extract Main Point Screen - Core Feature B
 */
const ExtractPointScreen = ({ navigation }) => {
  const [inputText, setInputText] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleExtract = async () => {
    if (!inputText.trim()) {
      Alert.alert('Error', 'Please enter some text to analyze');
      return;
    }

    setLoading(true);
    try {
      const extracted = await extractMainPoint(inputText);
      setResults(extracted);
      
      // Save to history
      await saveToHistory({
        type: 'extract',
        original: inputText,
        results: extracted
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
        colors={gradients.purple}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Ionicons name="bulb-outline" size={32} color="#FFFFFF" />
          <Text style={styles.title}>Extract Main Point</Text>
          <Text style={styles.subtitle}>Find the key message instantly</Text>
        </View>
      </LinearGradient>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <TextInput
            label="Your Text"
            placeholder="Paste long text, emails, or articles here..."
            value={inputText}
            onChangeText={setInputText}
            multiline
            numberOfLines={8}
            maxLength={5000}
            showCharCount
          />

          <View style={styles.buttonRow}>
            <Button
              title="Extract"
              onPress={handleExtract}
              variant="gradient"
              loading={loading}
              disabled={!inputText.trim()}
              icon={<Ionicons name="search" size={20} color="#FFFFFF" />}
              style={styles.extractButton}
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
            <Text style={styles.resultsTitle}>🎯 Key Insights</Text>

            {/* Main Point */}
            <Card variant="elevated" style={styles.resultCard}>
              <View style={styles.resultHeader}>
                <View style={styles.resultTitleRow}>
                  <Ionicons name="flag" size={24} color={colors.error} />
                  <Text style={styles.resultTitle}>Main Point</Text>
                </View>
                <TouchableOpacity 
                  onPress={() => handleCopy(results.mainPoint, 'Main point')}
                  style={styles.copyButton}
                >
                  <Ionicons name="copy-outline" size={20} color={colors.primary} />
                </TouchableOpacity>
              </View>
              <Text style={styles.resultText}>{results.mainPoint}</Text>
            </Card>

            {/* Summary */}
            <Card variant="elevated" style={styles.resultCard}>
              <View style={styles.resultHeader}>
                <View style={styles.resultTitleRow}>
                  <Ionicons name="document-text" size={24} color={colors.info} />
                  <Text style={styles.resultTitle}>Summary</Text>
                </View>
                <TouchableOpacity 
                  onPress={() => handleCopy(results.summary, 'Summary')}
                  style={styles.copyButton}
                >
                  <Ionicons name="copy-outline" size={20} color={colors.primary} />
                </TouchableOpacity>
              </View>
              <Text style={styles.resultText}>{results.summary}</Text>
            </Card>

            {/* Action Steps */}
            {results.actionSteps && results.actionSteps.length > 0 && (
              <Card variant="elevated" style={styles.resultCard}>
                <View style={styles.resultHeader}>
                  <View style={styles.resultTitleRow}>
                    <Ionicons name="list" size={24} color={colors.success} />
                    <Text style={styles.resultTitle}>Action Steps</Text>
                  </View>
                  <TouchableOpacity 
                    onPress={() => handleCopy(results.actionSteps.join('\n'), 'Action steps')}
                    style={styles.copyButton}
                  >
                    <Ionicons name="copy-outline" size={20} color={colors.primary} />
                  </TouchableOpacity>
                </View>
                {results.actionSteps.map((step, index) => (
                  <View key={index} style={styles.actionStep}>
                    <View style={styles.stepNumber}>
                      <Text style={styles.stepNumberText}>{index + 1}</Text>
                    </View>
                    <Text style={styles.stepText}>{step}</Text>
                  </View>
                ))}
              </Card>
            )}

            <Button
              title="Extract Another Text"
              onPress={handleClear}
              variant="outline"
              fullWidth
              style={styles.anotherButton}
            />
          </View>
        )}

        {!results && (
          <View style={styles.tipsSection}>
            <Text style={styles.tipsTitle}>💡 Best For</Text>
            <View style={styles.tip}>
              <Ionicons name="mail" size={20} color={colors.primary} />
              <Text style={styles.tipText}>Long emails and messages</Text>
            </View>
            <View style={styles.tip}>
              <Ionicons name="document" size={20} color={colors.primary} />
              <Text style={styles.tipText}>Articles and reports</Text>
            </View>
            <View style={styles.tip}>
              <Ionicons name="chatbubbles" size={20} color={colors.primary} />
              <Text style={styles.tipText}>Meeting notes and discussions</Text>
            </View>
            <View style={styles.tip}>
              <Ionicons name="book" size={20} color={colors.primary} />
              <Text style={styles.tipText}>Research papers and studies</Text>
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
  extractButton: {
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
  actionStep: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
    gap: spacing.md,
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumberText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  stepText: {
    flex: 1,
    fontSize: 15,
    color: colors.text,
    lineHeight: 22,
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

export default ExtractPointScreen;
