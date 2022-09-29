import React, { useState, useEffect, useContext } from 'react'
import { UserContext } from '../contexts/UserContext'
import {
  VStack,
  FlatList,
  Text,
  Heading,
  Button,
  Divider,
  Box,
  HStack,
  Circle,
  Image
} from 'native-base'
import type { Form } from '../models/form'
import type { User } from '../models/user'
import { getFormsFromDatabase } from '../database/form'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { FormPage } from './FormPage'

const Stack = createNativeStackNavigator()

function Dash({ navigation }) {
  const { user }: { user: User } = useContext(UserContext)
  const [forms, setForms] = useState<Form[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  const navigateToFormPage = () => (form: Form) => () => {
    navigation.navigate('FormPage', {
      formId: form.id,
      question: form.question,
      items: form.items
    })
  }

  const getForms = async () => {
    setLoading(true)
    const formsFromDatabase: Form[] = await getFormsFromDatabase()
    setForms(formsFromDatabase)
    setLoading(false)
  }

  useEffect(() => {
    getForms()
  }, [])

  const formsToBeAnswered = forms.filter(form => {
    const answers = form.answers
    if (!answers) return true
    const keys: string[] = Object.keys(answers)
    return !keys.includes(user.uid)
  })

  const formsAlreadyAnswered = forms.filter(form => {
    const answers = form.answers
    if (!answers) return false
    const keys: string[] = Object.keys(answers)
    return keys.includes(user.uid)
  })

  return (
    <VStack flex={1} bg="white" px={4} pt={0}>
      <Heading my={2}>Minhas opiniões</Heading>
      <VStack flex={1}>
        <Text fontSize={'md'} my={2}>
          A serem respondidas
        </Text>
        <Divider mb={2} />
        <FlatList
          data={formsToBeAnswered}
          maxToRenderPerBatch={10}
          refreshing={loading}
          onRefresh={getForms}
          style={{ flex: 1 }}
          keyExtractor={(form: Form) => form.id}
          renderItem={({ item }) => (
            <Button
              borderWidth={1}
              borderColor="green.500"
              backgroundColor={'white'}
              marginY={'2'}
              justifyContent={'flex-start'}
              alignItems={'center'}
              onPress={navigateToFormPage()(item)}
            >
              <Text color="gray.400" fontSize="16" marginY={2}>
                {item.question}
              </Text>
            </Button>
          )}
        />
      </VStack>
      {formsAlreadyAnswered.length > 0 && (
        <VStack flex={1}>
          <Text fontSize={'md'} my={2}>
            Já respondidas
          </Text>
          <Divider mb={2} />
          <FlatList
            data={formsAlreadyAnswered}
            maxToRenderPerBatch={10}
            refreshing={loading}
            onRefresh={getForms}
            style={{ flex: 1 }}
            keyExtractor={(form: Form) => form.id}
            renderItem={({ item }) => (
              <Box
                borderWidth={1}
                borderColor="green.500"
                margin={2}
                p={2}
                alignItems={'flex-start'}
                borderRadius={'md'}
              >
                <VStack>
                  <Text color="gray.400" fontSize="16" mb={2}>
                    {item.question}
                  </Text>
                </VStack>
                <HStack>
                  <Circle
                    backgroundColor={item.answers[user.uid].backgroundColor}
                    p={1}
                    mr={2}
                    borderRadius={'full'}
                    width={10}
                    height={10}
                  >
                    {item.answers[user.uid].imageUrl && (
                      <Image
                        src={item.answers[user.uid].imageUrl}
                        resizeMode={'contain'}
                        borderRadius={'full'}
                        size={8}
                        alt={item.answers[user.uid].itemText}
                      />
                    )}
                  </Circle>
                  <Text color="gray.400" fontSize="16" mt={2} isTruncated>
                    {item.answers[user.uid].itemText}
                  </Text>
                </HStack>
              </Box>
            )}
          />
        </VStack>
      )}
    </VStack>
  )
}

export function Dashboard() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Dashboard" component={Dash} />
      <Stack.Screen name="FormPage" component={FormPage} />
    </Stack.Navigator>
  )
}
