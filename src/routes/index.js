import React, { useContext, useState } from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { NavigationContainer } from '@react-navigation/native'
import { UserContext } from '../contexts/UserContext'
import { Register } from '../pages/Register'
import { Dashboard } from '../pages/Dashboard'
import { Profile } from '../pages/Profile'
import { useTheme } from 'native-base'
import { Ionicons } from '@expo/vector-icons'
export default function Routes() {
  const { user } = useContext(UserContext)
  const { colors } = useTheme()
  const Tab = createBottomTabNavigator()
  return (
    <NavigationContainer>
      <>
        {user ? (
          <Tab.Navigator
            screenOptions={({ route }) => ({
              tabBarIcon: ({ focused, color, size }) => {
                let iconName

                if (route.name === 'Dashboard') {
                  iconName = 'document-text-outline'
                } else if (route.name === 'Perfil') {
                  iconName = 'person'
                }
                return <Ionicons name={iconName} size={size} color={color} />
              },
              tabBarActiveTintColor: colors.green[600],
              tabBarInactiveTintColor: colors.green[800],
              tabBarStyle: {
                backgroundColor: colors.white
              },
              headerShown: false
            })}
          >
            <Tab.Screen name="Dashboard" component={Dashboard} />
            <Tab.Screen name="Perfil" component={Profile} />
          </Tab.Navigator>
        ) : (
          <Register />
        )}
      </>
    </NavigationContainer>
  )
}
