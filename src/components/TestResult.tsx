import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SPACING, FONT_SIZE, FONT_WEIGHT } from '../utils/theme';

interface TestResultProps {
  title: string;
  status: 'pass' | 'fail' | 'pending';
  details?: string;
}

const TestResult: React.FC<TestResultProps> = ({
  title,
  status,
  details
}) => {
  const getStatusColor = () => {
    switch (status) {
      case 'pass':
        return '#10b981'; // Green
      case 'fail':
        return COLORS.error;
      case 'pending':
        return '#f59e0b'; // Amber
      default:
        return COLORS.textSecondary;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'pass':
        return 'PASS';
      case 'fail':
        return 'FAIL';
      case 'pending':
        return 'PENDING';
      default:
        return 'UNKNOWN';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor() }]}>
          <Text style={styles.statusText}>{getStatusText()}</Text>
        </View>
      </View>
      {details && (
        <Text style={styles.details}>{details}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.card,
    borderRadius: 8,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.medium,
    color: COLORS.text,
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs / 2,
    borderRadius: 4,
  },
  statusText: {
    fontSize: FONT_SIZE.xs,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.text,
  },
  details: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    marginTop: SPACING.sm,
  },
});

export default TestResult;
