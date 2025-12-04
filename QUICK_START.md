# 🚀 ClearMe - Quick Start Guide

Get up and running in **5 minutes**!

---

## Step 1: Install Dependencies (2 min)

```bash
# Navigate to project folder
cd "communication app"

# Install all dependencies
npm install
```

**What gets installed:**
- React Native & Expo
- Navigation libraries
- OpenAI integration
- Voice recording tools
- UI components

---

## Step 2: Get OpenAI API Key (1 min)

1. Visit: https://platform.openai.com
2. Sign up or log in
3. Go to **API Keys** section
4. Click **"Create new secret key"**
5. Copy the key (starts with `sk-...`)

**Important:** Keep your API key secure! Never commit it to public repos.

---

## Step 3: Configure API Key (1 min)

### Option A: Use .env file (Recommended)

```bash
# Create .env file
cp .env.example .env

# Edit .env and add your key
OPENAI_API_KEY=sk-your-actual-key-here
```

### Option B: Add in Settings Screen

1. Start the app
2. Go to Settings tab
3. Enter API key
4. Tap "Save Settings"

### Option C: Hardcode (Quick Testing Only)

Edit `src/services/aiService.js`:
```javascript
const OPENAI_API_KEY = 'sk-your-actual-key-here';
```

---

## Step 4: Start the App (1 min)

```bash
# Start Expo development server
npx expo start
```

**You'll see:**
```
› Metro waiting on exp://192.168.x.x:8081
› Scan the QR code above with Expo Go (Android) or the Camera app (iOS)

› Press a │ open Android
› Press i │ open iOS simulator
› Press w │ open web
```

---

## Step 5: Run on Device

### Android
```bash
# Option 1: Physical device
# Install Expo Go from Play Store
# Scan QR code in terminal

# Option 2: Emulator
# Press 'a' in terminal
```

### iOS
```bash
# Option 1: Physical device
# Install Expo Go from App Store
# Scan QR code with Camera app

# Option 2: Simulator
# Press 'i' in terminal
```

---

## ✅ First-Time Setup

### 1. Grant Permissions

When prompted, allow:
- ✅ Microphone access (for Voice Clarity)
- ✅ Notifications (optional)

### 2. Test Features

**Test Improve Writing:**
1. Tap "Improve Writing"
2. Type: "hey can u help me with this thing i need to do it fast"
3. Tap "Improve"
4. See 3 improved versions!

**Test Extract Point:**
1. Tap "Extract Main Point"
2. Paste a long email or article
3. Tap "Extract"
4. See main point, summary, and action steps!

**Test Voice Clarity:**
1. Tap "Voice to Clarity"
2. Tap mic button
3. Say: "I need help with the project deadline"
4. Tap again to stop
5. See transcription and improved versions!

---

## 🎯 Quick Tips

### For Best Results

**Writing Improvement:**
- Be specific about what you want to say
- Include relevant context
- Don't worry about grammar - AI fixes it!

**Main Point Extraction:**
- Works best with 100+ words
- Great for emails, articles, meeting notes
- Extracts actionable steps

**Voice Clarity:**
- Speak clearly at normal pace
- Find a quiet environment
- Keep recordings under 2 minutes

---

## 🐛 Troubleshooting

### "Failed to improve text"
```bash
# Check API key is correct
# Verify internet connection
# Check OpenAI API status: status.openai.com
```

### "Microphone permission denied"
```bash
# Android: Settings > Apps > ClearMe > Permissions > Microphone
# iOS: Settings > ClearMe > Microphone
```

### App won't start
```bash
# Clear cache
npx expo start --clear

# Reinstall dependencies
rm -rf node_modules
npm install
```

### Dependencies error
```bash
# Make sure you're in the right folder
cd "communication app"

# Install missing packages
npm install
```

---

## 📱 Navigation Guide

### Bottom Tabs
- **Home** - Main features
- **History** - View saved improvements
- **Settings** - Configure app

