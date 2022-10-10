import { Input as NativeBaseInput, IInputProps } from 'native-base'
import React from 'react'

export function Input({ ...rest }: IInputProps) {
  return (
    <NativeBaseInput
      bg="white"
      h={14}
      size="md"
      borderColor={'green.500'}
      borderWidth={1}
      fontSize="md"
      fontFamily="body"
      color="#004987"
      placeholderTextColor="#004987"
      _focus={{
        borderWidth: 1,
        borderColor: 'green.600',
        bg: 'white'
      }}
      {...rest}
    />
  )
}
