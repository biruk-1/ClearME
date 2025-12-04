# 🔌 API Integration Guide

Complete guide for integrating OpenAI and voice transcription APIs.

---

## 📋 Table of Contents

1. [OpenAI API Setup](#openai-api-setup)
2. [Voice Transcription Integration](#voice-transcription-integration)
3. [API Service Architecture](#api-service-architecture)
4. [Error Handling](#error-handling)
5. [Rate Limiting](#rate-limiting)
6. [Cost Optimization](#cost-optimization)

---

## 🤖 OpenAI API Setup

### 1. Get API Key

```bash
# Visit OpenAI Platform
https://platform.openai.com

# Steps:
1. Sign up or log in
2. Go to API Keys section
3. Create new secret key
4. Copy key (starts with sk-...)
5. Add billing method
6. Set usage limits (recommended)
```

### 2. Configure in App

**Option A: Environment Variable**
```javascript
// .env
OPENAI_API_KEY=sk-your-key-here
OPENAI_MODEL=gpt-4o-mini

// Access in code
const API_KEY = process.env.OPENAI_API_KEY;
```

**Option B: Direct Configuration**
```javascript
// src/services/aiService.js
const OPENAI_API_KEY = 'sk-your-key-here';
const MODEL = 'gpt-4o-mini'; // or 'gpt-4o' for better quality
```

### 3. API Request Structure

```javascript
import axios from 'axios';

const response = await axios.post(
  'https://api.openai.com/v1/chat/completions',
  {
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: 'You are a communication coach.'
      },
      {
        role: 'user',
        content: 'Improve this text: ...'
      }
    ],
    temperature: 0.7,
    max_tokens: 1000
  },
  {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`
    }
  }
);
```

---

## 🎤 Voice Transcription Integration

### Option 1: OpenAI Whisper API (Recommended)

**Setup:**
```javascript
// src/services/voiceService.js

export const transcribeAudio = async (audioUri) => {
  const formData = new FormData();
  
  formData.append('file', {
    uri: audioUri,
    type: 'audio/m4a',
    name: 'recording.m4a'
  });
  
  formData.append('model', 'whisper-1');
  formData.append('language', 'en'); // Optional
  
  const response = await fetch(
    'https://api.openai.com/v1/audio/transcriptions',
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: formData
    }
  );
  
  const data = await response.json();
  return data.text;
};
```

**Pricing:**
- $0.006 per minute of audio
- Supports 50+ languages
- High accuracy

### Option 2: Google Cloud Speech-to-Text

**Setup:**
```bash
# Install SDK
npm install @google-cloud/speech
```

**Code:**
```javascript
import { SpeechClient } from '@google-cloud/speech';

const client = new SpeechClient({
  keyFilename: 'path/to/service-account-key.json'
});

export const transcribeAudio = async (audioUri) => {
  const audio = {
    uri: audioUri
  };
  
  const config = {
    encoding: 'LINEAR16',
    sampleRateHertz: 16000,
    languageCode: 'en-US',
  };
  
  const request = {
    audio: audio,
    config: config,
  };
  
  const [response] = await client.recognize(request);
  const transcription = response.results
    .map(result => result.alternatives[0].transcript)
    .join('\n');
    
  return transcription;
};
```

**Pricing:**
- $0.006 per 15 seconds
- 125+ languages
- Real-time streaming available

### Option 3: Azure Speech Services

**Setup:**
```bash
# Install SDK
npm install microsoft-cognitiveservices-speech-sdk
```

**Code:**
```javascript
import * as sdk from 'microsoft-cognitiveservices-speech-sdk';

export const transcribeAudio = async (audioUri) => {
  const speechConfig = sdk.SpeechConfig.fromSubscription(
    'YOUR_SUBSCRIPTION_KEY',
    'YOUR_REGION'
  );
  
  const audioConfig = sdk.AudioConfig.fromWavFileInput(audioUri);
  const recognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig);
  
  return new Promise((resolve, reject) => {
    recognizer.recognizeOnceAsync(
      result => {
        resolve(result.text);
        recognizer.close();
      },
      error => {
        reject(error);
        recognizer.close();
      }
    );
  });
};
```

**Pricing:**
- $1 per audio hour
- 100+ languages
- Custom models available

---

## 🏗️ API Service Architecture

### Current Structure

```
src/services/
├── aiService.js          # OpenAI API calls
├── voiceService.js       # Voice recording & transcription
└── storageService.js     # Local data persistence
```

### aiService.js Functions

```javascript
// 1. Improve Text
export const improveText = async (text) => {
  // Returns: { clear, professional, concise }
};

// 2. Extract Main Point
export const extractMainPoint = async (text) => {
  // Returns: { mainPoint, summary, actionSteps }
};

// 3. Improve Voice Text
export const improveVoiceText = async (transcribedText) => {
  // Returns: { clear, professional, concise }
};

// 4. Generate Daily Exercise
export const generateDailyExercise = async () => {
  // Returns: { title, task, content, hint }
};

// 5. Evaluate Practice
export const evaluatePractice = async (exercise, userResponse) => {
  // Returns: { score, feedback, strengths, improvements }
};
```

### Adding New AI Features

```javascript
// Example: Add tone selection
export const improveTextWithTone = async (text, tone) => {
  const toneInstructions = {
    formal: 'Use formal business language',
    friendly: 'Use warm, friendly language',
    assertive: 'Use confident, direct language',
    simple: 'Use simple, easy-to-understand language'
  };
  
  const prompt = `${toneInstructions[tone]}. 
  Rewrite: "${text}"`;
  
  // ... API call
};
```

---

## 🛡️ Error Handling

### Comprehensive Error Handling

```javascript
export const improveText = async (text) => {
  try {
    // Validate input
    if (!text || text.trim().length === 0) {
      throw new Error('Text cannot be empty');
    }
    
    if (text.length > 5000) {
      throw new Error('Text too long. Maximum 5000 characters.');
    }
    
    // Make API call
    const response = await axios.post(/* ... */);
    
    // Validate response
    if (!response.data || !response.data.choices) {
      throw new Error('Invalid API response');
    }
    
    return parseResponse(response.data);
    
  } catch (error) {
    // Handle specific errors
    if (error.response) {
      // API error
      const status = error.response.status;
      
      if (status === 401) {
        throw new Error('Invalid API key. Please check your settings.');
      } else if (status === 429) {
        throw new Error('Rate limit exceeded. Please try again later.');
      } else if (status === 500) {
        throw new Error('OpenAI service error. Please try again.');
      }
    } else if (error.request) {
      // Network error
      throw new Error('Network error. Please check your connection.');
    }
    
    // Generic error
    throw new Error(error.message || 'Failed to improve text');
  }
};
```

### User-Friendly Error Messages

```javascript
const ERROR_MESSAGES = {
  NO_API_KEY: 'Please add your OpenAI API key in Settings',
  INVALID_API_KEY: 'Invalid API key. Please check your settings.',
  RATE_LIMIT: 'Too many requests. Please wait a moment.',
  NETWORK_ERROR: 'Network error. Please check your connection.',
  SERVICE_ERROR: 'Service temporarily unavailable. Please try again.',
  INVALID_INPUT: 'Please enter valid text to improve.',
};
```

---

## ⏱️ Rate Limiting

### OpenAI Rate Limits

**Free Tier:**
- 3 requests per minute
- 200 requests per day

**Paid Tier:**
- 3,500 requests per minute
- No daily limit

### Implementing Rate Limiting

```javascript
// Simple rate limiter
class RateLimiter {
  constructor(maxRequests, timeWindow) {
    this.maxRequests = maxRequests;
    this.timeWindow = timeWindow;
    this.requests = [];
  }
  
  async checkLimit() {
    const now = Date.now();
    
    // Remove old requests
    this.requests = this.requests.filter(
      time => now - time < this.timeWindow
    );
    
    // Check limit
    if (this.requests.length >= this.maxRequests) {
      const oldestRequest = this.requests[0];
      const waitTime = this.timeWindow - (now - oldestRequest);
      throw new Error(`Rate limit exceeded. Wait ${waitTime}ms`);
    }
    
    // Add new request
    this.requests.push(now);
  }
}

// Usage
const limiter = new RateLimiter(3, 60000); // 3 per minute

export const improveText = async (text) => {
  await limiter.checkLimit();
  // ... API call
};
```

### Queue System

```javascript
// Request queue for better UX
class RequestQueue {
  constructor() {
    this.queue = [];
    this.processing = false;
  }
  
  async add(request) {
    return new Promise((resolve, reject) => {
      this.queue.push({ request, resolve, reject });
      this.process();
    });
  }
  
  async process() {
    if (this.processing || this.queue.length === 0) return;
    
    this.processing = true;
    const { request, resolve, reject } = this.queue.shift();
    
    try {
      const result = await request();
      resolve(result);
    } catch (error) {
      reject(error);
    } finally {
      this.processing = false;
      setTimeout(() => this.process(), 1000); // 1 second delay
    }
  }
}
```

---

## 💰 Cost Optimization

### 1. Use Efficient Models

```javascript
// Cost comparison (per 1M tokens)
const MODELS = {
  'gpt-4o': { input: 5.00, output: 15.00 },      // Best quality
  'gpt-4o-mini': { input: 0.15, output: 0.60 },  // Best value
  'gpt-3.5-turbo': { input: 0.50, output: 1.50 } // Balanced
};

// Use mini for most features
const MODEL = 'gpt-4o-mini';
```

### 2. Optimize Prompts

```javascript
// ❌ Inefficient (verbose prompt)
const prompt = `
Please help me improve this text. I want you to make it 
clearer and more professional. Also make it concise. 
Here is the text: "${text}"
Please provide three versions...
`;

// ✅ Efficient (concise prompt)
const prompt = `Rewrite clearly, professionally, concisely: "${text}"`;
```

### 3. Limit Token Usage

```javascript
const response = await axios.post(url, {
  model: 'gpt-4o-mini',
  messages: messages,
  max_tokens: 500,        // Limit output
  temperature: 0.7,
  presence_penalty: 0.1,  // Reduce repetition
});
```

### 4. Cache Common Responses

```javascript
const cache = new Map();

export const improveText = async (text) => {
  // Check cache
  const cacheKey = text.trim().toLowerCase();
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey);
  }
  
  // Make API call
  const result = await callAPI(text);
  
  // Store in cache
  cache.set(cacheKey, result);
  
  return result;
};
```

### 5. Batch Requests

```javascript
// Instead of 3 separate calls
const clear = await improveText(text, 'clear');
const professional = await improveText(text, 'professional');
const concise = await improveText(text, 'concise');

