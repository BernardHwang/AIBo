import { useAppTheme } from "@/components/ThemeContext";
import { darkColorCode, lightColorCode } from "@/components/utils";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { Text, View, Image, Pressable } from "react-native";

const LoginLanding = () => {
    const router = useRouter();
    const { theme, mode }: any = useAppTheme();

    return (
        <View
            style={{
                flex: 1,
                justifyContent: "space-between",
                alignItems: "center",
            }}
        >
            <View style={{ flexDirection: "row" }}>
                <Text
                    style={{
                        color: theme.text,
                        fontFamily: "Inter_800ExtraBold",
                        fontSize: 48,
                    }}
                >
                    Welcome to{" "}
                </Text>
                <Text
                    style={{
                        color: lightColorCode,
                        fontFamily: "Inter_800ExtraBold",
                        fontSize: 48,
                    }}
                >
                    AIBo
                </Text>
            </View>
            <Image
                source={require("@/assets/images/logo.png")}
                style={{
                    width: 300,
                    height: 300,
                    alignItems: "center",
                    justifyContent: "center",
                }}
            />
            <Pressable
                onPress={() => router.navigate("/login/google")}
                style={{
                    backgroundColor:
                        mode === "dark" ? lightColorCode : darkColorCode,
                    paddingVertical: 25,
                    paddingHorizontal: 100,
                    borderRadius: 100,
                }}
            >
                <Text
                    style={{
                        color: mode === "dark" ? darkColorCode : lightColorCode,
                        fontFamily: "Inter_800ExtraBold",
                        fontSize: 26,
                    }}
                >
                    Let's Start
                </Text>
            </Pressable>
        </View>
    );
};

export default LoginLanding;
