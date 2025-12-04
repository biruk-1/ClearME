import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../theme/colors';
import { spacing, borderRadius, shadows } from '../theme/spacing';

/**
 * Reusable Card Component
 */
const Card = ({ 
  children, 
  variant = 'default',
  onPress = null,
  style = {},
  gradient = null
}) => {
  const cardStyle = [
    styles.card,
    variant === 'elevated' && styles.elevated,
    variant === 'outlined' && styles.outlined,
    style
  ];

  if (gradient) {
    const Container = onPress ? TouchableOpacity : View;
    return (
      <Container onPress={onPress} activeOpacity={0.8}>
        <LinearGradient
          colors={gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={cardStyle}
        >
          {children}
        </LinearGradient>
      </Container>
    );
  }

  if (onPress) {
    return (
      <TouchableOpacity style={cardStyle} onPress={onPress} activeOpacity={0.8}>
        {children}
      </TouchableOpacity>
    );
  }

  return (
    <View style={cardStyle}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    ...shadows.sm,
  },
  elevated: {
    ...shadows.lg,
  },
  outlined: {
    borderWidth: 1,
    borderColor: colors.border,
    shadowOpacity: 0,
    elevation: 0,
  },
});

export default Card;
