import React, { useState, useContext } from 'react'
import { UserContext } from '../contexts/UserContext'
import { VStack, Heading, Icon, useTheme, Image } from 'native-base'
import { Ionicons } from '@expo/vector-icons'

import { Input } from '../components/input'
import { Button } from '../components/button'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

export function Dashboard() {
  return (
    <VStack flex={1} alignItems="center" bg="gray.600" px={8} pt={24}></VStack>
  )
}
