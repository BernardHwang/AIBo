import React from "react";
import { View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { useAppTheme } from "@/components/ThemeContext";
import { darkColorCode, lightColorCode } from "@/components/utils";

const LoginEnding = () => {
    const router = useRouter();
    const { theme, mode }: any = useAppTheme(); // use theme if you want to style dynamically

    const handleContinue = () => {
        router.replace("/home"); // or your app's main route
    };

    return (
        <View
            style={{
                flex: 1,
                justifyContent: "space-between",
                alignItems: "center",
            }}
        >
            <Text
                style={{
                    color: mode === "dark" ? darkColorCode : lightColorCode,
                    fontFamily: "Inter_800ExtraBold",
                    fontSize: 26,
                }}
            >
                ✅ Login Successful
            </Text>
            <Text
                style={{
                    color: mode === "dark" ? darkColorCode : lightColorCode,
                    fontFamily: "Inter_800ExtraBold",
                    fontSize: 26,
                }}
            >
                You're now logged in. Tap below to start using the app.
            </Text>
            <Pressable
                onPress={handleContinue}
                style={{
                    backgroundColor:
                        mode === "dark" ? lightColorCode : darkColorCode,
                    height: 90,
                    width: 360,
                    borderRadius: 100,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-evenly",
                }}
            >
                <Text
                    style={{
                        color: mode === "dark" ? darkColorCode : lightColorCode,
                        fontFamily: "Inter_800ExtraBold",
                        fontSize: 26,
                    }}
                >
                    Go to App
                </Text>
            </Pressable>
        </View>
    );
};

export default LoginEnding;