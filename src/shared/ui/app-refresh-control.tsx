import { RefreshControl, type RefreshControlProps } from 'react-native';

import { useTheme } from '@/hooks/use-theme';

type AppRefreshControlProps = Pick<RefreshControlProps, 'refreshing' | 'onRefresh'>;

export function AppRefreshControl({ refreshing, onRefresh }: AppRefreshControlProps) {
  const theme = useTheme();

  return (
    <RefreshControl
      refreshing={refreshing}
      onRefresh={onRefresh}
      tintColor={theme.accent}
      colors={[theme.accent]}
    />
  );
}
