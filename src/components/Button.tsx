import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, BORDER_RADIUS, FONT_SIZE, FONT_WEIGHT, commonStyles } from '../utils/theme';

// Button variants
type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';

// Button sizes
type ButtonSize = 'sm' | 'md' | 'lg';

// Button props
interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: string;
  iconPosition?: 'left' | 'right';
  disabled?: boolean;
  fullWidth?: boolean;
  style?: any;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  disabled = false,
  fullWidth = false,
  style,
}) => {
  // Get button styles based on variant
  const getButtonStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: disabled ? COLORS.primaryLight : COLORS.primary,
          borderWidth: 0,
        };
      case 'secondary':
        return {
          backgroundColor: COLORS.cardDark,
          borderWidth: 0,
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: COLORS.primary,
        };
      case 'ghost':
        return {
          backgroundColor: 'transparent',
          borderWidth: 0,
        };
      default:
        return {
          backgroundColor: COLORS.primary,
          borderWidth: 0,
        };
    }
  };

  // Get text styles based on variant
  const getTextStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          color: COLORS.text,
        };
      case 'secondary':
        return {
          color: COLORS.text,
        };
      case 'outline':
        return {
          color: COLORS.primary,
        };
      case 'ghost':
        return {
          color: COLORS.primary,
        };
      default:
        return {
          color: COLORS.text,
        };
    }
  };

  // Get button padding based on size
  const getPadding = () => {
    switch (size) {
      case 'sm':
        return {
          paddingVertical: SPACING.xs,
          paddingHorizontal: SPACING.sm,
        };
      case 'md':
        return {
          paddingVertical: SPACING.sm,
          paddingHorizontal: SPACING.md,
        };
      case 'lg':
        return {
          paddingVertical: SPACING.md,
          paddingHorizontal: SPACING.lg,
        };
      default:
        return {
          paddingVertical: SPACING.sm,
          paddingHorizontal: SPACING.md,
        };
    }
  };

  // Get font size based on size
  const getFontSize = () => {
    switch (size) {
      case 'sm':
        return FONT_SIZE.sm;
      case 'md':
        return FONT_SIZE.md;
      case 'lg':
        return FONT_SIZE.lg;
      default:
        return FONT_SIZE.md;
    }
  };

  // Get icon size based on button size
  const getIconSize = () => {
    switch (size) {
      case 'sm':
        return 16;
      case 'md':
        return 20;
      case 'lg':
        return 24;
      default:
        return 20;
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        getButtonStyles(),
        getPadding(),
        fullWidth && styles.fullWidth,
        disabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <View style={styles.buttonContent}>
        {icon && iconPosition === 'left' && (
          <Ionicons
            name={icon as any}
            size={getIconSize()}
            color={getTextStyles().color}
            style={styles.iconLeft}
          />
        )}
        <Text
          style={[
            styles.buttonText,
            getTextStyles(),
            { fontSize: getFontSize() },
          ]}
        >
          {title}
        </Text>
        {icon && iconPosition === 'right' && (
          <Ionicons
            name={icon as any}
            size={getIconSize()}
            color={getTextStyles().color}
            style={styles.iconRight}
          />
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: BORDER_RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontWeight: FONT_WEIGHT.semibold,
    textAlign: 'center',
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.6,
  },
  iconLeft: {
    marginRight: SPACING.xs,
  },
  iconRight: {
    marginLeft: SPACING.xs,
  },
});

export default Button;
