import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { ThemeProvider, useAppTheme } from '@/components//ThemeContext';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
        <ThemeProvider>
            <ThemedWrapper />
        </ThemeProvider>
    </SafeAreaProvider>
  );
}

function ThemedWrapper() {
  const { theme, mode }: any = useAppTheme();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <StatusBar style={mode === 'dark' ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: theme.background
          },
        }}
      />
    </SafeAreaView>
  );
}
