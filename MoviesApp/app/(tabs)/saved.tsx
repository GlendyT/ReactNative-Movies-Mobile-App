import MovieCard from "@/components/MovieCard";
import RenderList from "@/components/RenderList";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { fetchWatchList } from "@/services/api";
import useFetch from "@/services/useFetch";
import React from "react";
import { Image, Text, View } from "react-native";

const Saved = () => {
  const { data: watchList, loading, error } = useFetch(() => fetchWatchList());

  return (
    <View className="bg-primary flex-1 ">
      <Image source={images.bg} className="flex-1 absolute w-full z-0" />
      <View className="w-full flex-row justify-center mt-20">
        <Image source={icons.logo} className="w-12 h-10" />
      </View>
      <View className="my-5">
        <Text className="text-white text-2xl font-bold text-center">
          Saved
        </Text>
      </View>
      <RenderList
        data={watchList || []}
        loadingError={loading}
        dataError={error}
        renderCard={(item) => <MovieCard {...item} />}
      />
    </View>
  );
};

export default Saved;
