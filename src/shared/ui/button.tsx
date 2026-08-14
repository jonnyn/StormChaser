import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type ButtonVariant = 'accent' | 'danger' | 'outline';

type ButtonProps = {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  loading?: boolean;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
  flex?: number;
};

export function Button({
  label,
  onPress,
  variant = 'accent',
  disabled = false,
  loading = false,
  accessibilityLabel,
  style,
  flex,
}: ButtonProps) {
  const theme = useTheme();
  const isDisabled = disabled || loading;

  const backgroundColor =
    variant === 'accent' ? theme.accent : variant === 'danger' ? theme.danger : 'transparent';
  const labelColor =
    variant === 'outline' ? theme.text : variant === 'accent' ? theme.onAccent : theme.onDanger;
  const spinnerColor = variant === 'outline' ? theme.accent : labelColor;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ disabled: isDisabled }}
      disabled={isDisabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        variant === 'outline' && styles.outline,
        variant === 'outline' && { borderColor: theme.backgroundSelected },
        { backgroundColor, flex, opacity: isDisabled ? 0.6 : pressed ? 0.85 : 1 },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={spinnerColor} />
      ) : (
        <ThemedText style={[styles.label, { color: labelColor }]}>{label}</ThemedText>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.three,
    borderRadius: Spacing.two,
    minHeight: 48,
  },
  outline: {
    borderWidth: 1,
    backgroundColor: 'transparent',
  },
  label: {
    fontWeight: '600',
  },
});
