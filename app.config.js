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
      ]
    ],
    extra: {
      // Grok (Groq) API Keys - tried in order, first working key is used
      GROK_API_KEY_PRIMARY: process.env.GROK_API_KEY_PRIMARY,
      GROK_API_KEY_2: process.env.GROK_API_KEY_2,
      GROK_API_KEY_3: process.env.GROK_API_KEY_3,
      GROK_API_KEY_4: process.env.GROK_API_KEY_4,
      // OpenAI API Key - fallback if all Grok keys fail
      OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    }
  }
};
