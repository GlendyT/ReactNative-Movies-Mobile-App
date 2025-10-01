import MovieCard from "@/components/MovieCard";
import RenderList from "@/components/RenderList";
import TvCard from "@/components/TvCard";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { useAuth } from "@/context/AuthContext";
import { fetchListItems, fetchLists } from "@/services/api";
import useFetch from "@/services/useFetch";
import { router } from "expo-router";
import React, { useState } from "react";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";

const Lists = () => {
  const { sessionId, accountId } = useAuth();
  
  const {
    data: lists,
    loading: seriesLoading,
    error: seriesError,
  } = useFetch(() => sessionId && accountId ? fetchLists(sessionId, accountId) : Promise.resolve({ results: [] }));
  const [selectedListId, setSelectedListId] = useState<number | null>(null);
  const [listItems, setListItems] = React.useState<any[]>([]);
  const [loadingItems, setLoadingItems] = React.useState(false);

  const handleSelectList = async (listId: number) => {
    if (selectedListId === listId) {
      setSelectedListId(null);
      setListItems([]);
      return;
    }
    setSelectedListId(listId);
    setLoadingItems(true);
    try {
      const items = await fetchListItems(listId); // Debes implementar esta función en tu API
      setListItems(items?.results || []);
    } catch {
      setListItems([]);
    }
    setLoadingItems(false);
  };

  return (
    <View className="bg-primary flex-1 ">
      <Image source={images.bg} className="flex-1 absolute w-full z-0" />
      <View className="w-full flex-row justify-center mt-20">
        <Image source={icons.logo} className="w-12 h-10" />
      </View>
      <View className="my-5">
        <Text className="text-white text-2xl font-bold text-center">
          Your Lists
        </Text>
      </View>

      <FlatList
        data={lists?.results || []}
        keyExtractor={(item) => item.id.toString()}
        className="px-5"
        contentContainerStyle={{ paddingBottom: 100 }}
        renderItem={({ item }) => (
          <View className="w-full flex-col justify-center ">
            <TouchableOpacity
              className="mb-4 bg-gray-800 p-8 rounded-lg"
              onPress={() => handleSelectList(item.id)}
            >
              <Text className="text-white text-lg font-bold">{item.name}</Text>
              <Text className="text-gray-400">{item.description}</Text>
              <Text className="text-gray-500 text-sm mt-2">
                {item.item_count} items
              </Text>
            </TouchableOpacity>
            {selectedListId === item.id && (
              <View className="bg-gray-900 rounded-lg p-4 mb-4">
                {loadingItems ? (
                  <Text className="text-white">Loading...</Text>
                ) : listItems.length === 0 ? (
                  <Text className="text-gray-400">No items found.</Text>
                ) : (
                  <RenderList
                    data={listItems || []}
                    loadingError={seriesLoading}
                    dataError={seriesError}
                    renderCard={(item) =>
                      item.media_type === "movie" ? (
                        <MovieCard {...item} />
                      ) : (
                        <TvCard {...item} />
                      )
                    }
                  />
                )}
              </View>
            )}
          </View>
        )}
      />

      <TouchableOpacity
        className="absolute bottom-10 left-0 right-0 mx-5 bg-accent rounded-lg py-3.5 flex flex-row items-center justify-center z-50"
        onPress={router.back}
      >
        <Image
          source={icons.arrow}
          className="size-5 mr-1 mt-0.5 rotate-180"
          tintColor="#fff"
        />
        <Text className="text-white font-semibold text-base">Go back</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Lists;
