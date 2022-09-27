import React, { FC, useState, useContext, useEffect } from 'react'
import { UserContext } from '../contexts/UserContext'
import { ToastAndroid, TouchableOpacity } from 'react-native'
import {
  VStack,
  Heading,
  Icon,
  useTheme,
  Image,
  FlatList,
  Text,
  Box,
  StatusBar,
  Circle,
  Center,
  Square
} from 'native-base'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Ionicons } from '@expo/vector-icons'
import type { Form } from '../models/form'
import { Button } from '../components/button'
import { QuestionItem } from '../models/questionItem'
import { getDatabase, ref, update } from 'firebase/database'
export function Answer(props) {
  const [answer, setAnswer] = useState('')
  const [bg, setBg] = useState('white')
  const { user } = useContext(UserContext)
  function sendDataBase() {
    const db = getDatabase()
    const reference = ref(
      db,
      'forms/' + props.route.params.idform + '/answer/' + user.uid
    )
    update(reference, {
      answer: answer
    })
    ToastAndroid.show('Resposta enviada', ToastAndroid.LONG)
  }
  return (
    <VStack flex={1} bg="white" px={2} pt={0}>
      <Heading mb="4">{props.route.params.question}</Heading>
      <FlatList
        data={props.route.params.items}
        style={{ flex: 1 }}
        keyExtractor={(item: QuestionItem) => item.backgroundColor}
        renderItem={({ item }) => (
          <>
            <Text
              onPress={() => {
                // eslint-disable-next-line no-unused-expressions
                setAnswer(item.itemText)
                setBg(item.backgroundColor)
              }}
              mb={'8'}
            >
              {' '}
              <Circle size={'50'} bg={item.backgroundColor}></Circle>{' '}
              {item.itemText}
            </Text>
          </>
        )}
      />
      <VStack alignItems="center">
        <Heading mb="3">Resposta:</Heading>
        <Circle bg={bg} mb="3" borderColor={'green.300'} size="60px"></Circle>
        <Button onPress={sendDataBase} title="Enviar" width={'100%'} />
      </VStack>
    </VStack>
  )
}
