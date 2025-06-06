import React from 'react';
import { View, Text, StyleSheet, TextInput as RNTextInput, TextInputProps } from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS, FONT_SIZE } from '../utils/theme';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  optional?: boolean;
}

const TextInput: React.FC<InputProps> = ({
  label,
  error,
  optional = false,
  style,
  ...props
}) => {
  return (
    <View style={styles.container}>
      {label && (
        <View style={styles.labelContainer}>
          <Text style={styles.label}>{label}</Text>
          {optional && <Text style={styles.optional}> (optional)</Text>}
        </View>
      )}
      <RNTextInput
        style={[
          styles.input,
          error && styles.inputError,
          style
        ]}
        placeholderTextColor={COLORS.textSecondary}
        {...props}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.md,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  label: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    color: COLORS.text,
  },
  optional: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
  },
  input: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    color: COLORS.text,
    fontSize: FONT_SIZE.md,
  },
  inputError: {
    borderColor: COLORS.error,
  },
  errorText: {
    color: COLORS.error,
    fontSize: FONT_SIZE.sm,
    marginTop: SPACING.xs,
  },
});

export default TextInput;
