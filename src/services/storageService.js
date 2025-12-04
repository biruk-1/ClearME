import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Storage Service for ClearMe
 * Handles local data persistence
 */

const KEYS = {
  HISTORY: '@clearme_history',
  SETTINGS: '@clearme_settings',
  API_KEY: '@clearme_api_key',
  EXERCISES: '@clearme_exercises'
};

/**
 * Save improved text to history
 */
export const saveToHistory = async (item) => {
  try {
    const history = await getHistory();
    const newItem = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      ...item
    };
    
    const updatedHistory = [newItem, ...history].slice(0, 100); // Keep last 100 items
    await AsyncStorage.setItem(KEYS.HISTORY, JSON.stringify(updatedHistory));
    return newItem;
  } catch (error) {
    console.error('Error saving to history:', error);
    throw error;
  }
};

/**
 * Get history
 */
export const getHistory = async () => {
  try {
    const history = await AsyncStorage.getItem(KEYS.HISTORY);
    return history ? JSON.parse(history) : [];
  } catch (error) {
    console.error('Error getting history:', error);
    return [];
  }
};

/**
 * Delete history item
 */
export const deleteHistoryItem = async (id) => {
  try {
    const history = await getHistory();
    const updatedHistory = history.filter(item => item.id !== id);
    await AsyncStorage.setItem(KEYS.HISTORY, JSON.stringify(updatedHistory));
  } catch (error) {
    console.error('Error deleting history item:', error);
    throw error;
  }
};

/**
 * Clear all history
 */
export const clearHistory = async () => {
  try {
    await AsyncStorage.setItem(KEYS.HISTORY, JSON.stringify([]));
  } catch (error) {
    console.error('Error clearing history:', error);
    throw error;
  }
};

/**
 * Save settings
 */
export const saveSettings = async (settings) => {
  try {
    await AsyncStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
  } catch (error) {
    console.error('Error saving settings:', error);
    throw error;
  }
};

/**
 * Get settings
 */
export const getSettings = async () => {
  try {
    const settings = await AsyncStorage.getItem(KEYS.SETTINGS);
    return settings ? JSON.parse(settings) : {
      theme: 'light',
      language: 'en',
      apiKey: ''
    };
  } catch (error) {
    console.error('Error getting settings:', error);
    return {
      theme: 'light',
      language: 'en',
      apiKey: ''
    };
  }
};

/**
 * Save API key
 */
export const saveApiKey = async (apiKey) => {
  try {
    await AsyncStorage.setItem(KEYS.API_KEY, apiKey);
  } catch (error) {
    console.error('Error saving API key:', error);
    throw error;
  }
};

/**
 * Get API key
 */
export const getApiKey = async () => {
  try {
    return await AsyncStorage.getItem(KEYS.API_KEY);
  } catch (error) {
    console.error('Error getting API key:', error);
    return null;
  }
};

/**
 * Save completed exercise
 */
export const saveExercise = async (exercise) => {
  try {
    const exercises = await getExercises();
    const newExercise = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      ...exercise
    };
    
    const updatedExercises = [newExercise, ...exercises].slice(0, 50);
    await AsyncStorage.setItem(KEYS.EXERCISES, JSON.stringify(updatedExercises));
    return newExercise;
  } catch (error) {
    console.error('Error saving exercise:', error);
    throw error;
  }
};

/**
 * Get exercises
 */
export const getExercises = async () => {
  try {
    const exercises = await AsyncStorage.getItem(KEYS.EXERCISES);
    return exercises ? JSON.parse(exercises) : [];
  } catch (error) {
    console.error('Error getting exercises:', error);
    return [];
  }
};
