import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, BORDER_RADIUS, FONT_SIZE, FONT_WEIGHT } from '../utils/theme';

interface TreeNodeCardProps {
  name: string;
  birthdate: string;
  birthplace?: string;
  relationshipCounts?: {
    children?: number;
    parents?: number;
    siblings?: number;
    partners?: number;
  };
  isSelected?: boolean;
  onPress: () => void;
}

const TreeNodeCard: React.FC<TreeNodeCardProps> = ({
  name,
  birthdate,
  birthplace,
  relationshipCounts = {},
  isSelected = false,
  onPress,
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        isSelected && styles.selectedContainer,
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={styles.name} numberOfLines={1}>{name}</Text>
      <Text style={styles.info}>Born: {formatDate(birthdate)}</Text>
      {birthplace && birthplace !== 'Unknown' && (
        <Text style={styles.info} numberOfLines={1}>Place: {birthplace}</Text>
      )}
      
      {/* Display relationships */}
      {Object.entries(relationshipCounts).some(([_, count]) => count && count > 0) && (
        <View style={styles.relationshipsContainer}>
          {relationshipCounts.children && relationshipCounts.children > 0 && (
            <View style={styles.relationshipBadge}>
              <Ionicons name="people-outline" size={14} color="#fff" />
              <Text style={styles.relationshipCount}>{relationshipCounts.children}</Text>
            </View>
          )}
          {relationshipCounts.parents && relationshipCounts.parents > 0 && (
            <View style={styles.relationshipBadge}>
              <Ionicons name="person-outline" size={14} color="#fff" />
              <Text style={styles.relationshipCount}>{relationshipCounts.parents}</Text>
            </View>
          )}
          {relationshipCounts.siblings && relationshipCounts.siblings > 0 && (
            <View style={styles.relationshipBadge}>
              <Ionicons name="people-outline" size={14} color="#fff" />
              <Text style={styles.relationshipCount}>{relationshipCounts.siblings}</Text>
            </View>
          )}
          {relationshipCounts.partners && relationshipCounts.partners > 0 && (
            <View style={styles.relationshipBadge}>
              <Ionicons name="heart-outline" size={14} color="#fff" />
              <Text style={styles.relationshipCount}>{relationshipCounts.partners}</Text>
            </View>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  selectedContainer: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryLight,
  },
  name: {
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  info: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  relationshipsContainer: {
    flexDirection: 'row',
    marginTop: SPACING.xs,
  },
  relationshipBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardDark,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginRight: 6,
  },
  relationshipCount: {
    color: COLORS.text,
    fontSize: FONT_SIZE.xs,
    marginLeft: 4,
  },
});

export default TreeNodeCard;
