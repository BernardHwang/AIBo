import React, { useEffect } from "react";
import { useRouter } from "expo-router";
import { ActivityIndicator, View, Text, Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAppTheme } from "@/components/ThemeContext";
import { lightColorCode } from "@/components/utils";

const LoadingScreen = () => {
    const router = useRouter();
    const { theme }: any = useAppTheme();

    useEffect(() => {
        const checkLogin = async () => {
            const uuid = await AsyncStorage.getItem("uuid");
            const email = await AsyncStorage.getItem("email");
            const phone = await AsyncStorage.getItem("phone");

            await new Promise((resolve) => setTimeout(resolve, 3000)); // Simulate loading

            if (uuid && email && phone) {
                router.navigate("/home"); // Logged in and verified
            } else if (uuid && email) {
                router.navigate("/login/whatsapp"); // Needs WhatsApp verification
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
