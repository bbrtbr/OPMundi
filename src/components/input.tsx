import { VStack, Input as NativeBaseInput, IInputProps, Heading as Label } from 'native-base';
import React from 'react';

export function Input({  ...rest }: IInputProps) {
  return (
    <NativeBaseInput
      bg="green.300"
      h={14}
      size="md"
      borderWidth={0}
      fontSize="md"
      fontFamily="body"
      color="white"
      placeholderTextColor="white"
      _focus={{
        borderWidth: 1,
        borderColor: "green.500",
        bg: "green.600"
      }}
      {...rest}
    />
  );
}