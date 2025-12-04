import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import FeatureCard from '../components/FeatureCard';
import { colors, gradients } from '../theme/colors';
import { spacing, borderRadius } from '../theme/spacing';

/**
 * Home Screen - Main landing page
 */
const HomeScreen = ({ navigation }) => {
  const features = [
    {
      id: 1,
      title: 'Improve Writing',
      description: 'Get clear, professional, and concise versions',
      icon: <Ionicons name="create-outline" size={28} color="#FFFFFF" />,
      gradient: gradients.primary,
      screen: 'ImproveWriting'
    },
    {
      id: 2,
      title: 'Extract Main Point',
      description: 'Find the key message in any text',
      icon: <Ionicons name="bulb-outline" size={28} color="#FFFFFF" />,
      gradient: gradients.purple,
      screen: 'ExtractPoint'
    },
    {
      id: 3,
      title: 'Voice to Clarity',
      description: 'Speak and get improved text instantly',
      icon: <Ionicons name="mic-outline" size={28} color="#FFFFFF" />,
      gradient: gradients.success,
      screen: 'VoiceClarity'
    },
    {
      id: 4,
      title: 'Daily Practice',
      description: 'Improve with guided exercises',
      icon: <Ionicons name="fitness-outline" size={28} color="#FFFFFF" />,
      gradient: gradients.warning,
      screen: 'DailyPractice'
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={gradients.primary}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.greeting}>Welcome to</Text>
            <Text style={styles.title}>ClearMe</Text>
            <Text style={styles.subtitle}>AI Communication Coach</Text>
          </View>
          <Ionicons name="chatbubbles" size={48} color="rgba(255, 255, 255, 0.9)" />
        </View>
      </LinearGradient>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What would you like to do?</Text>
          
          {features.map(feature => (
            <FeatureCard
              key={feature.id}
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
              gradient={feature.gradient}
              onPress={() => navigation.navigate(feature.screen)}
            />
          ))}
        </View>

        <View style={styles.quickStats}>
          <View style={styles.statCard}>
            <Ionicons name="time-outline" size={24} color={colors.primary} />
            <Text style={styles.statValue}>Quick</Text>
            <Text style={styles.statLabel}>Instant Results</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="shield-checkmark-outline" size={24} color={colors.success} />
            <Text style={styles.statValue}>Secure</Text>
            <Text style={styles.statLabel}>Private & Safe</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="sparkles-outline" size={24} color={colors.secondary} />
            <Text style={styles.statValue}>AI-Powered</Text>
            <Text style={styles.statLabel}>Smart Coach</Text>
          </View>
        </View>

        <View style={styles.tipCard}>
          <Ionicons name="information-circle" size={24} color={colors.info} />
          <View style={styles.tipContent}>
            <Text style={styles.tipTitle}>💡 Pro Tip</Text>
            <Text style={styles.tipText}>
              The more context you provide, the better your results will be!
            </Text>
          </View>
        </View>
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
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: spacing.xs,
  },
  title: {
    fontSize: 36,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  content: {
    flex: 1,
  },
  section: {
    padding: spacing.lg,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.lg,
  },
  quickStats: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginTop: spacing.xs,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  tipCard: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.xl,
    gap: spacing.md,
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  tipText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
});

export default HomeScreen;
