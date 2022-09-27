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
import {
  Keyboard,
  ToastAndroid,
  TouchableOpacity,
  TouchableWithoutFeedback
} from 'react-native'
import { Login } from './Login'
import { Input } from '../components/input'
import { Button } from '../components/button'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

const Stack = createNativeStackNavigator()

function ScreenRegister({ navigation }) {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [sex, setSex] = useState('')
  const [phone, setPhone] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [showModalLocal, setShowModalLocal] = useState(false)
  const [password, setPassword] = useState('')
  const [district, setDistrict] = useState('')
  const [showPassword, setShowPassword] = useState(true)
  const [state, setState] = useState('')
  const [listStates, setListStates] = useState([])
  const [city, setCity] = useState('')
  const [listCities, setListCities] = useState([])

  const { registerAccount, isLoading } = useContext(UserContext)
  const { colors } = useTheme()

  async function onRegisterFinal() {
    if (state === '' || city === '' || district === '') {
      ToastAndroid.show(
        'Verifique se todos os campos foram preenchidos.',
        ToastAndroid.LONG
      )
    } else {
      await registerAccount(
        email,
        password,
        name,
        email,
        phone,
        sex,
        state,
        city,
        district
      )
    }
  }

  function loadCity(id: string) {
    let url = 'https://servicodados.ibge.gov.br/api/v1/'
    url = url + `localidades/estados/${id}/municipios`
    fetch(url)
      .then(response => response.json())
      .then(data => {
        data.sort((a, b) => a.nome.localeCompare(b.nome))
        setListCities(data)
      })
  }

  function loadUf() {
    const apiUrl = 'https://servicodados.ibge.gov.br/'
    const statesUrl = apiUrl + 'api/v1/localidades/estados'
    fetch(statesUrl)
      .then(response => response.json())
      .then(data => {
        data.sort((a, b) => a.nome.localeCompare(b.nome))
        setListStates(data)
      })
  }

  useEffect(() => {
    loadUf()
  }, [])

  useEffect(() => {
    if (state) {
      loadCity(state)
    }
  }, [state])

  async function onClickRegister() {
    if (email === '' || password === '') {
      ToastAndroid.show(
        'Verifique se todos os campos foram preenchidos.',
        ToastAndroid.LONG
      )
    } else {
      setShowModal(true)
    }
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <VStack flex={1} alignItems="center" bg="white" px={8} pt={24}>
        <Modal
          size={'lg'}
          isOpen={showModalLocal}
          onClose={() => setShowModalLocal(false)}
        >
          <Modal.Content padding="4">
            <Modal.Header marginBottom={'4'}>
              Última etapa do cadastro
            </Modal.Header>
            <Select
              selectedValue={state}
              bg="green.300"
              mb="2"
              fontSize="md"
              fontFamily="body"
              color="white"
              onValueChange={itemValue => setState(itemValue)}
              placeholder="Estado:"
              placeholderTextColor={'#fff'}
              height={'55'}
            >
              {listStates.map(a => (
                <Select.Item
                  key={a.id}
                  label={`${a.sigla} - ${a.nome}`}
                  value={a.sigla}
                />
              ))}
            </Select>

            <Select
              selectedValue={city}
              bg="green.300"
              mb="2"
              fontSize="md"
              fontFamily="body"
              onValueChange={itemValue => setCity(itemValue)}
              placeholder="Cidade:"
              placeholderTextColor={'#fff'}
              height={'55'}
              isDisabled={state === ''}
            >
              {listCities.map(b => (
                <Select.Item key={b.id} label={b.nome} value={b.nome} />
              ))}
            </Select>
            <Input
              placeholder="Bairro"
              height={'55'}
              mb="2"
              value={district}
              onChangeText={setDistrict}
              isDisabled={city === ''}
            />
            <Button
              onPress={onRegisterFinal}
              isLoading={isLoading}
              title="Cadastrar"
              isDisabled={state === '' && city === '' && district === ''}
            />
          </Modal.Content>
        </Modal>
        <Modal
          size={'lg'}
          isOpen={showModal}
          onClose={() => setShowModal(false)}
        >
          <Modal.Content padding={'4'}>
            <Modal.Header>Complete seu cadastro</Modal.Header>
            <Input
              mt={2}
              mb={2}
              placeholder="Nome Completo:"
              InputLeftElement={
                <Icon
                  as={<Ionicons name={'person-outline'} color={colors.white} />}
                  ml={4}
                />
              }
              onChangeText={setName}
            />
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
              onChangeText={setPhone}
            />
            <Select
              placeholder="Gênero"
              placeholderTextColor={'#fff'}
              selectedValue={sex}
              height="55"
              bg="green.300"
              mb="2"
              fontSize="md"
              fontFamily="body"
              width={'100%'}
              backgroundColor="#04D361"
              onValueChange={itemValue => setSex(itemValue)}
            >
              <Select.Item label="Masculino" value="Masculino" />
              <Select.Item label="Feminino" value="Feminino" />
              <Select.Item
                label="Prefiro não dizer"
                value="Prefiro não dizer"
              />
            </Select>
            <Button
              onPress={() => {
                if (sex === '' || phone === '' || name === '') {
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
          resizeMode="contain"
          width={'100%'}
          height={'95'}
          alt="OPMundi"
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
        <Checkbox
          value={showPassword.toString()}
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
    </TouchableWithoutFeedback>
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
