import React, { useState, useContext } from 'react'
import { UserContext } from '../contexts/UserContext'
import { ToastAndroid, TouchableOpacity } from 'react-native'
import {
  VStack,
  Heading,
  Image,
  FlatList,
  Text,
  Box,
  Center,
  HStack
} from 'native-base'
import type { Answer } from '../models/answer'
import type { QuestionItem } from '../models/questionItem'
import type { User } from '../models/user'
import { Button } from '../components/button'
import { updateAnswerInDatabase } from '../database/answer'
import { format } from 'date-fns'

export function FormPage(props) {
  const [selectedItem, setSelectedItem] = useState<QuestionItem | null>(null)
  const { user }: { user: User } = useContext(UserContext)

  async function sendAnswerToDatabase() {
    const currentDate: Date = new Date()
    const answer: Answer = {
      backgroundColor: selectedItem.backgroundColor,
      itemText: selectedItem.itemText,
      name: user.name,
      imageUrl: selectedItem.imageUrl,
      replyDate: format(currentDate, 'yyyy-MM-dd HH:mm:ss')
    }

    await updateAnswerInDatabase(
      props.route.params.formId,
      user.uid,
      answer
    ).then(() => {
      props.navigation.goBack()
      ToastAndroid.show('Resposta enviada', ToastAndroid.LONG)
    })
  }

  return (
    <VStack flex={1} bg="white" px={2} pb={4}>
      <Heading fontSize={'lg'} mt={4} mb={4}>
        {props.route.params.question}
      </Heading>
      <HStack
        justifyContent={'center'}
        borderColor={
          selectedItem?.backgroundColor != null
            ? selectedItem.backgroundColor
            : 'green.500'
        }
        borderRadius={'md'}
        p={2}
        my={2}
      >
        <Center>
          <Center
            backgroundColor={
              selectedItem?.backgroundColor != null
                ? selectedItem.backgroundColor
                : '#a2a2a2'
            }
            p={1}
            mr={4}
            borderRadius={'full'}
            width={63}
            height={63}
          ></Center>
        </Center>
      </HStack>

      <FlatList
        data={props.route.params.items}
        style={{ flex: 1 }}
        marginBottom={4}
        keyExtractor={(item: QuestionItem) => item.backgroundColor}
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {
              setSelectedItem(item)
            }}
          >
            <HStack
              borderWidth={1}
              borderColor={
                selectedItem?.backgroundColor === item.backgroundColor
                  ? item.backgroundColor
                  : 'white'
              }
              borderRadius={'md'}
              p={2}
              my={2}
            >
              <Center>
                <Center
                  backgroundColor={item.backgroundColor}
                  p={1}
                  mr={4}
                  borderRadius={'full'}
                  width={63}
                  height={63}
                >
                  {item.imageUrl && (
                    <Image
                      src={item.imageUrl}
                      resizeMode={'contain'}
                      borderRadius={'full'}
                      size={54}
                      alt={item.itemText}
                    />
                  )}
                </Center>
              </Center>
              <Box flex={1} justifyContent={'center'} alignItems={'flex-start'}>
                <Text fontSize={'md'}>{item.itemText}</Text>
              </Box>
            </HStack>
          </TouchableOpacity>
        )}
      />
      <VStack alignItems="center">
        <Button
          onPress={sendAnswerToDatabase}
          title="Enviar"
          width={'100%'}
          isDisabled={selectedItem === null}
        />
      </VStack>
    </VStack>
  )
}
