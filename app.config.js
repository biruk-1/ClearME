import 'dotenv/config';

export default {
  expo: {
    name: "ClearMe",
    slug: "clearme-ai-coach",
    version: "1.0.0",
    orientation: "portrait",
    userInterfaceStyle: "automatic",
    splash: {
      resizeMode: "contain",
      backgroundColor: "#6366F1"
    },
    assetBundlePatterns: [
      "**/*"
    ],
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.clearme.aicoach"
    },
    android: {
      adaptiveIcon: {
        backgroundColor: "#6366F1"
      },
      package: "com.clearme.aicoach",
      permissions: [
        "android.permission.RECORD_AUDIO",
        "android.permission.INTERNET"
      ]
    },
    web: {
      bundler: "metro"
    },
    plugins: [
      [
        "expo-av",
        {
          microphonePermission: "Allow ClearMe to access your microphone for voice clarity features."
        }
      ],
      // Required for OAuth flows using Expo Auth Session
      "expo-web-browser"
    ],
    extra: {
      // Grok (Groq) API Keys - tried in order, first working key is used
      GROK_API_KEY_PRIMARY: process.env.GROK_API_KEY_PRIMARY,
      GROK_API_KEY_2: process.env.GROK_API_KEY_2,
      GROK_API_KEY_3: process.env.GROK_API_KEY_3,
      GROK_API_KEY_4: process.env.GROK_API_KEY_4,
      // OpenAI API Key - fallback if all Grok keys fail
      OPENAI_API_KEY: process.env.OPENAI_API_KEY,
      // Firebase Configuration
      FIREBASE_API_KEY: process.env.FIREBASE_API_KEY,
      FIREBASE_AUTH_DOMAIN: process.env.FIREBASE_AUTH_DOMAIN,
      FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
      FIREBASE_STORAGE_BUCKET: process.env.FIREBASE_STORAGE_BUCKET,
      FIREBASE_MESSAGING_SENDER_ID: process.env.FIREBASE_MESSAGING_SENDER_ID,
      FIREBASE_APP_ID: process.env.FIREBASE_APP_ID,
      FIREBASE_MEASUREMENT_ID: process.env.FIREBASE_MEASUREMENT_ID,
      // Google OAuth Client IDs for Expo Auth Session
      GOOGLE_EXPO_CLIENT_ID: process.env.GOOGLE_EXPO_CLIENT_ID,
      GOOGLE_ANDROID_CLIENT_ID: process.env.GOOGLE_ANDROID_CLIENT_ID,
      GOOGLE_IOS_CLIENT_ID: process.env.GOOGLE_IOS_CLIENT_ID,
      GOOGLE_WEB_CLIENT_ID: process.env.GOOGLE_WEB_CLIENT_ID,
    }
  }
};
