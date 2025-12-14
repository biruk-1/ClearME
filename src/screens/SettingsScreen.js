import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, Alert, Switch, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import TextInput from '../components/TextInput';
import Button from '../components/Button';
import Card from '../components/Card';
import { getSettings, saveSettings, saveApiKey, getApiKey } from '../services/storageService';
import { colors, gradients } from '../theme/colors';
import { spacing, borderRadius } from '../theme/spacing';
import { useAuth } from '../context/AuthContext';

/**
 * Settings Screen - Basic Configuration
 */
const SettingsScreen = ({ navigation }) => {
  const [apiKey, setApiKey] = useState('');
  const [theme, setTheme] = useState('light');
  const [language, setLanguage] = useState('en');
  const [notifications, setNotifications] = useState(true);
  const [loading, setLoading] = useState(false);
  const { logout, user } = useAuth();

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const settings = await getSettings();
      const savedApiKey = await getApiKey();
      
      setTheme(settings.theme || 'light');
      setLanguage(settings.language || 'en');
      setNotifications(settings.notifications !== false);
      setApiKey(savedApiKey || '');
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const handleSaveSettings = async () => {
    setLoading(true);
    try {
      await saveSettings({
        theme,
        language,
        notifications
      });
      
      if (apiKey.trim()) {
        await saveApiKey(apiKey.trim());
      }
      
      Alert.alert('Success', 'Settings saved successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
            } catch (error) {
              Alert.alert('Error', 'Failed to logout');
            }
          }
        }
      ]
    );
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
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
            {user?.photoURL ? (
              <Image source={{ uri: user.photoURL }} style={styles.avatar} />
            ) : (
              <Ionicons name="person-circle-outline" size={40} color="#FFFFFF" />
            )}
            <View>
              <Text style={styles.title}>{user?.displayName || 'Settings'}</Text>
              <Text style={styles.subtitle}>{user?.email || 'Customize your experience'}</Text>
            </View>
          </View>
        </View>
      </LinearGradient>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          {/* API Configuration */}
          <Card variant="elevated" style={styles.settingCard}>
            <View style={styles.cardHeader}>
              <Ionicons name="key-outline" size={24} color={colors.primary} />
              <Text style={styles.cardTitle}>API Configuration</Text>
            </View>
            
            <TextInput
              label="OpenAI API Key"
              placeholder="sk-..."
              value={apiKey}
              onChangeText={setApiKey}
              secureTextEntry
            />
            
            <View style={styles.infoBox}>
              <Ionicons name="information-circle" size={20} color={colors.info} />
              <Text style={styles.infoText}>
                Get your API key from platform.openai.com
              </Text>
            </View>
          </Card>

          {/* Preferences */}
          <Card variant="elevated" style={styles.settingCard}>
            <View style={styles.cardHeader}>
              <Ionicons name="options-outline" size={24} color={colors.secondary} />
              <Text style={styles.cardTitle}>Preferences</Text>
            </View>

            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Notifications</Text>
                <Text style={styles.settingDescription}>
                  Get tips and reminders
                </Text>
              </View>
              <Switch
                value={notifications}
                onValueChange={setNotifications}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor="#FFFFFF"
              />
            </View>

            <View style={styles.divider} />

            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Theme</Text>
                <Text style={styles.settingDescription}>
                  {theme === 'light' ? 'Light Mode' : 'Dark Mode'}
                </Text>
              </View>
              <TouchableOpacity 
                style={styles.optionButton}
                onPress={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              >
                <Ionicons 
                  name={theme === 'light' ? 'sunny' : 'moon'} 
                  size={20} 
                  color={colors.primary} 
                />
              </TouchableOpacity>
            </View>

            <View style={styles.divider} />

            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Language</Text>
                <Text style={styles.settingDescription}>
                  {language === 'en' ? 'English' : language}
                </Text>
              </View>
              <TouchableOpacity style={styles.optionButton}>
                <Ionicons name="chevron-forward" size={20} color={colors.primary} />
              </TouchableOpacity>
            </View>
          </Card>

          {/* About */}
          <Card variant="elevated" style={styles.settingCard}>
            <View style={styles.cardHeader}>
              <Ionicons name="information-circle-outline" size={24} color={colors.success} />
              <Text style={styles.cardTitle}>About</Text>
            </View>

            <View style={styles.aboutRow}>
              <Text style={styles.aboutLabel}>Version</Text>
              <Text style={styles.aboutValue}>1.0.0</Text>
            </View>

            <View style={styles.aboutRow}>
              <Text style={styles.aboutLabel}>App Name</Text>
              <Text style={styles.aboutValue}>ClearMe</Text>
            </View>

            <View style={styles.aboutRow}>
              <Text style={styles.aboutLabel}>Developer</Text>
              <Text style={styles.aboutValue}>AI Communication Coach</Text>
            </View>
          </Card>

          {/* Actions */}
          <Card variant="elevated" style={styles.settingCard}>
            <TouchableOpacity style={styles.actionRow}>
              <Ionicons name="help-circle-outline" size={24} color={colors.info} />
              <Text style={styles.actionText}>Help & Support</Text>
              <Ionicons name="chevron-forward" size={20} color={colors.textLight} />
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity style={styles.actionRow}>
              <Ionicons name="document-text-outline" size={24} color={colors.info} />
              <Text style={styles.actionText}>Privacy Policy</Text>
              <Ionicons name="chevron-forward" size={20} color={colors.textLight} />
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity style={styles.actionRow}>
              <Ionicons name="star-outline" size={24} color={colors.warning} />
              <Text style={styles.actionText}>Rate App</Text>
              <Ionicons name="chevron-forward" size={20} color={colors.textLight} />
            </TouchableOpacity>
          </Card>

          <Button
            title="Save Settings"
            onPress={handleSaveSettings}
            variant="gradient"
            loading={loading}
            fullWidth
            icon={<Ionicons name="checkmark" size={20} color="#FFFFFF" />}
            style={styles.saveButton}
          />

          <Button
            title="Logout"
            onPress={handleLogout}
            variant="outline"
            fullWidth
            icon={<Ionicons name="log-out-outline" size={20} color={colors.error || '#EF4444'} />}
            style={styles.logoutButton}
            textStyle={{ color: colors.error || '#EF4444' }}
          />
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
    alignItems: 'flex-start',
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
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.8)'
  },
  content: {
    flex: 1,
  },
  section: {
    padding: spacing.lg,
  },
  settingCard: {
    marginBottom: spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginTop: spacing.sm,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  settingInfo: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  settingDescription: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  optionButton: {
    padding: spacing.sm,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.sm,
  },
  aboutRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  aboutLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  aboutValue: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.sm,
  },
  actionText: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
  },
  saveButton: {
    marginTop: spacing.lg,
  },
  logoutButton: {
    marginTop: spacing.md,
    borderColor: colors.error || '#EF4444',
    marginBottom: spacing.xl,
  },
});

export default SettingsScreen;
