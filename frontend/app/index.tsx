import { useEffect, useState } from "react";
import { DeviceEventEmitter, Text, View } from "react-native";

export default function Index() {
useEffect(() => {
    const sub = DeviceEventEmitter.addListener('onAssistantTrigger', () => {
      console.log("Assistant triggered!");
      // Show overlay or launch a screen
    });

    return () => sub.remove();
  }, []);

  return (
    <View>
      <Text>My App</Text>
    </View>
  );
}
