import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { Loader2Icon } from "lucide-react-native";

// IMPORTANT: Replace with your actual Gemini API key
const GEMINI_API_KEY = "YOUR_API_KEY";

// Rate limiting configuration
const RATE_LIMIT = {
  WINDOW_MS: 60000, // 1 minute
  MAX_REQUESTS: 30, // Adjust based on your quota
};

const AIGuidance = () => {
  const [messages, setMessages] = useState<
    Array<{ sender: string; text: string }>
  >([]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const requestTimestamps = useRef<number[]>([]);
  const flatListRef = useRef<FlatList>(null);

  const formatResponse = (text: string): string => {
    // Function to replace markdown with formatted text
    const processText = (line: string): string => {
      // Replace *bold text* with bold-like text
      line = line.replace(/\*(.+?)\*/g, "$1");

      // Replace bullet point with • symbol
      line = line.replace(/^\s*\*\s*(.+)$/gm, "• $1");

      return line;
    };

    // Split text into lines and process each line
    const lines = text
      .split(/\n+/)
      .map((line) => line.trim())
      .filter((line) => line);

    // Process and format lines
    const formattedLines = lines.map((line) => {
      // Identify and highlight key sections
      if (
        line.toLowerCase().includes("recommended exercises") ||
        line.toLowerCase().includes("important considerations") ||
        line.toLowerCase().includes("benefits")
      ) {
        return `🔍 ${line.toUpperCase()} 🔍`;
      }

      // Process the line
      return processText(line);
    });

    // Join lines with appropriate spacing
    return formattedLines.join("\n\n");
  };

  const handleInputChange = (text: string) => {
    setInputText(text);
  };

  const handleSendMessage = async () => {
    if (!inputText) return;

    setLoading(true);

    const newMessages = [...messages, { sender: "user", text: inputText }];
    setMessages(newMessages);
    setInputText("");

    try {
      const botResponse = await sendMessageToGemini(inputText);
      const formattedResponse = formatResponse(botResponse);

      const updatedMessages = [
        ...newMessages,
        { sender: "bot", text: formattedResponse },
      ];
      setMessages(updatedMessages);
    } catch (error) {
      console.error("Error in message handling:", error);
      const errorMessage = {
        sender: "bot",
        text:
          error instanceof Error
            ? error.message
            : "Sorry, there was an error processing your message. Please try again.",
      };
      setMessages([...newMessages, errorMessage]);
    } finally {
      setLoading(false);
      // Scroll to bottom after adding message
      flatListRef.current?.scrollToEnd({ animated: true });
    }
  };

  const checkRateLimit = async () => {
    const now = Date.now();
    const windowStart = now - RATE_LIMIT.WINDOW_MS;

    // Remove old timestamps
    requestTimestamps.current = requestTimestamps.current.filter(
      (timestamp) => timestamp > windowStart
    );

    // Check if we've exceeded the limit
    if (requestTimestamps.current.length >= RATE_LIMIT.MAX_REQUESTS) {
      const oldestRequest = requestTimestamps.current[0];
      const waitTime = RATE_LIMIT.WINDOW_MS - (now - oldestRequest);
      await new Promise((resolve) => setTimeout(resolve, waitTime));
      return checkRateLimit(); // Recursively check again after waiting
    }

    // Add this request to the timestamps
    requestTimestamps.current.push(now);
  };

  const sendMessageToGemini = async (text: string): Promise<string> => {
    await checkRateLimit();

    try {
      if (!GEMINI_API_KEY) throw new Error("Gemini API key is not configured");

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-latest:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text }] }],
            generationConfig: {
              temperature: 0.9,
              topP: 1,
              topK: 40,
              maxOutputTokens: 2048,
            },
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error?.message || "Message processing failed"
        );
      }

      const data = await response.json();
      return (
        data.candidates?.[0]?.content?.parts?.[0]?.text ||
        "No response available"
      );
    } catch (error) {
      console.error("Error sending message:", error);
      throw error;
    }
  };

  const renderMessage = ({
    item,
  }: {
    item: { sender: string; text: string };
  }) => (
    <View
      style={[
        styles.messageContainer,
        item.sender === "bot"
          ? styles.botMessageContainer
          : styles.userMessageContainer,
      ]}
    >
      <Text
        style={[
          styles.messageText,
          item.sender === "bot"
            ? styles.botMessageText
            : styles.userMessageText,
        ]}
      >
        {item.text}
      </Text>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(_, index) => index.toString()}
        contentContainerStyle={styles.messageList}
        ListFooterComponent={
          loading ? (
            <View style={styles.loaderContainer}>
              <ActivityIndicator size="small" color="#0000ff" />
            </View>
          ) : null
        }
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={handleInputChange}
          placeholder="Type your message..."
          editable={!loading}
        />
        <TouchableOpacity
          style={[
            styles.sendButton,
            (loading || !inputText) && styles.disabledSendButton,
          ]}
          onPress={handleSendMessage}
          disabled={loading || !inputText}
        >
          {loading ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text style={styles.sendButtonText}>Send</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
  },
  messageList: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  messageContainer: {
    marginVertical: 4,
    maxWidth: "80%",
    alignSelf: "flex-start",
    borderRadius: 8,
    padding: 12,
  },
  botMessageContainer: {
    backgroundColor: "#e0e0e0",
    alignSelf: "flex-start",
  },
  userMessageContainer: {
    backgroundColor: "#007AFF",
    alignSelf: "flex-end",
  },
  messageText: {
    fontSize: 16,
  },
  botMessageText: {
    color: "#333",
  },
  userMessageText: {
    color: "white",
  },
  inputContainer: {
    flexDirection: "row",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    backgroundColor: "white",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
  },
  sendButton: {
    backgroundColor: "#007AFF",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  disabledSendButton: {
    backgroundColor: "#b0b0b0",
  },
  sendButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  loaderContainer: {
    alignItems: "center",
    marginVertical: 8,
  },
});

export default AIGuidance;
