import React, { useContext } from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { NavigationContainer } from '@react-navigation/native'
import { UserContext } from '../contexts/UserContext'
import { Register } from '../pages/Register'
import { Dashboard } from '../pages/Dashboard'
import { Profile } from '../pages/Profile'
import { useTheme } from 'native-base'
import { Ionicons } from '@expo/vector-icons'
import { StatusBar } from 'expo-status-bar'

const BottomTab = createBottomTabNavigator()

export default function Routes() {
  const { user } = useContext(UserContext)
  const { colors } = useTheme()

  return (
    <NavigationContainer>
      <>
        <StatusBar
          translucent={false}
          backgroundColor={colors.green[600]}
          style="light"
        />
        {user ? (
          <BottomTab.Navigator
            screenOptions={({ route }) => ({
              tabBarIcon: ({ color, size }) => {
                let iconName
                if (route.name === 'Home') {
                  iconName = 'document-text'
                } else if (route.name === 'Perfil') {
                  iconName = 'person'
                }
                return <Ionicons name={iconName} size={size} color={color} />
              },
              tabBarActiveTintColor: colors.white,
              tabBarInactiveTintColor: colors.green[400],
              tabBarStyle: {
                backgroundColor: colors.green[800],
                height: 54
              },
              tabBarShowLabel: false,
              headerShown: false
            })}
          >
            <BottomTab.Screen name="Home" component={Dashboard} />
            <BottomTab.Screen name="Perfil" component={Profile} />
          </BottomTab.Navigator>
        ) : (
          <Register />
        )}
      </>
    </NavigationContainer>
  )
}
