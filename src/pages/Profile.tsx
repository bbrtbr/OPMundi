import React, { useState, useContext, useEffect } from 'react'

import { VStack, Heading, Icon, useTheme, Image } from 'native-base'
import { UserContext } from '../contexts/UserContext'
import { Button } from '../components/button'
export function Profile() {
  const { signOut } = useContext(UserContext)

  return (
    <VStack flex={1} alignItems="center" bg="white" px={8} pt={24}>
      <Button width={'100%'} title="Sair" onPress={signOut}>
        Sair
      </Button>
    </VStack>
  )
}
