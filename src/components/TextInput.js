import React from 'react';
import { View, TextInput as RNTextInput, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { spacing, borderRadius } from '../theme/spacing';

/**
 * Reusable TextInput Component
 */
const TextInput = ({ 
  label = '',
  placeholder = '',
  value = '',
  onChangeText,
  multiline = false,
  numberOfLines = 1,
  maxLength = null,
  showCharCount = false,
  error = '',
  style = {},
  ...props
}) => {
  return (
    <View style={[styles.container, style]}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      
      <RNTextInput
        style={[
          styles.input,
          multiline && styles.multiline,
          error && styles.inputError
        ]}
        placeholder={placeholder}
        placeholderTextColor={colors.textLight}
        value={value}
        onChangeText={onChangeText}
        multiline={multiline}
        numberOfLines={numberOfLines}
        maxLength={maxLength}
        {...props}
      />
      
      <View style={styles.footer}>
        {error ? (
          <Text style={styles.error}>{error}</Text>
        ) : null}
        
        {showCharCount && maxLength ? (
          <Text style={styles.charCount}>
            {value.length}/{maxLength}
          </Text>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    fontSize: 16,
    color: colors.text,
  },
  multiline: {
    minHeight: 120,
    textAlignVertical: 'top',
  },
  inputError: {
    borderColor: colors.error,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  error: {
    fontSize: 12,
    color: colors.error,
  },
  charCount: {
    fontSize: 12,
    color: colors.textLight,
  },
});

export default TextInput;
