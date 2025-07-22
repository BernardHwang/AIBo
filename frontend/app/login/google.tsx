import * as React from "react";
import { Image, Text, View, Pressable } from "react-native";
import { StatusBar } from "expo-status-bar";
import * as Google from "expo-auth-session/providers/google";
import * as AuthSession from "expo-auth-session";
import { useRouter } from "expo-router";
import { useAppTheme } from "@/components/ThemeContext";
import * as WebBrowser from 'expo-web-browser';
import {
    darkColorCode,
    lightColorCode,
    googleBlue,
    googleRed,
    googleYellow,
    googleGreen,
} from "@/components/utils";

// @ts-ignore
import { GOOGLE_ANDROID_CLIENT_ID } from "@env";

WebBrowser.maybeCompleteAuthSession(); 

const GoogleLogin = () => {
    
    const router = useRouter();
    const { theme, mode }: any = useAppTheme();

    const [request, response, promptAsync] = Google.useAuthRequest({
        androidClientId: GOOGLE_ANDROID_CLIENT_ID,
        redirectUri: AuthSession.makeRedirectUri({
            scheme: 'com.aibo.app',
            path: 'login/whatsapp',
            isTripleSlashed: true
        }),
    });

    React.useEffect(() => {
        if (
            response?.type === "success" &&
            response.authentication?.accessToken
        ) {
            getUserInfo(response.authentication.accessToken);
        }
    }, [response]);

    async function getUserInfo(token: any) {
        const res = await fetch("https://www.googleapis.com/userinfo/v2/me", {
            headers: { Authorization: `Bearer ${token}` },
        });
        const user = await res.json();
        console.log(user);
    }

    return (
        <View
            style={{
                flex: 1,
                justifyContent: "space-between",
                alignItems: "center",
            }}
        >
            <View>
                <Text
                    style={{
                        color: theme.text,
                        fontFamily: "Inter_800ExtraBold",
                        fontSize: 48,
                    }}
                >
                    Sign in
                </Text>
                <View style={{ flexDirection: "row" }}>
                    <Text
                        style={{
                            color: theme.text,
                            fontFamily: "Inter_800ExtraBold",
                            fontSize: 24,
                        }}
                    >
                        Use your{" "}
                    </Text>
                    <Text
                        style={{
                            color: googleBlue,
                            fontFamily: "Inter_800ExtraBold",
                            fontSize: 24,
                        }}
                    >
                        G
                    </Text>
                    <Text
                        style={{
                            color: googleRed,
                            fontFamily: "Inter_800ExtraBold",
                            fontSize: 24,
                        }}
                    >
                        o
                    </Text>
                    <Text
                        style={{
                            color: googleYellow,
                            fontFamily: "Inter_800ExtraBold",
                            fontSize: 24,
                        }}
                    >
                        o
                    </Text>
                    <Text
                        style={{
                            color: googleBlue,
                            fontFamily: "Inter_800ExtraBold",
                            fontSize: 24,
                        }}
                    >
                        g
                    </Text>
                    <Text
                        style={{
                            color: googleGreen,
                            fontFamily: "Inter_800ExtraBold",
                            fontSize: 24,
                        }}
                    >
                        l
                    </Text>
                    <Text
                        style={{
                            color: googleRed,
                            fontFamily: "Inter_800ExtraBold",
                            fontSize: 24,
                        }}
                    >
                        e
                    </Text>
                    <Text
                        style={{
                            color: theme.text,
                            fontFamily: "Inter_800ExtraBold",
                            fontSize: 24,
                        }}
                    >
                        {" "}
                        Account
                    </Text>
                </View>
            </View>
            <Pressable
                onPress={() => promptAsync()}
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
                <Image
                    source={require("@/assets/images/google_icon.png")}
                    style={{
                        width: 40,
                        height: 40,
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                />
                <Text
                    style={{
                        color: mode === "dark" ? darkColorCode : lightColorCode,
                        fontFamily: "Inter_800ExtraBold",
                        fontSize: 26,
                    }}
                >
                    Sign in with Google
                </Text>
            </Pressable>
            <StatusBar style="light" />
        </View>
    );
};

export default GoogleLogin;
