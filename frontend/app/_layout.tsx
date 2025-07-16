import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { ThemeProvider, useAppTheme } from "@/components//ThemeContext";
import {
    useFonts,
    Inter_400Regular,
    Inter_800ExtraBold,
} from "@expo-google-fonts/inter";

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
    const [fontsLoaded] = useFonts({
        Inter_400Regular,
        Inter_800ExtraBold
    });

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
            <StatusBar style={mode === "dark" ? "light" : "dark"} />
            <Stack
                screenOptions={{
                    headerShown: false,
                    contentStyle: {
                        backgroundColor: theme.background,
                    },
                }}
            />
        </SafeAreaView>
    );
}
