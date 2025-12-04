import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, gradients } from '../theme/colors';
import { spacing, borderRadius, shadows } from '../theme/spacing';

/**
 * Reusable Button Component
 */
const Button = ({ 
  title, 
  onPress, 
  variant = 'primary', 
  size = 'medium',
  loading = false,
  disabled = false,
  icon = null,
  fullWidth = false,
  style = {}
}) => {
  const getButtonStyle = () => {
    const baseStyle = [styles.button];
    
    if (size === 'small') baseStyle.push(styles.buttonSmall);
    if (size === 'large') baseStyle.push(styles.buttonLarge);
    if (fullWidth) baseStyle.push(styles.fullWidth);
    if (disabled) baseStyle.push(styles.disabled);
    
    return [...baseStyle, style];
  };

  const getTextStyle = () => {
    const baseStyle = [styles.text];
    
    if (size === 'small') baseStyle.push(styles.textSmall);
    if (size === 'large') baseStyle.push(styles.textLarge);
    if (variant === 'outline') baseStyle.push(styles.textOutline);
    if (variant === 'ghost') baseStyle.push(styles.textGhost);
    
    return baseStyle;
  };

  if (variant === 'gradient') {
    return (
      <TouchableOpacity 
        onPress={onPress} 
        disabled={disabled || loading}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={gradients.primary}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={getButtonStyle()}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <>
              {icon}
              <Text style={getTextStyle()}>{title}</Text>
            </>
          )}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity 
      style={[
        getButtonStyle(),
        variant === 'primary' && styles.primary,
        variant === 'secondary' && styles.secondary,
        variant === 'outline' && styles.outline,
        variant === 'ghost' && styles.ghost,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? '#FFFFFF' : colors.primary} />
      ) : (
        <>
          {icon}
          <Text style={getTextStyle()}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.lg,
    gap: spacing.sm,
    ...shadows.sm,
  },
  buttonSmall: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  buttonLarge: {
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
  },
  fullWidth: {
    width: '100%',
  },
  primary: {
    backgroundColor: colors.primary,
  },
  secondary: {
    backgroundColor: colors.secondary,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: colors.primary,
  },
  ghost: {
    backgroundColor: 'transparent',
    shadowOpacity: 0,
    elevation: 0,
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  textSmall: {
    fontSize: 14,
  },
  textLarge: {
    fontSize: 18,
  },
  textOutline: {
    color: colors.primary,
  },
  textGhost: {
    color: colors.primary,
  },
});

export default Button;