// Make 1 call with all instructions
const result = await improveTextAll(text);
// Returns: { clear, professional, concise }
```

### Cost Monitoring

```javascript
// Track API usage
class UsageTracker {
  constructor() {
    this.totalTokens = 0;
    this.totalCost = 0;
  }
  
  track(inputTokens, outputTokens, model) {
    const pricing = MODELS[model];
    const cost = 
      (inputTokens / 1000000) * pricing.input +
      (outputTokens / 1000000) * pricing.output;
    
    this.totalTokens += inputTokens + outputTokens;
    this.totalCost += cost;
    
    console.log(`Cost: $${cost.toFixed(4)}`);
    console.log(`Total: $${this.totalCost.toFixed(2)}`);
  }
}
```

---

## 🧪 Testing APIs

### Test OpenAI Connection

```javascript
export const testAPIConnection = async () => {
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: 'Say "OK"' }],
        max_tokens: 5
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`
        }
      }
    );
    
    return response.data.choices[0].message.content === 'OK';
  } catch (error) {
    console.error('API test failed:', error);
    return false;
  }
};
```

### Mock API for Development

```javascript
// Use mock responses during development
const USE_MOCK = false; // Set to true for testing without API

export const improveText = async (text) => {
  if (USE_MOCK) {
    return {
      clear: `Clear version of: ${text}`,
      professional: `Professional version of: ${text}`,
      concise: `Concise version of: ${text}`
    };
  }
  
  // Real API call
  return await callOpenAI(text);
};
```

---

## 📊 API Response Examples

### Improve Text Response

```json
{
  "id": "chatcmpl-123",
  "object": "chat.completion",
  "created": 1677652288,
  "model": "gpt-4o-mini",
  "choices": [{
    "index": 0,
    "message": {
      "role": "assistant",
      "content": "{\"clear\":\"...\",\"professional\":\"...\",\"concise\":\"...\"}"
    },
    "finish_reason": "stop"
  }],
  "usage": {
    "prompt_tokens": 50,
    "completion_tokens": 100,
    "total_tokens": 150
  }
}
```

### Whisper Transcription Response

```json
{
  "text": "This is the transcribed text from the audio file."
}
```

---

## 🔗 Useful Links

- [OpenAI API Docs](https://platform.openai.com/docs)
- [OpenAI Pricing](https://openai.com/pricing)
- [Whisper API](https://platform.openai.com/docs/guides/speech-to-text)
- [Google Speech-to-Text](https://cloud.google.com/speech-to-text)
- [Azure Speech](https://azure.microsoft.com/en-us/services/cognitive-services/speech-to-text/)

---

**Ready to integrate? Start with OpenAI API and add voice transcription later!**
