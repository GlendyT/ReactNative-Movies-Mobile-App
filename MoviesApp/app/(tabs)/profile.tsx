import Profiledetails from "@/components/ProfileDetails";
import { useAuth } from "@/context/AuthContext";
import {
  fetchFavoriteMovies,
  fetchFavoriteTVShows,
  fetchLists,
  fetchProfile,
} from "@/services/api";
import useFetch from "@/services/useFetch";
import {
  AntDesign,
  Feather,
  FontAwesome,
  FontAwesome5,
  MaterialCommunityIcons,
  MaterialIcons,
  SimpleLineIcons,
} from "@expo/vector-icons";
import { Link, router } from "expo-router";
import React from "react";
import {
  Alert,
  FlatList,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface FavoriteProps {
  id: number;
  name: string;
  fetch: any;
  route: string;
  image: React.ReactNode;
}

const Profile = () => {
  const { user, sessionId, accountId, logout, isAuthenticated, isLoading: authLoading } = useAuth();
  
  // Usar el sessionId y accountId para las llamadas a la API
  const { data: profile } = useFetch(() => 
    sessionId ? fetchProfile(sessionId) : Promise.resolve(user), 
    !authLoading && isAuthenticated
  );
  const { data: favorites } = useFetch(() => 
    sessionId && accountId ? fetchFavoriteMovies(sessionId, accountId) : Promise.resolve([]),
    !authLoading && isAuthenticated
  );
  const { data: series } = useFetch(() => 
    sessionId && accountId ? fetchFavoriteTVShows(sessionId, accountId) : Promise.resolve([]),
    !authLoading && isAuthenticated
  );
  const { data: list } = useFetch(() => 
    sessionId && accountId ? fetchLists(sessionId, accountId) : Promise.resolve({ results: [] }),
    !authLoading && isAuthenticated
  );
  const handleLogout = async () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            try {
              await logout();
              router.replace("/(auth)/sign-in");
            } catch (error) {
              console.error("Error during logout:", error);
              Alert.alert("Error", "Failed to logout. Please try again.");
            }
          },
        },
      ]
    );
  };

  const favorite: FavoriteProps[] = [
    {
      id: 1,
      name: "Movies",
      fetch: favorites?.results || [],
      route: "/favoritemovies",
      image: (
        <MaterialCommunityIcons
          name="movie-open-outline"
          size={24}
          color="white"
        />
      ),
    },
    {
      id: 2,
      name: "Series",
      fetch: series || [],
      route: "/favoritetvshows",
      image: <FontAwesome name="tv" size={24} color="white" />,
    },
    {
      id: 3,
      name: " Lists",
      fetch: list?.results || [],
      route: "/lists",
      image: <AntDesign name="unordered-list" size={24} color="white" />,
    },
  ];

  return (
    <SafeAreaView className="bg-primary flex-1  ">
      <View className="flex-row justify-center flex pt-14">
        <View className="flex flex-col items-center relative ">
          <Image
            source={{
              uri: `https://media.themoviedb.org/t/p/w300_and_h300_face${profile?.avatar?.tmdb?.avatar_path}`,
            }}
            className="size-24 rounded-full"
          />
          <Text className="text-xl text-white capitalize font-quicksand-bold">
            {profile?.username}
          </Text>
        </View>
      </View>

      <ScrollView className="px-5 mt-10 flex-1 ">
        <Text className="text-white text-2xl font-extrabold text-center">
          Account Info
        </Text>
        <Profiledetails
          title="User"
          subtitle={profile?.username}
          icon={<Feather name="user" size={24} color="white" />}
        />
        <Profiledetails
          title="Name"
          subtitle={profile?.name}
          icon={<FontAwesome5 name="user" size={24} color="white" />}
        />
        <Profiledetails
          title="Language"
          subtitle={profile?.iso_639_1}
          icon={<MaterialIcons name="language" size={24} color="white" />}
        />
        <Profiledetails
          title="Country"
          subtitle={profile?.iso_3166_1}
          icon={
            <MaterialCommunityIcons
              name="home-city-outline"
              size={24}
              color="white"
            />
          }
        />
        <View className="border border-blue-800/90 mt-10  " />
        <View className="flex items-center justify-center mt-10 ">
          <FlatList
            data={favorite}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <Link
                href={item.route as any}
                asChild
                key={item.id}
                className="w-auto"
              >
                <TouchableOpacity className="bg-blue-800/80 px-6 py-3 rounded-lg  items-center">
                  {item.image}
                  <Text className="text-white text-lg">{item.name}</Text>
                </TouchableOpacity>
              </Link>
            )}
            ItemSeparatorComponent={() => <View className="w-4" />}
          />
        </View>

        <View className="flex flex-col gap-4 mt-10">
          <TouchableOpacity
            className="flex flex-row gap-4 w-full items-center justify-center text-red-500  py-3 border-2 border-red-500 rounded-full"
            onPress={handleLogout}
          >
            <SimpleLineIcons name="logout" size={24} color="red" />
            <Text className="text-red-500 mr-2">Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;
