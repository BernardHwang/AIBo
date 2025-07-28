import { useAppTheme } from "@/components/ThemeContext";
import React, { useState, useEffect, useRef } from "react";
import { View, Text, Image, Pressable, TextInput, Alert, ActivityIndicator } from "react-native";
import { lightColorCode, darkColorCode } from "@/components/utils";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

// @ts-ignore
import { LOGIN_SERVICE_API_URL, WHATSAPP_WEB_SOCKET } from "@env";

const WhatsAppLogin = () => {
    const { theme, mode }: any = useAppTheme();
    const router = useRouter();
    const [phoneNum, setPhoneNum] = useState("");
    const [linkCode, setLinkCode] = useState("");
    const [loading, setLoading] = useState(false);
    const [stage, setStage] = useState<"input" | "link" | "done">("input");
    const wsRef = useRef<WebSocket | null>(null);

    /** Handle WebSocket messages */
    const handleWsMessage = (event: WebSocketMessageEvent) => {
        try {
            const msg = JSON.parse(event.data);

            switch (msg.status) {
                case "pending": // link code arrived
                    if (msg.link_code) {
                        setLinkCode(msg.link_code);
                        setStage("link");
                        setLoading(false);
                    }
                    break;
                case "success": // user finished linking
                    setStage("done");
                    wsRef.current?.close();
                    AsyncStorage.setItem("whatsapp", phoneNum);
                    router.navigate("/login/ending");
                    break;
                case "error":
                    wsRef.current?.close();
                    setLoading(false);
                    Alert.alert("Login failed", msg.message ?? "Unknown error");
                    break;
            }
        } catch (e) {
            console.error("Invalid WS message", e);
        }
    };

    /** Initiate WhatsApp login */
    const login_whatsapp = async () => {
        if (!phoneNum.trim() || loading) return;
        setLoading(true);

        const uuid = await AsyncStorage.getItem("uuid");
        if (!uuid) {
            Alert.alert("Missing UUID", "User identifier not found.");
            setLoading(false);
            return;
        }

        /* 1️⃣   Open WebSocket first (so we don’t miss the link‑code message) */
        if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
            const ws = new WebSocket(`${WHATSAPP_WEB_SOCKET}/user/whatsapp/ws/${uuid}`);
            wsRef.current = ws;
            ws.onmessage = handleWsMessage;
            ws.onerror   = () => Alert.alert("WebSocket Error", "Could not connect to WhatsApp session");
        }

        /* 2️⃣   Call the login API to start Selenium flow (backend now returns only {status:"processing"}) */
        try {
            await axios.post(
                `${LOGIN_SERVICE_API_URL}/user/whatsapp/login`,
                null,
                { params: { phone_number: phoneNum, uuid } }
            );
            // The link code will arrive through the WebSocket → handled in handleWsMessage()
        } catch (e) {
            setLoading(false);
            Alert.alert("Login Error", "Failed to start WhatsApp login.");
        }
    };

    /** Cleanup socket on unmount */
    useEffect(() => {
        return () => wsRef.current?.close();
    }, []);

    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Text style={{ color: theme.text, fontFamily: "Inter_800ExtraBold", fontSize: 48 }}>
                Sign in
            </Text>

            {/* Phone‑number input stage */}
            {stage === "input" && (
                <>
                    <View
                        style={{
                            backgroundColor: mode === "dark" ? lightColorCode : darkColorCode,
                            height: 90,
                            width: 360,
                            borderRadius: 100,
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "flex-start",
                            paddingHorizontal: 25,
                            marginVertical: 30,
                        }}
                    >
                        <Text style={{ fontSize: 24, marginRight: 10, fontWeight: "500" }}>+60</Text>
                        <TextInput
                            keyboardType="numeric"
                            style={{ fontSize: 24, flex: 1 }}
                            placeholder="Enter phone number"
                            maxLength={10}
                            value={phoneNum}
                            onChangeText={setPhoneNum}
                        />
                    </View>

                    <Pressable
                        onPress={login_whatsapp}
                        disabled={loading}
                        style={{
                            backgroundColor: mode === "dark" ? lightColorCode : darkColorCode,
                            height: 90,
                            width: 360,
                            borderRadius: 100,
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-evenly",
                            opacity: loading ? 0.6 : 1,
                        }}
                    >
                        <Image
                            source={require("@/assets/images/whatsapp_icon.png")}
                            style={{ width: 40, height: 40 }}
                        />
                        <Text
                            style={{
                                color: mode === "dark" ? darkColorCode : lightColorCode,
                                fontFamily: "Inter_800ExtraBold",
                                fontSize: 26,
                            }}
                        >
                            Sign in with WhatsApp
                        </Text>
                    </Pressable>

                    {loading && <ActivityIndicator style={{ marginTop: 20 }} />}
                </>
            )}

            {/* Display link‑code once received */}
            {stage === "link" && (
                <View style={{ marginTop: 50, alignItems: "center" }}>
                    <Text style={{ color: theme.text, fontSize: 18, marginBottom: 10 }}>
                        Open WhatsApp and enter this code:
                    </Text>
                    <Text style={{ fontSize: 36, fontWeight: "bold", color: theme.text }}>
                        {linkCode}
                    </Text>
                    <Text style={{ color: theme.text, marginTop: 20 }}>
                        Waiting for WhatsApp connection…
                    </Text>
                </View>
            )}
        </View>
    );
};

export default WhatsAppLogin;