### Feature Screens
- **Improve Writing** - Get 3 improved versions
- **Extract Main Point** - Find key message
- **Voice to Clarity** - Record and improve
- **Daily Practice** - Communication exercises

---

## 💡 Usage Examples

### Example 1: Improve Email
**Input:**
```
hey boss i wanted to ask if i can take friday off 
cause i got some stuff to do thanks
```

**Output (Professional):**
```
Dear [Manager's Name],

I would like to request Friday off to attend to 
some personal matters. Please let me know if this 
is possible.

Thank you for your consideration.
```

### Example 2: Extract from Long Email
**Input:**
```
[500 word email about project updates, deadlines, 
team changes, budget concerns, and action items]
```

**Output:**
- **Main Point:** Project deadline moved to next month
- **Summary:** Team restructuring requires budget review
- **Actions:** 
  1. Review budget by Friday
  2. Schedule team meeting
  3. Update project timeline

### Example 3: Voice to Text
**Voice Input:**
```
"um so like I was thinking maybe we could 
you know try to finish this by tomorrow 
if that's okay with everyone"
```

**Output (Clear):**
```
I suggest we aim to complete this by tomorrow 
if everyone agrees.
```

---

## 🎨 Customization

### Change Colors
Edit `src/theme/colors.js`:
```javascript
export const colors = {
  primary: '#YOUR_COLOR',
  // ... other colors
};
```

### Modify AI Prompts
Edit `src/services/aiService.js`:
```javascript
const prompt = `Your custom instructions...`;
```

### Add New Features
1. Create screen in `src/screens/`
2. Add to `src/navigation/AppNavigator.js`
3. Add feature card to `HomeScreen.js`

---

## 📊 Cost Estimates

### OpenAI API Pricing (GPT-4o-mini)
- **Input:** $0.15 per 1M tokens (~750,000 words)
- **Output:** $0.60 per 1M tokens (~750,000 words)

**Typical Usage:**
- Improve Writing: ~$0.001 per request
- Extract Point: ~$0.002 per request
- Voice Clarity: ~$0.001 per request

**Monthly Estimate:**
- 100 requests/day = ~$3-5/month
- 500 requests/day = ~$15-25/month

---

## 🚀 Next Steps

### After Setup

1. **Explore All Features**
   - Try each feature with different text types
   - Save useful improvements to History
   - Complete Daily Practice exercises

2. **Customize Settings**
   - Set preferred theme
   - Configure notifications
   - Adjust language preferences

3. **Share Feedback**
   - Report bugs
   - Suggest features
   - Rate the app

### For Developers

1. **Read Full Documentation**
   - See `README.md` for complete guide
   - Check `API_INTEGRATION.md` for API details

2. **Explore Codebase**
   - Review component structure
   - Understand service architecture
   - Check theme system

3. **Build New Features**
   - Add tone selection
   - Implement dark mode
   - Create export functionality

---

## 📞 Support

### Need Help?

**Common Issues:**
- API key not working → Check it's correct and has credits
- Voice not recording → Grant microphone permission
- App crashes → Clear cache and restart

**Resources:**
- README.md - Full documentation
- OpenAI Docs - API reference
- Expo Docs - Platform guides

---

## ✅ Success Checklist

- [ ] Dependencies installed
- [ ] OpenAI API key configured
- [ ] App running on device
- [ ] Permissions granted
- [ ] Tested Improve Writing
- [ ] Tested Extract Point
- [ ] Tested Voice Clarity
- [ ] Checked History
- [ ] Configured Settings

---

**🎉 You're all set! Start communicating clearly!**

---

## 🔗 Quick Links

- [OpenAI Platform](https://platform.openai.com)
- [Expo Documentation](https://docs.expo.dev)
- [React Native Docs](https://reactnative.dev)
- [OpenAI Pricing](https://openai.com/pricing)

---

**Questions? Issues? Check README.md for detailed troubleshooting!**
