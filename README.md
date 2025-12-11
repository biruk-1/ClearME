# ClearMe: AI Communication Coach 🗣️✨

**Transform messy communication into clear, professional language instantly.**

ClearMe is a React Native mobile app that helps users communicate more clearly and professionally using AI-powered text improvement, main point extraction, and voice-to-text clarity features.

---

## 🎯 MVP Features

### ✅ Core Features (Implemented)

1. **✍️ Improve Writing** - Primary Feature A
   - Paste any text and get 3 improved versions:
     - Clear Version (easy to understand)
     - Professional Version (business-ready)
     - Concise Version (brief and direct)
   - One-tap copy to clipboard
   - Character counter (up to 2000 chars)

2. **🎯 Extract Main Point** - Primary Feature B
   - Paste long text, emails, or articles
   - AI extracts:
     - Main Point (core message)
     - Summary (1-2 sentences)
     - Action Steps (what to do)
   - Perfect for long emails and meeting notes

3. **🎤 Voice to Clarity** - Primary Feature C
   - Record your voice
   - Automatic transcription
   - AI improves transcribed text
   - Get clear, professional, and concise versions
   - Animated recording interface

4. **💪 Daily Practice** - Secondary Feature D
   - AI-generated communication exercises
   - Submit your response
   - Get scored feedback (0-100)
   - Learn strengths and areas to improve

5. **📚 History** - Secondary Feature E
   - Save all improved texts
   - View past improvements
   - Delete individual items
   - Clear all history

6. **⚙️ Settings** - Basic Configuration
   - OpenAI API key configuration
   - Theme selection (Light/Dark)
   - Language preferences
   - Notifications toggle

