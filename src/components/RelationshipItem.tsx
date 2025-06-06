import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, BORDER_RADIUS, FONT_SIZE, FONT_WEIGHT } from '../utils/theme';

interface RelationshipItemProps {
  name: string;
  year?: string;
  relationshipType?: string;
  onPress: () => void;
}

const RelationshipItem: React.FC<RelationshipItemProps> = ({
  name,
  year,
  relationshipType,
  onPress,
}) => {
  // Get icon based on relationship type
  const getRelationshipIcon = () => {
    switch (relationshipType) {
      case 'child':
        return 'people-outline';
      case 'parent':
        return 'person-outline';
      case 'sibling':
        return 'people-outline';
      case 'partner':
        return 'heart-outline';
      default:
        return 'person-outline';
    }
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.iconContainer}>
        <Ionicons 
          name={getRelationshipIcon() as any} 
          size={20} 
          color={COLORS.primary} 
        />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.name} numberOfLines={1}>{name}</Text>
        {relationshipType && (
          <Text style={styles.relationshipType}>
            {relationshipType.charAt(0).toUpperCase() + relationshipType.slice(1)}
          </Text>
        )}
      </View>
      <View style={styles.rightContainer}>
        {year && <Text style={styles.year}>{year}</Text>}
        <Ionicons name="chevron-forward" size={16} color={COLORS.primary} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.xs,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: BORDER_RADIUS.round,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.sm,
  },
  textContainer: {
    flex: 1,
  },
  name: {
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.medium,
    color: COLORS.text,
  },
  relationshipType: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  year: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    marginRight: SPACING.xs,
  },
});

export default RelationshipItem;
