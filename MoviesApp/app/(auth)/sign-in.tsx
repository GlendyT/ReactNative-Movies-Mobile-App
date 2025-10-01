import CustomInput from "@/components/CustomInput";
import { icons } from "@/constants/icons";
import { useAuth } from "@/context/AuthContext";
import { signInWithTMDB } from "@/services/api";
import { Link, router } from "expo-router";
import React, { useState } from "react";
import { Alert, Image, Text, TouchableOpacity, View } from "react-native";

const SignIn = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({ username: "", password: "" });
  const { login } = useAuth();

  const submit = async () => {
    const { username, password } = form;
    if (!username || !password) {
      Alert.alert("Error", "Please fill all the fields");
      return;
    }
    setIsSubmitting(true);
    try {
      // Usar la nueva función de autenticación de TMDB
      const authResult = await signInWithTMDB(username, password);

      // Usar la función login del contexto con los datos correctos
      await login(authResult.accountData, authResult.sessionId);
      // Redireccionar después del éxito
      setTimeout(() => {
        router.replace("/(tabs)");
      }, 1500);
    } catch (error: any) {
      console.error("Sign in error:", error);
      let errorMessage = "An error occurred during sign in";

      // Manejar diferentes tipos de errores de TMDB
      if (error.message.includes("Invalid username")) {
        errorMessage = "Invalid username or password";
      } else if (error.message.includes("Invalid password")) {
        errorMessage = "Invalid username or password";
      } else if (error.message.includes("network")) {
        errorMessage = "Network error. Please check your connection";
      } else if (error.message) {
        errorMessage = error.message;
      }

      Alert.alert("Error", errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View className="gap-2 bg-primary rounded-lg p-5  ">
      <Image source={icons.logo} className="w-20 h-16 self-center" />
      <CustomInput
        placeholder="Enter your username"
        value={form.username}
        onChangeText={(text) =>
          setForm((prev) => ({ ...prev, username: text }))
        }
        label="Username"
        keyboardType="default"
      />
      <CustomInput
        placeholder="Enter your password"
        value={form.password}
        onChangeText={(text) =>
          setForm((prev) => ({ ...prev, password: text }))
        }
        label="Password"
        secureTextEntry={true}
      />

      <TouchableOpacity
        onPress={submit}
        disabled={isSubmitting}
        className={`bg-accent rounded-xl min-h-[62px] flex flex-row justify-center items-center ${
          isSubmitting ? "opacity-50" : ""
        }`}
      >
        <Text className="text-white font-semibold text-lg">
          {isSubmitting ? "Signing In..." : "Sign In"}
        </Text>
      </TouchableOpacity>

      <View className="flex justify-center mt-5 flex-row gap-2">
        <Text className="base-regular text-gray-400">
          Don&apos;t have an account?
        </Text>
        <Link
          href="https://www.themoviedb.org/signup"
          className="base-bold text-blue-100/90"
        >
          Sign Up
        </Link>
      </View>
    </View>
  );
};

export default SignIn;
