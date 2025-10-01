import MovieCard from "@/components/MovieCard";
import SearchBar from "@/components/SearchBar";
import TrendingCard from "@/components/TrendingCard";
import TvCard from "@/components/TvCard";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { fetchMovies, fetchSeries } from "@/services/api";
import { getTrendingMovies } from "@/services/appwrite";
import useFetch from "@/services/useFetch";
import { useRouter } from "expo-router";

import {
  ActivityIndicator,
  FlatList,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useState } from "react";

export default function Index() {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState(1);

  const {
    data: trendingMovies,
    loading: trendingLoading,
    error: trendingError,
  } = useFetch(getTrendingMovies);

  const {
    data: movies,
    loading: moviesLoading,
    error: moviesError,
  } = useFetch(() =>
    fetchMovies({
      query: "",
    })
  );

  const {
    data: series,
    loading: seriesLoading,
    error: seriesError,
  } = useFetch(() =>
    fetchSeries({
      query: "",
    })
  );

  const localtabs = [
    {
      id: 1,
      title: "Movies",
      data: movies,
      loading: moviesLoading,
      error: moviesError,
    },
    {
      id: 2,
      title: "Series",
      data: series,
      loading: seriesLoading,
      error: seriesError,
    },
  ];

  const selectedTabData = localtabs.find((tab) => tab.id === selectedTab);

  return (
    <View className="flex-1 bg-primary ">
      <Image source={images.bg} className="absolute w-full z-0" />
      <ScrollView
        className="flex-1 px-5"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ minHeight: "100%", paddingBottom: 10 }}
      >
        <Image source={icons.logo} className="w-12 h-10 mt-20 mb-5 mx-auto" />
        {moviesLoading || trendingLoading ? (
          <ActivityIndicator
            size="large"
            color="#0000ff"
            className="mt-10 self-center"
          />
        ) : moviesError || trendingError ? (
          <Text> Error: {moviesError?.message || trendingError?.message} </Text>
        ) : (
          <View className="flex-1 mt-5">
            <SearchBar
              onPress={() => router.push("/search")}
              placeholder="Search for a movie"
            />

            {trendingMovies && (
              <View className="mt-10">
                <Text className="text-lg text-white font-bold mb-3">
                  TrendingMovies
                </Text>
              </View>
            )}

            <>
              <FlatList
                className="mb-4 mt-3"
                data={trendingMovies}
                renderItem={({ item, index }) => (
                  <TrendingCard movie={item} index={index} />
                )}
                keyExtractor={(item) => item.movie_id.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
                ItemSeparatorComponent={() => <View className="w-4" />}
              />

              <View className="flex-row gap-2 justify-between items-center ">
                <Text className="text-lg text-white font-bold mt-5 mb-3">
                  Latest
                </Text>
                <View className="flex-row gap-2">
                  {localtabs.map((tab) => (
                    <TouchableOpacity
                      key={tab.id}
                      onPress={() => setSelectedTab(tab.id)}
                      activeOpacity={0.7}
                    >
                      <Text
                        className={`text-md font-bold mt-5 mb-3 px-2 py-1 rounded-full ${
                          selectedTab === tab.id
                            ? "bg-violet-400 text-black"
                            : "bg-violet-100/40 text-black/60"
                        }`}
                      >
                        {tab.title}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {selectedTabData?.loading ? (
                <ActivityIndicator
                  size="large"
                  color="#0000ff"
                  className="mt-10 self-center"
                />
              ) : selectedTabData?.error ? (
                <Text> Error: {selectedTabData.error?.message} </Text>
              ) : selectedTab === 1 ? (
                <FlatList
                  data={movies}
                  renderItem={({ item }) => <MovieCard {...item} />}
                  keyExtractor={(item) => item.id.toString()}
                  numColumns={3}
                  columnWrapperStyle={{
                    justifyContent: "flex-start",
                    gap: 20,
                    paddingRight: 5,
                    marginBottom: 10,
                  }}
                  className="mt-2 pb-32"
                  scrollEnabled={false}
                />
              ) : (
                <FlatList
                  data={series}
                  renderItem={({ item }) => <TvCard {...item} />}
                  keyExtractor={(item) => item.id.toString()}
                  numColumns={3}
                  columnWrapperStyle={{
                    justifyContent: "flex-start",
                    gap: 20,
                    paddingRight: 5,
                    marginBottom: 10,
                  }}
                  className="mt-2 pb-32"
                  scrollEnabled={false}
                />
              )}
            </>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
