import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        // Ẩn header mặc định của Stack Navigator
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="login"
        options={{
          headerShown: true,
          headerTitle: "Quay lại",
        }}
      />
      <Stack.Screen
        name="register"
        options={{
          headerShown: true,
          headerTitle: "Quay lại",
        }}
      />
    </Stack>
  );
}
