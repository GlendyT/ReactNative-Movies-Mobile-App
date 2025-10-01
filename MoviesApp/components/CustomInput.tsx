import { Text, TextInput, View } from "react-native";

const CustomInput = ({
  placeholder = "Enter text",
  value,
  onChangeText,
  label,
  secureTextEntry,
  keyboardType = "default",
}: CustomInputProps) => {
  return (
    <View className="w-full border border-white/50 rounded-lg ">
      <Text className="text-gray-200 pl-2 pt-2 ">{label} </Text>
      <TextInput
        autoCapitalize="none"
        autoCorrect={false}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        placeholder={placeholder}
        placeholderTextColor="#636161"
        className={`text-white  `}
      />
    </View>
  );
};

export default CustomInput;
