import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import Card from '../components/Card';
import Button from '../components/Button';
import { getHistory, deleteHistoryItem, clearHistory } from '../services/storageService';
import { colors, gradients } from '../theme/colors';
import { spacing, borderRadius } from '../theme/spacing';

/**
 * History Screen - Secondary Feature E
 */
const HistoryScreen = ({ navigation }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const data = await getHistory();
      setHistory(data);
    } catch (error) {
      Alert.alert('Error', 'Failed to load history');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    Alert.alert(
      'Delete Item',
      'Are you sure you want to delete this item?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteHistoryItem(id);
              await loadHistory();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete item');
            }
          }
        }
      ]
    );
  };

  const handleClearAll = () => {
    Alert.alert(
      'Clear All History',
      'Are you sure you want to delete all history? This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: async () => {
            try {
              await clearHistory();
              await loadHistory();
            } catch (error) {
              Alert.alert('Error', 'Failed to clear history');
            }
          }
        }
      ]
    );
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'improve': return 'create-outline';
      case 'extract': return 'bulb-outline';
      case 'voice': return 'mic-outline';
      default: return 'document-text-outline';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'improve': return colors.primary;
      case 'extract': return colors.secondary;
      case 'voice': return colors.success;
      default: return colors.textSecondary;
    }
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case 'improve': return 'Improved Writing';
      case 'extract': return 'Extracted Point';
      case 'voice': return 'Voice Clarity';
      default: return 'Unknown';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={gradients.primary}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <Ionicons name="time-outline" size={32} color="#FFFFFF" />
          <Text style={styles.title}>History</Text>
          <Text style={styles.subtitle}>{history.length} saved items</Text>
        </View>
      </LinearGradient>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading history...</Text>
          </View>
        ) : history.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="folder-open-outline" size={64} color={colors.textLight} />
            <Text style={styles.emptyTitle}>No History Yet</Text>
            <Text style={styles.emptyText}>
              Your improved texts and extractions will appear here
            </Text>
            <Button
              title="Start Improving"
              onPress={() => navigation.navigate('Home')}
              variant="gradient"
              style={styles.startButton}
            />
          </View>
        ) : (
          <View style={styles.section}>
            <View style={styles.headerRow}>
              <Text style={styles.sectionTitle}>Recent Activity</Text>
              {history.length > 0 && (
                <TouchableOpacity onPress={handleClearAll}>
                  <Text style={styles.clearAllText}>Clear All</Text>
                </TouchableOpacity>
              )}
            </View>

            {history.map((item) => (
              <Card key={item.id} variant="elevated" style={styles.historyCard}>
                <View style={styles.cardHeader}>
                  <View style={styles.typeRow}>
                    <Ionicons 
                      name={getTypeIcon(item.type)} 
                      size={20} 
                      color={getTypeColor(item.type)} 
                    />
                    <Text style={[styles.typeLabel, { color: getTypeColor(item.type) }]}>
                      {getTypeLabel(item.type)}
                    </Text>
                  </View>
                  <TouchableOpacity onPress={() => handleDelete(item.id)}>
                    <Ionicons name="trash-outline" size={20} color={colors.error} />
                  </TouchableOpacity>
                </View>

                <Text style={styles.timestamp}>
                  {format(new Date(item.timestamp), 'MMM d, yyyy • h:mm a')}
                </Text>

                <View style={styles.originalBox}>
                  <Text style={styles.originalLabel}>Original:</Text>
                  <Text style={styles.originalText} numberOfLines={3}>
                    {item.original || item.transcribed}
                  </Text>
                </View>

                {item.results && (
                  <View style={styles.resultsPreview}>
                    <Text style={styles.resultsLabel}>
                      ✨ {item.type === 'extract' ? 'Main Point' : 'Clear Version'}:
                    </Text>
                    <Text style={styles.resultsText} numberOfLines={2}>
                      {item.type === 'extract' 
                        ? item.results.mainPoint 
                        : item.results.clear}
                    </Text>
                  </View>
                )}
              </Card>
            ))}
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
  emptyContainer: {
    padding: spacing['3xl'],
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  emptyText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  startButton: {
    paddingHorizontal: spacing.xl,
  },
  section: {
    padding: spacing.lg,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
  },
  clearAllText: {
    fontSize: 14,
    color: colors.error,
    fontWeight: '600',
  },
  historyCard: {
    marginBottom: spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  typeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  typeLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  timestamp: {
    fontSize: 12,
    color: colors.textLight,
    marginBottom: spacing.md,
  },
  originalBox: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
  },
  originalLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  originalText: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  resultsPreview: {
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
    paddingLeft: spacing.md,
  },
  resultsLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  resultsText: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
});

export default HistoryScreen;
