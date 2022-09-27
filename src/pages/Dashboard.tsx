import React, { useState, useEffect } from 'react'

import { VStack, FlatList, Text, Modal } from 'native-base'

import { useNavigation } from '@react-navigation/native'
import type { Form } from '../models/form'
import { getFormsFromDatabase } from '../database/form'

import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { Answer } from './Answer'
import { TouchableHighlight, ToastAndroid } from 'react-native'
const Stack = createNativeStackNavigator()
function Dash({ navigation }) {
  const [forms, setForms] = useState<Form[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  const getForms = async () => {
    const formsFromDatabase: Form[] = await getFormsFromDatabase()
    setForms(formsFromDatabase)
    setLoading(false)
  }

  const refresh = () => {
    setLoading(true)
    getForms()
    setLoading(false)
  }

  useEffect(() => {
    getForms()
  }, [])
  return (
    <VStack flex={1} bg="white" px={2} pt={0}>
      <FlatList
        data={forms}
        maxToRenderPerBatch={10}
        refreshing={loading}
        onRefresh={refresh}
        style={{ flex: 1 }}
        keyExtractor={(form: Form) => form.id}
        renderItem={({ item }) => (
          <TouchableHighlight
            underlayColor="#DDDDDD"
            activeOpacity={0.6}
            onPress={() =>
              navigation.navigate('Answer', {
                question: item.question,
                items: item.items,
                idform: item.id
              })
            }
          >
            <Text
              borderRadius={'5'}
              borderWidth="1"
              padding={'8'}
              borderColor="green.200"
              color="green.400"
              fontSize="15"
              mt={6}
            >
              {item.question}
            </Text>
          </TouchableHighlight>
        )}
      />
    </VStack>
  )
}
export function Dashboard() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Dashboard" component={Dash} />
      <Stack.Screen name="Answer" component={Answer} />
    </Stack.Navigator>
  )
}
