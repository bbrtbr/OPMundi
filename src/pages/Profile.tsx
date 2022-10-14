import React, { useContext, useState, useEffect, useCallback } from 'react'
import { ToastAndroid, StyleSheet, Image, TouchableOpacity } from 'react-native'
import { VStack, Text, Divider, ScrollView, Modal } from 'native-base'
import { useIsFocused } from '@react-navigation/native'
import * as ImagePicker from 'expo-image-picker'
import { UserContext } from '../contexts/UserContext'
import type { User } from '../models/user'
import { ref, update, getDatabase } from 'firebase/database'
import { Button } from '../components/button'
import { ref as refs, uploadBytes, getDownloadURL } from 'firebase/storage'
import { Input } from '../components/input'
import { defaultStorage as storage } from '../utils/firebase'

export function Profile() {
  const { user }: { user: User } = useContext(UserContext)
  const { deleteAccount } = useContext(UserContext)

  const [editT, setEditT] = useState(false)
  const [newName, setNewName] = useState(user.name)
  const [newPhone, setNewPhone] = useState(user.phone)
  const [urlImage, setUrlImage] = useState(null)
  const [urlImageAds, setUrlImageAds] = useState(null)
  const [showModalLocal, setShowModalLocal] = useState(false)
  const isFocused = useIsFocused()

  const returnAds = useCallback(async () => {
    const imageAds = refs(storage, 'stateannounc/' + user.state + '.png')
    setUrlImageAds(await getDownloadURL(imageAds))
  }, [user.state])

  function updateName() {
    const db = getDatabase()
    update(ref(db, 'users/' + user.uid), {
      name: newName,
      phone: newPhone
    })
    setEditT(false)
    ToastAndroid.show('Informações salvas!', ToastAndroid.LONG)
  }

  const returnImage = useCallback(async () => {
    const imageRef = refs(storage, 'imageprofile/' + user.uid)
    setUrlImage(await getDownloadURL(imageRef))
  }, [user.uid])

  useEffect(() => {
    isFocused && returnImage() && returnAds()
  }, [isFocused, returnImage, returnAds])

  async function uploadImage() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1]
    })

    if (result.cancelled === false) {
      const imageRef = refs(storage, 'imageprofile/' + user.uid)
      const blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        xhr.onload = function () {
          resolve(xhr.response)
        }
        xhr.onerror = function () {
          reject(new TypeError('Network request failed'))
        }
        xhr.responseType = 'blob'
        xhr.open('GET', result.uri, true)
        xhr.send(null)
      })
      await uploadBytes(imageRef, blob as Blob)
      // @ts-ignore
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
          {editT ? (
            <Button
              mt={'2'}
              width={'50%'}
              title="Excluir Conta"
              onPress={() => setShowModalLocal(true)}
            ></Button>
          ) : null}
        </VStack>
        <VStack style={styles.containerAds}>
          <Divider my="3"></Divider>
          <Image
            style={styles.adsBanner}
            resizeMode="contain"
            source={{
              uri: urlImageAds || null
            }}
          />
        </VStack>
        <Modal
          size={'lg'}
          isOpen={showModalLocal}
          onClose={() => setShowModalLocal(false)}
        >
          <Modal.Content padding="4">
            <Modal.Header marginBottom={'4'}>
              Deseja excluir a sua conta?
            </Modal.Header>
            <VStack mt="3" flexDirection={'row'}>
              <Button
                width={'50%'}
                mr="2"
                title="Sim"
                onPress={deleteAccount}
              />

              {editT ? (
                <Button
                  width={'50%'}
                  title="Não"
                  onPress={() => setShowModalLocal(false)}
                ></Button>
              ) : null}
            </VStack>
          </Modal.Content>
        </Modal>
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
