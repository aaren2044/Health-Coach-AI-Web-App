import { Stack } from "expo-router";
import { View, StyleSheet } from "react-native";

export default function RootLayout() {
  return (
    <View style={styles.container}>
      <Stack screenOptions={{ contentStyle: styles.stackContent }}>
        <Stack.Screen name="tabs" options={{ headerShown: false }} />
        <Stack.Screen name="index" options={{ title: "Home" }} />
        <Stack.Screen name="about" options={{ title: "About" }} />
        <Stack.Screen name="GetStarted" options={{ title: "Login" }} />
        <Stack.Screen name="ProfileSetup" options={{ title: "Setup" }} />

        {/* Adding the missing screens */}
        <Stack.Screen name="Articles" options={{ title: "Articles" }} />
        <Stack.Screen name="chat" options={{ title: "Chat" }} />
        <Stack.Screen name="community" options={{ title: "Community" }} />
        <Stack.Screen name="Diet" options={{ title: "Diet" }} />
        <Stack.Screen name="helpline" options={{ title: "Helpline" }} />
        <Stack.Screen name="task" options={{ title: "Tasks" }} />
        <Stack.Screen name="UserScreen" options={{ title: "User Screen" }} />
        <Stack.Screen name="UserLeft" options={{ title: "User Left" }} />
      </Stack>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
  stackContent: {
    flex: 1,
    marginBottom: 60, // Adjust based on your footer height
  },
});
