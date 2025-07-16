import React, { useEffect } from "react";
import { Redirect, useRouter } from "expo-router";
import { ActivityIndicator, View, Text, Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAppTheme } from "@/components/ThemeContext";
import { lightColorCode } from "@/components/utils";

const LoadingScreen = () => {
    const router = useRouter();
    const { theme }: any = useAppTheme();

    useEffect(() => {
        const checkLogin: () => Promise<void> = async () => {
            const token = await AsyncStorage.getItem("user_token");
            await new Promise((resolve) => setTimeout(resolve, 3000)); // Pause for 3 seconds to simulate Loading
            if (token) {
                router.navigate("/home"); // Go to home
            } else {
                router.navigate("/login"); // First-time login
            }
        };
        checkLogin();
    }, [router]);

    return (
        <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
            <Image
                source={require("@/assets/images/logo.png")}
                style={{ width: 300, height: 300 }}
            />
            <Text
                style={{
                    color: lightColorCode,
                    fontSize: 32,
                    fontFamily: "Inter_800ExtraBold",
                }}
            >
                AIBo
            </Text>
        </View>
    );
};

export default LoadingScreen;
