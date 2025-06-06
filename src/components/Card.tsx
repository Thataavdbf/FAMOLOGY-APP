import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, BORDER_RADIUS, FONT_SIZE, FONT_WEIGHT } from '../utils/theme';

// Card component for consistent UI across the app
interface CardProps {
  title?: string;
  icon?: string;
  children: React.ReactNode;
  style?: any;
  onPress?: () => void;
  loading?: boolean;
}

const Card: React.FC<CardProps> = ({
  title,
  icon,
  children,
  style,
  onPress,
  loading = false
}) => {
  const CardContainer = onPress ? TouchableOpacity : View;
  
  return (
    <CardContainer 
      style={[styles.card, style]}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        <>
          {(title || icon) && (
            <View style={styles.cardHeader}>
              {icon && (
                <Ionicons name={icon as any} size={20} color={COLORS.primary} />
              )}
              {title && (
                <Text style={[styles.cardTitle, icon && styles.cardTitleWithIcon]}>
                  {title}
                </Text>
              )}
            </View>
          )}
          <View style={styles.cardContent}>
            {children}
          </View>
        </>
      )}
    </CardContainer>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  cardTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.text,
  },
  cardTitleWithIcon: {
    marginLeft: SPACING.sm,
  },
  cardContent: {
    flex: 1,
  },
  loadingContainer: {
    padding: SPACING.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Card;
