import { Text, View, Image } from "react-native";
import { cn } from "@/lib/utils";

interface MessageBubbleProps {
  text: string;
  isUser: boolean;
  timestamp?: Date;
  characterImage?: string | number;
}

export function MessageBubble({ text, isUser, timestamp, characterImage }: MessageBubbleProps) {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <View
      className={cn(
        "mb-3 flex-row items-end gap-2",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      {!isUser && characterImage && (
        <Image
          source={
            typeof characterImage === "string" ? { uri: characterImage } : characterImage
          }
          className="w-8 h-8 rounded-full"
        />
      )}
      <View
        className={cn(
          "max-w-xs rounded-2xl px-4 py-3",
          isUser
            ? "bg-user-msg rounded-br-none"
            : "bg-bot-msg rounded-bl-none"
        )}
      >
        <Text
          className={cn(
            "text-base leading-relaxed",
            isUser ? "text-foreground" : "text-foreground"
          )}
        >
          {text}
        </Text>
        {timestamp && (
          <Text
            className={cn(
              "text-xs mt-1",
              isUser ? "text-foreground opacity-70" : "text-foreground opacity-70"
            )}
          >
            {formatTime(timestamp)}
          </Text>
        )}
      </View>
    </View>
  );
}
