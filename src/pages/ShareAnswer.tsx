import React, {
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback
} from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { UserContext } from '../contexts/UserContext'
import ViewShot from 'react-native-view-shot'
import * as Sharing from 'expo-sharing'
import {
  VStack,
  Image,
  Text,
  ScrollView,
  Divider,
  Center,
  HStack
} from 'native-base'
import { StyleSheet } from 'react-native'
import { defaultStorage as storage } from '../utils/firebase'
import { ref as refs, getDownloadURL } from 'firebase/storage'

export function ShareAnswer() {
  const { user } = useContext(UserContext)
  const viewRef = useRef()
  const [urlImage, setUrlImage] = useState(null)
  const [answer, setAnswer] = useState('')
  const [question, setQuestion] = useState('')
  const [backgroundColor, setBackgroundColor] = useState('')
  const [imgUrl, setImgUrl] = useState(null)

  async function returnData() {
    setQuestion(await AsyncStorage.getItem('@question'))
    setAnswer(await AsyncStorage.getItem('@answer'))
    setBackgroundColor(await AsyncStorage.getItem('@backgroundColor'))
    setImgUrl(await AsyncStorage.getItem('@imageUrl'))
  }

  const returnImage = useCallback(async () => {
    const imageRef = refs(storage, 'imageprofile/' + user.uid)
    setUrlImage(await getDownloadURL(imageRef))
  }, [user.uid])

  const clearImage = async () => {
    await AsyncStorage.removeItem('@imageUrl')
  }

  useEffect(() => {
    returnImage()
    returnData()
    capturePhoto()
    return () => {
      clearImage()
    }
  }, [returnImage])

  async function capturePhoto() {
    if (viewRef.current) {
      // @ts-ignore
      const imageURI = await viewRef.current.capture()
      await Sharing.shareAsync(imageURI)
    }
  }

  return (
    <ScrollView>
      <ViewShot
        ref={viewRef}
        style={{ flex: 1 }}
        options={{ format: 'jpg', quality: 1.0 }}
      >
        <VStack backgroundColor={'white'} flex="1">
          <VStack style={styles.header}></VStack>
          <Image
            style={styles.avatar}
            source={{
              uri:
                urlImage || 'https://bootdey.com/img/Content/avatar/avatar6.png'
            }}
          />
          <VStack mt={'10'} style={styles.bodyContent}>
            <Text style={styles.name}>{user.name}</Text>

            <Text style={styles.info}>ESSA É MINHA OPINIÃO</Text>
            <Divider></Divider>
            <Text mt={'4'} style={styles.title}>
              {question}
            </Text>

            <HStack
              justifyContent={'center'}
              borderColor={
                backgroundColor != null ? backgroundColor : 'green.500'
              }
              borderRadius={'md'}
              p={2}
              my={2}
            >
              <Center
                backgroundColor={backgroundColor ?? '#a2a2a2'}
                p={1}
                mr={4}
                size={54}
                borderRadius={'sm'}
                height={120}
                width={160}
              >
                {imgUrl && (
                  <Image
                    src={imgUrl}
                    resizeMode={'contain'}
                    size={54}
                    height={120}
                    width={160}
                  />
                )}
              </Center>
            </HStack>
            <Text mt={'4'} style={styles.title}>
              {answer}
            </Text>
          </VStack>
          <Divider my="6"></Divider>
          <Image
            source={require('../assets/opvestabanner.png')}
            width={'100%'}
            height={'90'}
            resizeMode="contain"
          />
        </VStack>
      </ViewShot>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#004987',
    height: 120
  },
  avatar: {
    width: 130,
    height: 130,
    borderRadius: 63,
    borderWidth: 4,
    borderColor: 'white',
    marginBottom: 10,
    alignSelf: 'center',
    position: 'absolute',
    marginTop: 80
  },
  name: {
    fontSize: 22,
    color: '#004987',
    fontWeight: '400',
    marginTop: 25,
    marginBottom: 30
  },
  info: {
    fontSize: 18,
    color: 'red'
  },
  bodyContent: {
    flex: 1,
    alignItems: 'center',
    padding: 30
  },
  title: {
    fontSize: 22,
    color: 'black'
  }
})
