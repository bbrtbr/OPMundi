import React, { useState, useContext, useEffect } from 'react';

import { VStack, Heading, Icon, useTheme, Image } from 'native-base';
import { UserContext } from '../contexts/UserContext';
import { Button } from '../components/button';
export function Profile() {
  
  const { signOut } = useContext(UserContext);

  useEffect(() => {
    signOut();
  }, []);
  return (
    <VStack flex={1} alignItems="center" bg="gray.600" px={8} pt={24}>
    
    <Button onPress={signOut}>Sair</Button>
    </VStack>
    
  )
}