---

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- OpenAI API Key ([Get one here](https://platform.openai.com))

### Installation

```bash
# 1. Install dependencies
npm install

# 2. Create .env file
cp .env.example .env

# 3. Add your OpenAI API key to .env
# OPENAI_API_KEY=your_key_here

# 4. Start the app
npx expo start

# 5. Run on device
# Press 'a' for Android
# Press 'i' for iOS
# Scan QR code with Expo Go app
```

### Run with Docker

Build and start the app in Docker (web mode by default):

```bash
docker compose build
docker compose up
```

Open http://localhost:8081 in your browser.

To run the Expo dev server instead of web, use:

```bash
docker compose run --service-ports clearme npm start
```

Environment variables are read from `.env`. Ensure your Firebase keys are present as documented in FIREBASE_SETUP.md.

### First-Time Setup

1. **Add API Key**
   - Open the app
   - Go to Settings tab
   - Enter your OpenAI API key
   - Tap "Save Settings"

2. **Grant Permissions**
   - Allow microphone access for Voice Clarity feature
   - Allow notifications (optional)

---

## 📱 App Structure

```
communication app/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Button.js
│   │   ├── Card.js
│   │   ├── TextInput.js
│   │   └── FeatureCard.js
│   ├── screens/             # App screens
│   │   ├── HomeScreen.js
│   │   ├── ImproveWritingScreen.js
│   │   ├── ExtractPointScreen.js
│   │   ├── VoiceClarityScreen.js
│   │   ├── DailyPracticeScreen.js
│   │   ├── HistoryScreen.js
│   │   └── SettingsScreen.js
│   ├── navigation/          # Navigation setup
│   │   └── AppNavigator.js
│   ├── services/            # Business logic
│   │   ├── aiService.js     # OpenAI API integration
│   │   ├── storageService.js # AsyncStorage operations
│   │   └── voiceService.js  # Voice recording & transcription
│   └── theme/               # Design system
│       ├── colors.js
│       ├── typography.js
│       └── spacing.js
├── App.js                   # Root component
├── package.json
├── app.json
└── README.md
```

---

## 🛠️ Tech Stack

### Frontend
- **React Native** - Mobile framework
- **Expo** - Development platform
- **React Navigation** - Navigation library
- **Expo Linear Gradient** - Gradient backgrounds
- **Ionicons** - Icon library

### Backend/Services
- **OpenAI API** - GPT-4o-mini for text improvement
- **Expo AV** - Audio recording
- **Expo Speech** - Text-to-speech (future)
- **AsyncStorage** - Local data persistence

### State Management
- React Hooks (useState, useEffect)
- AsyncStorage for persistence

---

## 🎨 Design System

### Color Palette
- **Primary**: #6366F1 (Indigo)
- **Secondary**: #8B5CF6 (Purple)
- **Success**: #10B981 (Green)
- **Warning**: #F59E0B (Amber)
- **Error**: #EF4444 (Red)

### Typography
- **Headings**: 700 weight, 24-36px
- **Body**: 400 weight, 16px
- **Captions**: 400 weight, 12-14px

### Spacing
- xs: 4px, sm: 8px, md: 16px, lg: 24px, xl: 32px

---

## 🔑 API Configuration

### OpenAI API Setup

1. **Get API Key**
   - Visit [platform.openai.com](https://platform.openai.com)
   - Sign up or log in
   - Go to API Keys section
   - Create new secret key

2. **Configure in App**
   - Option 1: Add to `.env` file
   - Option 2: Enter in Settings screen

3. **Update aiService.js**
   ```javascript
   // src/services/aiService.js
   const OPENAI_API_KEY = 'YOUR_API_KEY_HERE';
   ```

### Voice Transcription (Optional)

For production voice transcription, integrate one of:
- **OpenAI Whisper API** (Recommended)
- Google Cloud Speech-to-Text
- Azure Speech Services

See `src/services/voiceService.js` for integration guide.

---

## 📊 Features Breakdown

### 1. Improve Writing Screen

**User Flow:**
1. User types/pastes text
2. Taps "Improve" button
3. AI generates 3 versions
4. User copies desired version

**AI Prompt:**
```
Rewrite the following text to be clearer, grammatically correct, and professional.
Provide:
1. Clear Version
2. Professional Version
3. Concise Version
```

### 2. Extract Main Point Screen

**User Flow:**
1. User pastes long text
2. Taps "Extract" button
3. AI extracts key information
4. User views main point, summary, action steps

**AI Prompt:**
```
Extract the main point, summary, and action steps from this text.
```

### 3. Voice Clarity Screen

**User Flow:**
1. User taps mic button
2. Records voice
3. Taps again to stop
4. AI transcribes and improves
5. User views all versions

**Process:**
- Record audio → Transcribe → Improve → Display

### 4. Daily Practice Screen

**User Flow:**
1. App generates exercise
2. User writes response
3. Submits for feedback
4. Receives score and tips

**Scoring:**
- 80-100: Excellent
- 60-79: Good
- 0-59: Keep practicing

---

## 💾 Data Storage

### AsyncStorage Keys
- `@clearme_history` - Improved texts history
- `@clearme_settings` - App settings
- `@clearme_api_key` - OpenAI API key
- `@clearme_exercises` - Completed exercises

### History Item Structure
```javascript
{
  id: "timestamp",
  timestamp: "ISO date",
  type: "improve" | "extract" | "voice",
  original: "user text",
  results: { clear, professional, concise }
}
```

---

## 🧪 Testing

### Manual Testing Checklist

**Improve Writing:**
- [ ] Enter text and improve
- [ ] Copy each version
- [ ] Clear and start over
- [ ] Test with 2000 char limit

**Extract Point:**
- [ ] Paste long text
- [ ] Extract main point
- [ ] View action steps
- [ ] Copy results

**Voice Clarity:**
- [ ] Grant mic permission
- [ ] Record voice
- [ ] View transcription
- [ ] View improved versions

**Daily Practice:**
- [ ] Load exercise
- [ ] Submit response
- [ ] View feedback
- [ ] Try another exercise

**History:**
- [ ] View saved items
- [ ] Delete item
- [ ] Clear all history

**Settings:**
- [ ] Add API key
- [ ] Toggle notifications
- [ ] Change theme
- [ ] Save settings

---

## 🚧 Known Limitations

1. **Voice Transcription**: Currently uses mock data. Integrate Whisper API for production.
2. **API Key**: Must be entered manually in Settings or hardcoded in `aiService.js`.
3. **Offline Mode**: Requires internet connection for AI features.
4. **Rate Limits**: OpenAI API has rate limits. Monitor usage.

---

## 🔮 Future Enhancements

### Phase 2 Features
- [ ] Real-time conversation coach
- [ ] Email writer templates
- [ ] Tone selection (Formal, Friendly, Assertive)
- [ ] Multi-language support
- [ ] Dark mode implementation
- [ ] Export history to PDF
- [ ] Share improved text directly

### Phase 3 Features
- [ ] WhatsApp/Slack integration
- [ ] Live call assistant
- [ ] Weekly analytics dashboard
- [ ] Personalized coaching
- [ ] Team collaboration features

---

## 📝 Development Notes

### Adding New Features

1. **Create Screen**
   ```javascript
   // src/screens/NewFeatureScreen.js
   import React from 'react';
   // ... component code
   export default NewFeatureScreen;
   ```

2. **Add to Navigator**
   ```javascript
   // src/navigation/AppNavigator.js
   <Stack.Screen name="NewFeature" component={NewFeatureScreen} />
   ```

3. **Add to Home**
   ```javascript
   // src/screens/HomeScreen.js
   // Add feature card
   ```

### Customizing AI Prompts

Edit prompts in `src/services/aiService.js`:
```javascript
const prompt = `Your custom prompt here...`;
```

### Styling Guidelines

- Use theme colors from `src/theme/colors.js`
- Use spacing constants from `src/theme/spacing.js`
- Follow existing component patterns
- Use LinearGradient for headers
- Add shadows for elevation

---

## 🐛 Troubleshooting

### Common Issues

**1. "Failed to improve text" Error**
- Check API key is correct
- Verify internet connection
- Check OpenAI API status

**2. Voice Recording Not Working**
- Grant microphone permissions
- Check device microphone
- Restart app

**3. App Won't Start**
```bash
# Clear cache and restart
npx expo start --clear
```

**4. Dependencies Issues**
```bash
# Reinstall dependencies
rm -rf node_modules
npm install
```

---

## 📄 License

MIT License - Feel free to use for personal or commercial projects.

---

## 👨‍💻 Developer

Built with ❤️ using React Native + Expo + OpenAI

**Contact**: [Your contact info]

---

## 🙏 Acknowledgments

- OpenAI for GPT-4o API
- Expo team for amazing tools
- React Native community

---

## 📚 Additional Resources

- [OpenAI API Docs](https://platform.openai.com/docs)
- [Expo Documentation](https://docs.expo.dev)
- [React Navigation](https://reactnavigation.org)
- [React Native Docs](https://reactnative.dev)

---

**Ready to communicate clearly? Let's get started! 🚀**
#   C l e a r M E 
 
 