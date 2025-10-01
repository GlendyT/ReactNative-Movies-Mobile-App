import React from "react";
import { Image, ImageSourcePropType, Text, View } from "react-native";

interface ProfileDetailsProps {
  title: string;
  subtitle: string | number | undefined;
  icon?: ImageSourcePropType | React.JSX.Element;
}

const Profiledetails = ({ title, subtitle, icon }: ProfileDetailsProps) => {
  return (
    <View className="flex flex-row items-center justify-between py-3">
      <View className="flex flex-row items-center justify-center   gap-4  ">
        <View className="size-10 w-14 h-14 bg-blue-800/80 rounded-full  flex items-center justify-center">
          {React.isValidElement(icon) ? (
            icon
          ) : (
            <Image source={icon as ImageSourcePropType} className="size-4" />
          )}
        </View>
        <View className="flex flex-col">
          <Text className="text-sm font-rubik-medium text-gray-500">
            {" "}
            {title}{" "}
          </Text>
          <Text className="text-xl text-white font-rubik-medium text-black-300  ">
            {subtitle}{" "}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default Profiledetails;
