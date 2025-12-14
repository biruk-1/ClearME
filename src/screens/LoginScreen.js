import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import Constants from 'expo-constants';
import { auth } from '../config/firebase';
import { GoogleAuthProvider, signInWithCredential, signInWithPopup } from 'firebase/auth';

// Complete auth session on web to close the popup/tab
WebBrowser.maybeCompleteAuthSession();

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);
  const { login, resetPassword } = useAuth();

  // Configure Google Auth Request on native only (web uses Firebase popup)
  let request = null, response = null, promptAsync = async () => {};
  if (Platform.OS !== 'web') {
    [request, response, promptAsync] = Google.useAuthRequest({
      expoClientId: Constants?.expoConfig?.extra?.GOOGLE_EXPO_CLIENT_ID,
      androidClientId: Constants?.expoConfig?.extra?.GOOGLE_ANDROID_CLIENT_ID,
      iosClientId: Constants?.expoConfig?.extra?.GOOGLE_IOS_CLIENT_ID,
    });

    useEffect(() => {
      const handleGoogleResponse = async () => {
        if (response?.type === 'success') {
          try {
            const { idToken, accessToken } = response.authentication || {};
            if (!idToken) {
              throw new Error('Missing Google ID token');
            }
            const credential = GoogleAuthProvider.credential(idToken, accessToken);
            await signInWithCredential(auth, credential);
          } catch (error) {
            Alert.alert('Google Sign-In Error', error.message);
          }
        } else if (response?.type === 'error') {
          Alert.alert('Google Sign-In Error', 'Authentication failed.');
        }
      };
      handleGoogleResponse();
    }, [response]);
  }

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
    } catch (error) {
      Alert.alert('Login Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const isValidEmail = (value) => {
    const re = /^\S+@\S+\.\S+$/;
    return re.test(String(value).toLowerCase());
  };

  const handleForgotPassword = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email address to reset password');
      return;
    }

    if (!isValidEmail(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    setForgotLoading(true);
    try {
      await resetPassword(email);
      // Always show a generic success message to avoid account enumeration
      Alert.alert(
        'Success',
        'If an account exists for this email, a reset link has been sent. Please check your inbox.',
        [
          {
            text: 'OK',
            onPress: () => {
              // We are already on the Login screen; no further navigation needed
              // This satisfies "redirect back to login" requirement when coming from a link/screen
            },
          },
        ]
      );
    } catch (error) {
      // Show the same success message even on error to prevent information disclosure
      Alert.alert(
        'Success',
        'If an account exists for this email, a reset link has been sent. Please check your inbox.',
        [
          {
            text: 'OK',
            onPress: () => {}
          },
        ]
      );
    } finally {
      setForgotLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      if (Platform.OS === 'web') {
        // On web, use Firebase popup flow
        const provider = new GoogleAuthProvider();
        await signInWithPopup(auth, provider);
        return;
      }
      // On native, use Expo Auth Session
      await promptAsync();
    } catch (error) {
      Alert.alert('Google Sign-In Error', error.message);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Sign in to continue</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Ionicons name="mail-outline" size={20} color={colors.textLight} style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor={colors.textLight}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color={colors.textLight} style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor={colors.textLight}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <TouchableOpacity 
            style={styles.forgotPasswordButton}
            onPress={() => navigation.navigate('ForgotPassword')}
          >
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.button} 
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Login</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.button, styles.googleButton]}
            onPress={handleGoogleLogin}
            disabled={Platform.OS !== 'web' && !request}
          >
            <Text style={styles.buttonText}>Login with Google</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.linkButton} 
            onPress={() => navigation.navigate('Signup')}
          >
            <Text style={styles.linkText}>Don't have an account? Sign Up</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: spacing.lg,
  },
  header: {
    marginBottom: spacing.xl,
    alignItems: 'center',
  },
  title: {
    ...typography.h1,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.body,
    color: colors.textLight,
  },
  form: {
    width: '100%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    marginBottom: spacing.md,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    height: 56,
  },
  icon: {
    marginRight: spacing.sm,
  },
  input: {
    flex: 1,
    color: colors.text,
    fontSize: 16,
  },
  forgotPasswordButton: {
    alignSelf: 'flex-end',
    marginBottom: spacing.md,
  },
  forgotPasswordText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '500',
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.md,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  googleButton: {
    backgroundColor: '#4285F4',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  linkButton: {
    marginTop: spacing.lg,
    alignItems: 'center',
  },
  linkText: {
    color: colors.primary,
    fontSize: 16,
  },
  disabledLink: {
    opacity: 0.6,
  },
});

export default LoginScreen;
