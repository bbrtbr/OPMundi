import React, { useContext, useState, useEffect } from 'react'

import {
  ToastAndroid,
  TouchableHighlight,
  StyleSheet,
  Image,
  TouchableOpacity,
  View
} from 'react-native'
import { VStack, Heading, Text, Divider, ScrollView } from 'native-base'
import { useIsFocused } from '@react-navigation/native'
import * as ImagePicker from 'expo-image-picker'
import { UserContext } from '../contexts/UserContext'
import {
  AdMobBanner,
  AdMobInterstitial,
  AdMobRewarded,
  PublisherBanner
} from 'expo-ads-admob'
import type { User } from '../models/user'
import { ref, set, update, getDatabase } from 'firebase/database'
import { Button } from '../components/button'
import { manipulateAsync, FlipType, SaveFormat } from 'expo-image-manipulator'
import {
  ref as refs,
  uploadBytes,
  getDownloadURL,
  listAll,
  deleteObject
} from 'firebase/storage'
import { Input } from '../components/input'
import { defaultStorage as storage } from '../utils/firebase'
export function Profile() {
  const { user }: { user: User } = useContext(UserContext)
  const { signOut } = useContext(UserContext)
  const [editT, setEditT] = useState(false)
  const [newName, setNewName] = useState(user.name)
  const [newPhone, setNewPhone] = useState(user.phone)
  const [urlImage, setUrlImage] = useState(null)
  const isFocused = useIsFocused()
  function updateName() {
    const db = getDatabase()
    update(ref(db, 'users/' + user.uid), {
      name: newName,
      phone: newPhone
    })
    setEditT(false)
    ToastAndroid.show('Informações salvas!', ToastAndroid.LONG)
  }
  async function returnImage() {
    const imageRef = refs(storage, 'imageprofile/' + user.uid)
    setUrlImage(await getDownloadURL(imageRef))
  }
  useEffect(() => {
    isFocused && returnImage()
  }, [isFocused])
  async function uploadImage() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3]
    })

    if (result.cancelled === false) {
      const imageRef = refs(storage, 'imageprofile/' + user.uid)
      const blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        xhr.onload = function () {
          resolve(xhr.response)
        }
        xhr.onerror = function (e) {
          reject(new TypeError('Network request failed'))
        }
        xhr.responseType = 'blob'
        xhr.open('GET', result.uri, true)
        xhr.send(null)
      })
      await uploadBytes(imageRef, blob as Blob)
      blob.close()

      ToastAndroid.show('Foto enviada com sucesso!', ToastAndroid.LONG)
    }
  }
  return (
    <ScrollView>
      <VStack flex="1">
        <VStack style={styles.header}></VStack>
        <Image
          style={styles.avatar}
          source={{
            uri:
              urlImage || 'https://bootdey.com/img/Content/avatar/avatar6.png'
          }}
        />

        <VStack mt={'12'} style={styles.bodyContent}>
          {editT ? (
            <TouchableOpacity onPress={uploadImage}>
              <Text mb="2" style={styles.info}>
                Editar foto
              </Text>
            </TouchableOpacity>
          ) : null}
          {editT ? (
            <>
              <Text style={styles.name}>Nome:</Text>
              <Input
                value={newName}
                onChangeText={text => setNewName(text)}
                placeholder="Nome:"
              />
            </>
          ) : (
            <Text style={styles.name}> {user.name}</Text>
          )}
          <Divider my="2"></Divider>
          <Text style={styles.info}>Email: {user.email}</Text>
          <Divider my="2"></Divider>
          {editT ? (
            <>
              <Text style={styles.info} my={1}>
                Telefone:
              </Text>
              <Input
                value={newPhone}
                onChangeText={text => setNewPhone(text)}
                placeholder="Telefone:"
              />
            </>
          ) : (
            <Text style={styles.info}>Telefone: {user.phone}</Text>
          )}
          <Divider my="2"></Divider>
          <Text style={styles.info}>Estado: {user.state}</Text>
          <Divider my="2"></Divider>
          <Text style={styles.info}>Cidade: {user.city}</Text>
          <Divider my="2"></Divider>
          <Text style={styles.info}>Bairro: {user.district}</Text>
          <Divider my="2"></Divider>
          <VStack mt="3" flexDirection={'row'}>
            <Button
              width={'50%'}
              mr="2"
              title="Editar"
              onPress={() => setEditT(true)}
            />

            {editT ? (
              <Button
                width={'50%'}
                title="Salvar"
                onPress={updateName}
              ></Button>
            ) : null}
          </VStack>
        </VStack>
      </VStack>
    </ScrollView>
  )
}
const styles = StyleSheet.create({
  header: {
    backgroundColor: '#004987',
    height: 200
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
    marginTop: 130
  },
  name: {
    fontSize: 22,
    color: '#004987',
    fontWeight: '600'
  },
  info: {
    fontSize: 17,
    color: '#004987',
    fontWeight: '600'
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
  example: {
    paddingVertical: 10
  }
})
