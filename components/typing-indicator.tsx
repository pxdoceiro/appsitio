import { View, Text } from "react-native";
import { useEffect, useState } from "react";

export function TypingIndicator() {
  const [dots, setDots] = useState(".");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => {
        if (prev === ".") return "..";
        if (prev === "..") return "...";
        return ".";
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <View className="mb-3 flex-row justify-start">
      <View className="bg-bot-msg rounded-2xl rounded-bl-none px-4 py-3">
        <Text className="text-base text-foreground">
          Digitando{dots}
        </Text>
      </View>
    </View>
  );
}
