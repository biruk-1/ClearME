import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import TextInput from '../components/TextInput';
import Button from '../components/Button';
import Card from '../components/Card';
import { generateDailyExercise, evaluatePractice } from '../services/aiService';
import { saveExercise } from '../services/storageService';
import { colors, gradients } from '../theme/colors';
import { spacing, borderRadius } from '../theme/spacing';

/**
 * Daily Practice Screen - Secondary Feature D
 */
const DailyPracticeScreen = ({ navigation }) => {
  const [exercise, setExercise] = useState(null);
  const [userResponse, setUserResponse] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);
  const [evaluating, setEvaluating] = useState(false);

  useEffect(() => {
    loadExercise();
  }, []);

  const loadExercise = async () => {
    setLoading(true);
    try {
      const newExercise = await generateDailyExercise();
      setExercise(newExercise);
      setUserResponse('');
      setFeedback(null);
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!userResponse.trim()) {
      Alert.alert('Error', 'Please write your response first');
      return;
    }

    setEvaluating(true);
    try {
      const evaluation = await evaluatePractice(exercise, userResponse);
      setFeedback(evaluation);
      
      // Save exercise completion
      await saveExercise({
        exercise,
        userResponse,
        feedback: evaluation
      });
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setEvaluating(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return colors.success;
    if (score >= 60) return colors.warning;
    return colors.error;
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={gradients.warning}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Ionicons name="fitness-outline" size={32} color="#FFFFFF" />
          <Text style={styles.title}>Daily Practice</Text>
          <Text style={styles.subtitle}>Improve with guided exercises</Text>
        </View>
      </LinearGradient>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading exercise...</Text>
          </View>
        ) : exercise ? (
          <View style={styles.section}>
            {/* Exercise Card */}
            <Card variant="elevated" style={styles.exerciseCard}>
              <View style={styles.exerciseHeader}>
                <Ionicons name="trophy" size={24} color={colors.warning} />
                <Text style={styles.exerciseTitle}>{exercise.title}</Text>
              </View>
              
              <View style={styles.exerciseSection}>
                <Text style={styles.sectionLabel}>📝 Task</Text>
                <Text style={styles.exerciseText}>{exercise.task}</Text>
              </View>

              <View style={styles.exerciseSection}>
                <Text style={styles.sectionLabel}>📄 Content</Text>
                <Text style={styles.exerciseContent}>{exercise.content}</Text>
              </View>

              {exercise.hint && (
                <View style={styles.hintBox}>
                  <Ionicons name="bulb" size={20} color={colors.info} />
                  <Text style={styles.hintText}>{exercise.hint}</Text>
                </View>
              )}
            </Card>

            {/* User Response */}
            {!feedback && (
              <>
                <TextInput
                  label="Your Response"
                  placeholder="Write your improved version here..."
                  value={userResponse}
                  onChangeText={setUserResponse}
                  multiline
                  numberOfLines={6}
                  maxLength={1000}
                  showCharCount
                />

                <Button
                  title="Submit for Feedback"
                  onPress={handleSubmit}
                  variant="gradient"
                  loading={evaluating}
                  disabled={!userResponse.trim()}
                  icon={<Ionicons name="send" size={20} color="#FFFFFF" />}
                  fullWidth
                />
              </>
            )}

            {/* Feedback */}
            {feedback && (
              <View style={styles.feedbackSection}>
                <Text style={styles.resultsTitle}>📊 Your Results</Text>

                {/* Score Card */}
                <Card 
                  variant="elevated" 
                  style={styles.scoreCard}
                  gradient={[getScoreColor(feedback.score), getScoreColor(feedback.score) + '99']}
                >
                  <Text style={styles.scoreLabel}>Your Score</Text>
                  <Text style={styles.scoreValue}>{feedback.score}/100</Text>
                  <Text style={styles.scoreMessage}>
                    {feedback.score >= 80 ? '🎉 Excellent!' : 
                     feedback.score >= 60 ? '👍 Good job!' : 
                     '💪 Keep practicing!'}
                  </Text>
                </Card>

                {/* Feedback */}
                <Card variant="elevated" style={styles.feedbackCard}>
                  <View style={styles.feedbackHeader}>
                    <Ionicons name="chatbubble-ellipses" size={24} color={colors.info} />
                    <Text style={styles.feedbackTitle}>Feedback</Text>
                  </View>
                  <Text style={styles.feedbackText}>{feedback.feedback}</Text>
                </Card>

                {/* Strengths */}
                {feedback.strengths && feedback.strengths.length > 0 && (
                  <Card variant="elevated" style={styles.feedbackCard}>
                    <View style={styles.feedbackHeader}>
                      <Ionicons name="checkmark-circle" size={24} color={colors.success} />
                      <Text style={styles.feedbackTitle}>Strengths</Text>
                    </View>
                    {feedback.strengths.map((strength, index) => (
                      <View key={index} style={styles.listItem}>
                        <Ionicons name="checkmark" size={16} color={colors.success} />
                        <Text style={styles.listText}>{strength}</Text>
                      </View>
                    ))}
                  </Card>
                )}

                {/* Improvements */}
                {feedback.improvements && feedback.improvements.length > 0 && (
                  <Card variant="elevated" style={styles.feedbackCard}>
                    <View style={styles.feedbackHeader}>
                      <Ionicons name="bulb" size={24} color={colors.warning} />
                      <Text style={styles.feedbackTitle}>Areas to Improve</Text>
                    </View>
                    {feedback.improvements.map((improvement, index) => (
                      <View key={index} style={styles.listItem}>
                        <Ionicons name="arrow-forward" size={16} color={colors.warning} />
                        <Text style={styles.listText}>{improvement}</Text>
                      </View>
                    ))}
                  </Card>
                )}

                <Button
                  title="Try Another Exercise"
                  onPress={loadExercise}
                  variant="gradient"
                  fullWidth
                  icon={<Ionicons name="refresh" size={20} color="#FFFFFF" />}
                  style={styles.nextButton}
                />
              </View>
            )}
          </View>
        ) : null}
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
  loadingContainer: {
    padding: spacing['3xl'],
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  section: {
    padding: spacing.lg,
  },
  exerciseCard: {
    marginBottom: spacing.lg,
  },
  exerciseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  exerciseTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
  },
  exerciseSection: {
    marginBottom: spacing.lg,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  exerciseText: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
  },
  exerciseContent: {
    fontSize: 15,
    color: colors.text,
    lineHeight: 22,
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    fontStyle: 'italic',
  },
  hintBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderLeftWidth: 3,
    borderLeftColor: colors.info,
  },
  hintText: {
    flex: 1,
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  feedbackSection: {
    marginTop: spacing.lg,
  },
  resultsTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.lg,
  },
  scoreCard: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    marginBottom: spacing.md,
  },
  scoreLabel: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: spacing.sm,
  },
  scoreValue: {
    fontSize: 48,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: spacing.sm,
  },
  scoreMessage: {
    fontSize: 18,
    color: '#FFFFFF',
  },
  feedbackCard: {
    marginBottom: spacing.md,
  },
  feedbackHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  feedbackTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  feedbackText: {
    fontSize: 15,
    color: colors.text,
    lineHeight: 22,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  listText: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  nextButton: {
    marginTop: spacing.md,
  },
});

export default DailyPracticeScreen;
