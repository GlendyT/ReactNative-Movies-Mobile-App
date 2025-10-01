
import { images } from "@/constants/images";
import { useAuth } from "@/context/AuthContext";
import { Redirect, Slot, usePathname } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  Dimensions,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View
} from "react-native";

export default function AuthLayout() {
  const { isAuthenticated, isLoading } = useAuth();
  const pathname = usePathname();

  // Mostrar loading mientras se carga el estado de autenticación
  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-primary">
        <ActivityIndicator size="large" color="#FFA500" />
        <Text className="text-white mt-4">Loading...</Text>
      </View>
    );
  }

  // Only redirect if authenticated and not showing success screen
  if (isAuthenticated && !pathname.includes('success')) {
    return <Redirect href="/(tabs)" />;
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        className="bg-primary h-full"
        keyboardShouldPersistTaps="handled"
      >
        <View
          className="w-full relative"
          style={{ height: Dimensions.get("screen").height / 2.25 }}
        >
          <ImageBackground
            source={images.bg}
            className="size-full rounded-b-lg"
            resizeMode="stretch"
          />
        </View>
        <Slot />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}