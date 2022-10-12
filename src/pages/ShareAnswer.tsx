import React, { useContext, useState, useEffect } from 'react'
import { UserContext } from '../contexts/UserContext'
import {
  VStack,
  Heading,
  Icon,
  useTheme,
  Image,
  Text,
  Checkbox,
  ScrollView,
  Divider
} from 'native-base'
import {
  ToastAndroid,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { defaultStorage as storage } from '../utils/firebase'
import { Input } from '../components/input'
import { Button } from '../components/button'
import { User } from 'firebase/auth'
import { ref as refs, uploadBytes, getDownloadURL } from 'firebase/storage'
export function ShareAnswer(props) {
  const { user } = useContext(UserContext)
  const [urlImage, setUrlImage] = useState(null)
  async function returnImage() {
    const imageRef = refs(storage, 'imageprofile/' + user.uid)
    setUrlImage(await getDownloadURL(imageRef))
  }
  useEffect(() => {
    returnImage()
  }, [])
  return (
    <VStack flex="1">
      <VStack style={styles.header}></VStack>
      <Image
        style={styles.avatar}
        source={{
          uri: urlImage || 'https://bootdey.com/img/Content/avatar/avatar6.png'
        }}
      />
      <VStack mt={'12'} style={styles.bodyContent}>
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.info}>ESSA É MINHA OPINIÃO</Text>
        <Divider></Divider>
        <Text>{props.route.params.questione}</Text>
      </VStack>
    </VStack>
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
    margin: 10,
    fontSize: 20
  },
  adsBanner: {
    paddingVertical: 30,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    borderWidth: 1,
    borderColor: 'black'
  },
  containerAds: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: 1
  }
})
