import React, { useContext, useState, useEffect, useRef } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { UserContext } from '../contexts/UserContext'
import { captureRef } from 'react-native-view-shot'
import * as Sharing from 'expo-sharing'
import {
  VStack,
  Heading,
  Icon,
  useTheme,
  Image,
  Text,
  Checkbox,
  ScrollView,
  Divider,
  Center,
  HStack
} from 'native-base'
import {
  ToastAndroid,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  PixelRatio
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { defaultStorage as storage } from '../utils/firebase'
import { Input } from '../components/input'

import { Button } from '../components/button'
import { User } from 'firebase/auth'
import { ref as refs, uploadBytes, getDownloadURL } from 'firebase/storage'
export function ShareAnswer(props) {
  const { user } = useContext(UserContext)
  const targetPixelCount = 1080
  const pixelRatio = PixelRatio.get()
  const pixels = targetPixelCount / pixelRatio
  const viewRef = useRef()
  const [urlImage, setUrlImage] = useState(null)
  const [answer, setAnswer] = useState('')
  const [question, setQuestion] = useState('')
  const [backgroudCo, setBackgroundCo] = useState('')
  const [imgUrl, setImgUrl] = useState(null)
  const [result, setResult] = useState('')
  async function returnData() {
    setQuestion(await AsyncStorage.getItem('@question'))
    setAnswer(await AsyncStorage.getItem('@answer'))
    setBackgroundCo(await AsyncStorage.getItem('@backgroundColor'))
    setImgUrl(await AsyncStorage.getItem('@imageUrl'))
  }
  async function sharePic() {
    const result = await captureRef(viewRef, {
      result: 'tmpfile',
      height: pixels,
      width: pixels,
      quality: 1,
      format: 'png'
    })
    setResult(result)
    await Sharing.shareAsync(result)
  }
  async function returnImage() {
    const imageRef = refs(storage, 'imageprofile/' + user.uid)
    setUrlImage(await getDownloadURL(imageRef))
  }
  useEffect(() => {
    returnImage()
    returnData()
  }, [])

  return (
    <ScrollView>
      <VStack ref={viewRef} flex="1">
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
          <Button title="a" onPress={() => sharePic()} />
          <Text style={styles.info}>ESSA É MINHA OPINIÃO</Text>
          <Divider></Divider>
          <Text mt={'4'} style={styles.title}>
            {question}
          </Text>
          <VStack mt="3" flexDirection={'row'}>
            <HStack
              justifyContent={'center'}
              borderColor={backgroudCo != null ? backgroudCo : 'green.500'}
              borderRadius={'md'}
              p={2}
              my={2}
            >
              <Center>
                {imgUrl ? (
                  imgUrl && (
                    <Image
                      src={imgUrl}
                      resizeMode={'contain'}
                      borderRadius={5}
                      size={54}
                      height={120}
                      width={160}
                    />
                  )
                ) : (
                  <Center
                    backgroundColor={
                      backgroudCo != null ? backgroudCo : '#a2a2a2'
                    }
                    p={1}
                    mr={4}
                    borderRadius={5}
                    height={120}
                    width={160}
                  />
                )}
              </Center>
            </HStack>
            <Text>{answer}</Text>
          </VStack>
          <Image
            src={'../assets/opvestabanner.png'}
            resizeMode={'contain'}
            size={54}
          />
        </VStack>
      </VStack>
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
