import { useAppTheme } from '@/components/ThemeContext';
import { Stack } from 'expo-router';

export default function LoginLayout() {

    const themeContext = useAppTheme();

    if (!themeContext) {
        // You can provide a fallback theme or handle the error as needed
        return null;
    }

    const { theme } = themeContext;
    
    return (
        <Stack
            screenOptions={{
                animation: "slide_from_right", // Page slide animation
                headerShown: false,
                contentStyle: {
                    paddingHorizontal: 50,
                    paddingVertical: 100,
                    backgroundColor: theme.background
                    
                }
            }}
        />
    )
};