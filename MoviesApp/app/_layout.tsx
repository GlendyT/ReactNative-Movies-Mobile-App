import { AuthProvider } from "@/context/AuthContext";
import { Stack } from "expo-router";
import "./global.css";

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="movies/[id]" options={{ headerShown: false }} />
        <Stack.Screen
          name="favoritemovies/index"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="favoritetvshows/index"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="tvshow/[id]"
          options={{ headerShown: false }}
        />
        <Stack.Screen name="lists/index" options={{ headerShown: false }} />
      </Stack>
    </AuthProvider>
  );
}

{
  /* This code hides the route groups header  */
}
{
  /* <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="movies/[id]" options={{ headerShown: false }} />
        <Stack.Screen
          name="favoritemovies/index"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="favoritetvshows/index"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="tvshow/[id]"
          options={{ headerShown: false }}
        />
        <Stack.Screen name="lists/index" options={{ headerShown: false }} /> */
}
