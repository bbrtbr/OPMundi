import React, { useState, useContext } from 'react'
import { UserContext } from '../contexts/UserContext'
import { VStack, Icon, useTheme, Image, Text, Modal, Select } from 'native-base'
import { Ionicons } from '@expo/vector-icons'
import { ToastAndroid, TouchableOpacity } from 'react-native'
import { Login } from './Login'
import { Input } from '../components/input'
import { Button } from '../components/button'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

const Stack = createNativeStackNavigator()
function ScreenRegister({ navigation }) {
  const [email, setEmail] = useState('')
  const [Name, setName] = useState('')
  const [Gender, setGender] = useState('')
  const [Telefone, setTelefone] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [showModalLocal, setShowModalLocal] = useState(false)
  const [password, setPassword] = useState('')
  const [confPassword, setconfPassword] = useState('')
  const { colors } = useTheme()
  const { registerAccount, isLoading } = useContext(UserContext)
  const [showPassword, setShowPassword] = useState(true)

  const [uf, setUf] = React.useState('AC')
  const [listUf, setListUf] = React.useState([])
  const [city, setCity] = React.useState('')
  const [listCity, setListCity] = React.useState([])
  function loadUf() {
    let url = 'https://servicodados.ibge.gov.br/'
    url = url + 'api/v1/localidades/estados'
    fetch(url)
      .then(response => response.json())
      .then(data => {
        data.sort((a, b) => a.nome.localeCompare(b.nome))
        setListUf([...data])
      })
  }
  function loadCity(id) {
    let url = 'https://servicodados.ibge.gov.br/api/v1/'
    url = url + `localidades/estados/${id}/municipios`
    fetch(url)
      .then(response => response.json())
      .then(data => {
        data.sort((a, b) => a.nome.localeCompare(b.nome))
        setListCity([...data])
      })
  }
  React.useEffect(() => {
    loadUf()
  }, [])
  React.useEffect(() => {
    if (uf) {
      loadCity(uf)
    }
  }, [uf])

  async function onClickRegister() {
    if (email === '' || password === '') {
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
          <Select
            value={uf}
            backgroundColor="white"
            onChange={e => setUf(e.target.value)}
          >
            {listUf.map((a, b) => (
              // eslint-disable-next-line react/jsx-key
              <option value={a.id}>
                {a.sigla} - {a.nome}
              </option>
            ))}
          </Select>
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
          <Input
            mb={2}
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
            width={'100%'}
            backgroundColor="#04D361"
            onValueChange={(itemValue: string) => setGender(itemValue)}
          >
            <Select.Item label="Masculino" value="Masculino" />
            <Select.Item label="Feminino" value="Feminino" />
            <Select.Item label="Prefiro não dizer" value="Prefiro não dizer" />
          </Select>
          <Button
            onPress={() => {
              setShowModalLocal(true)
              setShowModal(false)
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

      <Button
        onPress={onClickRegister}
        isLoading={isLoading}
        title="Registrar"
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
