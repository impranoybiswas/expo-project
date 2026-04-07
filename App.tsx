// App.tsx
import "react-native-gesture-handler";
import React, { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AppNavigator } from "./src/navigation";
import { useAuthStore } from "./src/store";
import { useTheme } from "./src/hooks/useTheme";
import { subscribeToAuth } from "./src/services/authService";

export default function App() {
  const { setUser, setLoading } = useAuthStore();
  const { theme, colors, isDark } = useTheme();

  useEffect(() => {
    const unsub = subscribeToAuth((user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsub();
  }, [setUser, setLoading]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar
          style={isDark ? "light" : "dark"}
          backgroundColor={colors.bg}
        />
        <AppNavigator />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
