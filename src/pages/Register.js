import React, { useState, useContext, useEffect } from 'react'
import { UserContext } from '../contexts/UserContext'
import {
  VStack,
  Icon,
  useTheme,
  Image,
  Text,
  Modal,
  Select,
  Checkbox
} from 'native-base'
import { Ionicons } from '@expo/vector-icons'
import { ToastAndroid, TouchableOpacity } from 'react-native'
import { Login } from './Login'

import { Input } from '../components/input'
import { Button } from '../components/button'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

const Stack = createNativeStackNavigator()
function ScreenRegister({ navigation }) {
  const [emailA, setEmail] = useState('')
  const [Name, setName] = useState('')
  const [Gender, setGender] = useState('')
  const [Telefone, setTelefone] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [showModalLocal, setShowModalLocal] = useState(false)
  const [password, setPassword] = useState('')
  const [confPassword, setconfPassword] = useState('')
  const { colors } = useTheme()
  const [cityA, setCity] = useState('')
  const [districtA, setDistrict] = useState('')
  const [listCity, setListCity] = useState([])
  const { registerAccount, isLoading } = useContext(UserContext)
  const [showPassword, setShowPassword] = useState(true)
  const [uf, setUf] = useState('Selecione:')
  const [listUf, setListUf] = useState([])
  async function onRegisterFinal() {
    if (uf === '' || cityA === '' || districtA === '') {
      ToastAndroid.show(
        'Verifique se todos os campos foram preenchidos.',
        ToastAndroid.LONG
      )
    } else {
      await registerAccount(
        emailA,
        password,
        Name,
        emailA,
        Telefone,
        Gender,
        uf,
        cityA,
        districtA
      )
    }
  }
  function loadCity(id) {
    let url = 'https://servicodados.ibge.gov.br/api/v1/'
    url = url + `localidades/estados/${id}/municipios`
    fetch(url)
      .then(response => response.json())
      .then(data => {
        data.sort((a, b) => a.nome.localeCompare(b.nome))
        setListCity(data)
      })
  }
  function loadUf() {
    const apiUrl = 'https://servicodados.ibge.gov.br/'
    const statesUrl = apiUrl + 'api/v1/localidades/estados'
    fetch(statesUrl)
      .then(response => response.json())
      .then(data => {
        data.sort((a, b) => a.nome.localeCompare(b.nome))
        setListUf(data)
      })
  }
  useEffect(() => {
    loadUf()
    // console.log('id: ' + listUf[0].id + '\nend')
  }, [])

  useEffect(() => {
    if (uf) {
      loadCity(uf)
    }
  }, [uf])

  async function onClickRegister() {
    if (emailA === '' || password === '') {
      ToastAndroid.show(
        'Verifique se todos os campos foram preenchidos.',
        ToastAndroid.LONG
      )
    } else if (password !== confPassword) {
      ToastAndroid.show(
        'Verifique se a senha digitada é a mesma em ambos os campos.',
        ToastAndroid.LONG
      )
    } else {
      setShowModal(true)
    }
  }
  return (
    <VStack flex={1} alignItems="center" bg="white" px={8} pt={24}>
      <Modal
        size={'full'}
        isOpen={showModalLocal}
        onClose={() => setShowModalLocal(false)}
      >
        <Modal.Content>
          <Modal.Header>Última etapa do cadastro.</Modal.Header>
          <Select
            selectedValue={uf}
            bg="green.300"
            mb="2"
            fontSize="md"
            fontFamily="body"
            color="white"
            onValueChange={itemValue => setUf(itemValue)}
            placeholder="Estado:"
            height={'55'}
          >
            {listUf.map(a => (
              <Select.Item key={a.id} label={a.nome} value={a.sigla} />
            ))}
          </Select>

          <Select
            selectedValue={cityA}
            bg="green.300"
            mb="2"
            fontSize="md"
            fontFamily="body"
            onValueChange={itemValue => setCity(itemValue)}
            placeholder="Cidade:"
            height={'55'}
          >
            {listCity.map(b => (
              <Select.Item key={b.id} label={b.nome} value={b.nome} />
            ))}
          </Select>
          <Input
            placeholder="Bairro"
            height={'55'}
            mb="2"
            onChangeText={setDistrict}
          />
          <Button
            onPress={onRegisterFinal}
            isLoading={isLoading}
            title="Cadastrar"
          />
        </Modal.Content>
      </Modal>
      <Modal
        size={'full'}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      >
        <Modal.Content>
          <Modal.Header>Complete seu Cadastro</Modal.Header>
          <Input
            mt={3}
            mb={4}
            placeholder="Nome Completo:"
            InputLeftElement={
              <Icon
                as={<Ionicons name={'person-outline'} color={colors.white} />}
                ml={4}
              />
            }
            onChangeText={setName}
          />
          <Text>Obs: Seu número não será compartilhado!.</Text>
          <Input
            mb={2}
            dataDetectorTypes="phoneNumber"
            keyboardType="phone-pad"
            placeholder="Telefone: (xx) xxxxx-xxxx"
            InputLeftElement={
              <Icon
                as={<Ionicons name={'call-outline'} color={colors.white} />}
                ml={4}
              />
            }
            onChangeText={setTelefone}
          />
          <Text>Gênero:</Text>
          <Select
            placeholder="Gênero"
            selectedValue={Gender}
            height="55"
            bg="green.300"
            mb="2"
            fontSize="md"
            fontFamily="body"
            width={'100%'}
            backgroundColor="#04D361"
            onValueChange={itemValue => setGender(itemValue)}
          >
            <Select.Item label="Masculino" value="Masculino" />
            <Select.Item label="Feminino" value="Feminino" />
            <Select.Item label="Prefiro não dizer" value="Prefiro não dizer" />
          </Select>
          <Button
            onPress={() => {
              if (Gender === '' || Telefone === '' || Name === '') {
                ToastAndroid.show(
                  'Verifique se todos os campos foram preenchidos.',
                  ToastAndroid.LONG
                )
              } else {
                setShowModalLocal(true)
                setShowModal(false)
              }
            }}
            mt="4"
            title="Prosseguir"
          />
        </Modal.Content>
      </Modal>

      <Image
        source={require('../assets/logotipo2.png')}
        width={'100%'}
        height={'95'}
      />
      <Input
        mt={3}
        mb={4}
        placeholder="E-mail"
        InputLeftElement={
          <Icon as={<Ionicons name={'mail'} color={colors.white} />} ml={4} />
        }
        onChangeText={setEmail}
      />
      <Input
        mb={4}
        placeholder="Senha"
        InputLeftElement={
          <Icon as={<Ionicons name={'key'} color={colors.white} />} ml={3} />
        }
        secureTextEntry={showPassword}
        onChangeText={setPassword}
      />
      <Input
        mb={4}
        placeholder="Confirmar Senha"
        onChangeText={setconfPassword}
        InputLeftElement={
          <Icon as={<Ionicons name={'key'} color={colors.white} />} ml={3} />
        }
        secureTextEntry={showPassword}
      />
      <Checkbox
        onChange={() => setShowPassword(!showPassword)}
        mb={3}
        color="gray.300"
      >
        Mostrar Senha
      </Checkbox>
      <Button
        onPress={onClickRegister}
        isLoading={isLoading}
        title="Continuar"
        w="100%"
      />

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text>Já possui uma conta? Clique aqui!</Text>
      </TouchableOpacity>
    </VStack>
  )
}
export function Register() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ScreenRegister" component={ScreenRegister} />
      <Stack.Screen name="Login" component={Login} />
    </Stack.Navigator>
  )
}
