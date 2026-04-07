import React from "react";
import { View, Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import { useAuthStore } from "../store";
import { useTheme } from "../hooks/useTheme";
import { radius } from "../theme";

// Screens
import { LoginScreen } from "../screens/auth/LoginScreen";
import { RegisterScreen } from "../screens/auth/RegisterScreen";
import { HomeScreen } from "../screens/HomeScreen";
import { TaskListScreen } from "../screens/tasks/TaskListScreen";
import { TaskFormScreen } from "../screens/tasks/TaskFormScreen";
import { TaskDetailScreen } from "../screens/tasks/TaskDetailScreen";
import { ProfileScreen } from "../screens/ProfileScreen";

const RootStack = createNativeStackNavigator();
const AuthStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const TaskStack = createNativeStackNavigator();

// ─── Auth Navigator ───────────────────────────────────────────
function AuthNavigator() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Register" component={RegisterScreen} />
    </AuthStack.Navigator>
  );
}

// ─── Task Stack ───────────────────────────────────────────────
function TaskNavigator() {
  return (
    <TaskStack.Navigator screenOptions={{ headerShown: false }}>
      <TaskStack.Screen name="TaskList" component={TaskListScreen} />
      <TaskStack.Screen name="TaskDetail" component={TaskDetailScreen} />
      <TaskStack.Screen name="AddTask" component={TaskFormScreen} />
      <TaskStack.Screen name="EditTask" component={TaskFormScreen} />
    </TaskStack.Navigator>
  );
}

// ─── Bottom Tab Navigator ─────────────────────────────────────
function MainNavigator() {
  const { colors, isDark } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          backgroundColor: colors.tabBar,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          paddingBottom: 8,
          paddingTop: 8,
          height: 68,
          position: "absolute",
          bottom: 20,
          left: 20,
          right: 20,
          borderRadius: 24,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: { fontSize: 11, fontWeight: "700", marginBottom: 4 },
        tabBarIcon: ({ focused, color, size }) => {
          const icons: Record<string, [string, string]> = {
            Home: ["home", "home-outline"],
            Tasks: ["checkmark-circle", "checkmark-circle-outline"],
            Profile: ["person", "person-outline"],
          };
          const [active, inactive] = icons[route.name] ?? [
            "ellipse",
            "ellipse-outline",
          ];
          return (
            <View
              style={{
                backgroundColor: focused
                  ? colors.primary + "15"
                  : "transparent",
                padding: 6,
                borderRadius: 12,
              }}
            >
              <Ionicons
                name={(focused ? active : inactive) as any}
                size={22}
                color={color}
              />
            </View>
          );
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ tabBarLabel: "Home" }}
      />
      <Tab.Screen
        name="Tasks"
        component={TaskNavigator}
        options={{ tabBarLabel: "Tasks" }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ tabBarLabel: "Profile" }}
      />
    </Tab.Navigator>
  );
}

// ─── Root Navigator ───────────────────────────────────────────
export function AppNavigator() {
  const { user, isLoading } = useAuthStore();

  if (isLoading) return null;

  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <RootStack.Screen name="Main" component={MainNavigator} />
        ) : (
          <RootStack.Screen name="Auth" component={AuthNavigator} />
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
