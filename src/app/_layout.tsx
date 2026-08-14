import { QueryClientProvider } from '@tanstack/react-query';
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import { SQLiteProvider } from 'expo-sqlite';
import * as SplashScreen from 'expo-splash-screen';
import { Suspense, useEffect, useState } from 'react';
import { ActivityIndicator, useColorScheme, View } from 'react-native';

import { DATABASE_NAME } from '@/db/client';
import { migrateDatabase } from '@/db/migrations';
import { useTheme } from '@/hooks/use-theme';
import { createQueryClient } from '@/shared/lib/query-client';
import { UnitsProvider } from '@/shared/units/units-context';

SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  anchor: '(tabs)',
};

function DatabaseFallback() {
  const theme = useTheme();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <ActivityIndicator color={theme.accent} />
    </View>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [queryClient] = useState(createQueryClient);

  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <UnitsProvider>
          <Suspense fallback={<DatabaseFallback />}>
            <SQLiteProvider databaseName={DATABASE_NAME} onInit={migrateDatabase} useSuspense>
              <Stack>
                <Stack.Screen name="(tabs)" options={{ headerShown: false, title: 'Back' }} />
                <Stack.Screen
                  name="capture"
                  options={{
                    presentation: 'modal',
                    title: 'Document storm',
                    headerBackTitle: 'Back',
                  }}
                />
                <Stack.Screen
                  name="observation/[id]"
                  options={{
                    title: 'Observation',
                    headerBackTitle: 'Field Log',
                  }}
                />
              </Stack>
            </SQLiteProvider>
          </Suspense>
        </UnitsProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
