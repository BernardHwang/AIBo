import React, { useEffect } from "react";
import { Redirect, useRouter } from "expo-router";
import { ActivityIndicator, View, Text } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAppTheme } from "@/components/ThemeContext";

const LoadingScreen = () => {
  const router = useRouter();
  const { theme }: any = useAppTheme();

  useEffect(() => {
    const checkLogin: () => Promise<void> = async () => {
      const token = await AsyncStorage.getItem("user_token");
      if (token) {
        router.navigate("/home"); // Go to home
      } else {
        router.navigate("/login"); // First-time login
      }
    };
    checkLogin();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" />
      <Text style={{color: theme.text}}>Loading...</Text>
    </View>
  );
}

export default LoadingScreen;