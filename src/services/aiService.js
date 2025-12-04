import axios from 'axios';

/**
 * AI Service for ClearMe
 * Handles all OpenAI API interactions
 */

import Constants from 'expo-constants';

// API Configuration - Keys loaded from app.config.js extra field
// Grok (Groq) is tried first, then falls back to OpenAI
const GROK_API_KEYS = [
  Constants.expoConfig?.extra?.GROK_API_KEY_PRIMARY,
  Constants.expoConfig?.extra?.GROK_API_KEY_2,
  Constants.expoConfig?.extra?.GROK_API_KEY_3,
  Constants.expoConfig?.extra?.GROK_API_KEY_4,
].filter(Boolean);

const OPENAI_API_KEY = Constants.expoConfig?.extra?.OPENAI_API_KEY || '';
const GROK_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';
const GROK_MODEL = 'llama-3.1-70b-versatile'; // Groq's fast model
const OPENAI_MODEL = 'gpt-4o-mini'; // Fallback model

/**
 * Make API call with Grok keys first, then fallback to OpenAI
 */
const callAI = async (messages, temperature = 0.7, maxTokens = 1000) => {
  // Try Grok keys first
  for (let i = 0; i < GROK_API_KEYS.length; i++) {
    try {
      const response = await axios.post(
        GROK_API_URL,
        {
          model: GROK_MODEL,
          messages,
          temperature,
          max_tokens: maxTokens
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${GROK_API_KEYS[i]}`
          }
        }
      );
      return response.data.choices[0].message.content;
    } catch (error) {
      console.log(`Grok key ${i + 1} failed:`, error.response?.status || error.message);
      // Continue to next key
    }
  }

  // Fallback to OpenAI
  if (OPENAI_API_KEY) {
    try {
      const response = await axios.post(
        OPENAI_API_URL,
        {
          model: OPENAI_MODEL,
          messages,
          temperature,
          max_tokens: maxTokens
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENAI_API_KEY}`
          }
        }
      );
      return response.data.choices[0].message.content;
    } catch (error) {
      console.error('OpenAI fallback failed:', error.response?.data || error.message);
    }
  }

  throw new Error('All AI providers failed. Please check your API keys in Settings.');
};

/**
 * Improve text with AI - generates clear, professional, and concise versions
 */
export const improveText = async (text) => {
  try {
    const prompt = `Rewrite the following text to be clearer, grammatically correct, and professional. 
Preserve the original meaning. Provide three versions:

1. Clear Version: Make it easy to understand with proper grammar
2. Professional Version: Make it suitable for business/formal communication
3. Concise Version: Make it brief while keeping the key message

Text: "${text}"

Format your response as JSON:
{
  "clear": "...",
  "professional": "...",
  "concise": "..."
}`;

    const content = await callAI([
      {
        role: 'system',
        content: 'You are a professional communication coach. Help users write clearly and professionally. Always respond with valid JSON only.'
      },
      {
        role: 'user',
        content: prompt
      }
    ], 0.7, 1000);
    
    // Try to parse JSON from response
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (e) {
      console.log('JSON parse failed, using fallback');
    }

    // Fallback: return the content as clear version
    return {
      clear: content,
      professional: content,
      concise: content
    };

  } catch (error) {
    console.error('AI Service Error:', error.response?.data || error.message);
    throw new Error('Failed to improve text. Please check your API key and try again.');
  }
};

/**
 * Extract main point from text
 */
export const extractMainPoint = async (text) => {
  try {
    const prompt = `Extract the main point, summary, and action steps from this text:

"${text}"

Format your response as JSON:
{
  "mainPoint": "The core message in one sentence",
  "summary": "A brief 1-2 sentence summary",
  "actionSteps": ["step 1", "step 2", "step 3"]
}`;

    const content = await callAI([
      {
        role: 'system',
        content: 'You are an expert at extracting key information from text. Always respond with valid JSON only.'
      },
      {
        role: 'user',
        content: prompt
      }
    ], 0.5, 500);
    
    // Try to parse JSON from response
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (e) {
      console.log('JSON parse failed, using fallback');
    }

    // Fallback
    return {
      mainPoint: content,
      summary: content,
      actionSteps: []
    };

  } catch (error) {
    console.error('AI Service Error:', error.response?.data || error.message);
    throw new Error('Failed to extract main point. Please check your API key and try again.');
  }
};

/**
 * Improve transcribed voice text
 */
export const improveVoiceText = async (transcribedText) => {
  // Use the same improve text function
  return improveText(transcribedText);
};

/**
 * Generate daily practice exercise
 */
export const generateDailyExercise = async () => {
  try {
    const prompt = `Generate a short communication practice exercise. Include:
1. A task (e.g., "Summarize this paragraph clearly")
2. Sample text or scenario
3. What the user should do

Format as JSON:
{
  "title": "Exercise title",
  "task": "What to do",
  "content": "Sample text or scenario",
  "hint": "A helpful tip"
}`;

    const content = await callAI([
      {
        role: 'system',
        content: 'You are a communication coach creating practice exercises. Always respond with valid JSON only.'
      },
      {
        role: 'user',
        content: prompt
      }
    ], 0.8, 400);
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }

    return {
      title: 'Daily Practice',
      task: 'Improve your communication',
      content: content,
      hint: 'Be clear and concise'
    };

  } catch (error) {
    console.error('AI Service Error:', error.response?.data || error.message);
    throw new Error('Failed to generate exercise.');
  }
};

/**
 * Evaluate user's practice attempt
 */
export const evaluatePractice = async (exercise, userResponse) => {
  try {
    const prompt = `Evaluate this communication practice:

Exercise: ${exercise.task}
Original: ${exercise.content}
User's Response: "${userResponse}"

Provide constructive feedback as JSON:
{
  "score": 85,
  "feedback": "Your response was...",
  "strengths": ["point 1", "point 2"],
  "improvements": ["suggestion 1", "suggestion 2"]
}`;

    const content = await callAI([
      {
        role: 'system',
        content: 'You are a supportive communication coach providing feedback. Always respond with valid JSON only.'
      },
      {
        role: 'user',
        content: prompt
      }
    ], 0.6, 500);
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }

    return {
      score: 75,
      feedback: content,
      strengths: [],
      improvements: []
    };

  } catch (error) {
    console.error('AI Service Error:', error.response?.data || error.message);
    throw new Error('Failed to evaluate practice.');
  }
};
