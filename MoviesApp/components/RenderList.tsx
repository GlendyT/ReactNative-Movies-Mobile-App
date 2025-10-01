import React from "react";
import { ActivityIndicator, FlatList, Text, View } from "react-native";

interface RenderListProps {
  data: any[];
  loadingError: boolean;
  dataError: Error | null;
  renderCard: (item: any) => React.ReactElement;
}

const RenderList = ({
  data,
  loadingError,
  dataError,
  renderCard,
}: RenderListProps) => {
  return (
    <>
      <FlatList
        data={data}
        renderItem={({ item }) => renderCard(item)}
        keyExtractor={(item) => item.id.toString()}
        className="px-5"
        numColumns={3}
        columnWrapperStyle={{
          justifyContent: "center",
          gap: 16,
          paddingRight: 16,
        }}
        contentContainerStyle={{ paddingBottom: 100 }}
        ListHeaderComponent={
          <>
            {loadingError && (
              <ActivityIndicator
                size="large"
                color="#0000ff"
                className="my-3"
              />
            )}
            {dataError && (
              <Text className="text-white text-lg">
                Error: {dataError?.message}
              </Text>
            )}
          </>
        }
        ListEmptyComponent={
          !loadingError && !dataError ? (
            <View className="mt-10 px-5">
              <Text className="text-center text-gray-500">
                {data?.length === 0
                  ? "No saved movies found."
                  : "No movies found."}
              </Text>
            </View>
          ) : null
        }
      />
    </>
  );
};

export default RenderList;
