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
  Checkbox,
  Heading,
  ScrollView,
  Divider
} from 'native-base'
import { Ionicons } from '@expo/vector-icons'
import {
  Keyboard,
  ToastAndroid,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet
} from 'react-native'
import { Login } from './Login'
import { Input } from '../components/input'
import { Button } from '../components/button'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { MaskedTextInput } from 'react-native-mask-text'
const Stack = createNativeStackNavigator()
function ScreenRegister({ navigation }) {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [sex, setSex] = useState('')
  const [phone, setPhone] = useState('')
  const [birthDate, setBirthDate] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [showModalLocal, setShowModalLocal] = useState(false)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
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
        phone,
        sex,
        state,
        city,
        district,
        birthDate
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
  function validateDate(date) {
    const dataAux = date.split('/')
    const ano = dataAux[2]
    const mes = dataAux[1]
    const dia = dataAux[0]
    if (ano > 0) {
      if (mes <= 0 || mes > 12) {
        return false
      }

      if (dia > 31 || dia <= 0) {
        return false
      }

      if (ano < 1850 || ano > 2022) {
        return false
      }
    } else {
      return true
    }
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
    if (email === '' || password === '' || confirmPassword === '') {
      ToastAndroid.show(
        'Verifique se todos os campos foram preenchidos.',
        ToastAndroid.LONG
      )
    } else {
      if (password !== confirmPassword) {
        ToastAndroid.show(
          'As senhas são diferentes. Por favor, verifique-as.',
          ToastAndroid.LONG
        )
      } else {
        setShowModal(true)
      }
    }
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <VStack flex={1} alignItems="center" bg="white" px={8}>
        <ScrollView
          flex={1}
          w={'full'}
          h={'full'}
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <Image
            source={require('../assets/opvestabanner.png')}
            width={'100%'}
            height={'90'}
            resizeMode="contain"
            alt="Opmundi"
          />

          <Heading color="#004987" fontSize="xl" mt={'2'}>
            Crie sua conta
          </Heading>
          <Input
            mt={3}
            mb={4}
            placeholder="E-mail"
            InputLeftElement={
              <Icon
                as={<Ionicons name={'mail'} color={colors.white} />}
                ml={4}
              />
            }
            onChangeText={setEmail}
          />
          <Input
            mb={4}
            placeholder="Senha"
            InputLeftElement={
              <Icon
                as={<Ionicons name={'key'} color={colors.white} />}
                ml={3}
              />
            }
            secureTextEntry={showPassword}
            onChangeText={setPassword}
          />
          <Input
            mb={4}
            placeholder="Confirmar senha"
            InputLeftElement={
              <Icon
                as={<Ionicons name={'key'} color={colors.white} />}
                ml={3}
              />
            }
            secureTextEntry={showPassword}
            onChangeText={setConfirmPassword}
          />
          <Checkbox
            value={showPassword.toString()}
            onChange={() => setShowPassword(!showPassword)}
            mb={3}
            bgColor="#004987"
            color="#004987"
          >
            Mostrar Senha
          </Checkbox>
          <Button
            onPress={onClickRegister}
            isLoading={isLoading}
            title="Continuar"
            w="100%"
          />

          <TouchableOpacity
            onPress={() => navigation.navigate('Login')}
            style={{ marginVertical: 8 }}
          >
            <Divider my={2} />
            <Text color="#004987" fontSize="xl">
              Fazer login
            </Text>
          </TouchableOpacity>
        </ScrollView>
        <Modal
          size={'lg'}
          isOpen={showModalLocal}
          onClose={() => setShowModalLocal(false)}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <Modal.Content padding="4">
              <Modal.Header marginBottom={'4'}>
                Última etapa do cadastro
              </Modal.Header>
              <Text>Estado:</Text>
              <Select
                selectedValue={state}
                bg="white"
                mb="2"
                fontSize="md"
                fontFamily="body"
                borderColor={'#00B37E'}
                color="#004987"
                onValueChange={itemValue => setState(itemValue)}
                placeholder="Estado:"
                placeholderTextColor={'#004987'}
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
              <Text>Cidade:</Text>
              <Select
                selectedValue={city}
                bg="white"
                mb="2"
                borderColor={'#00B37E'}
                fontSize="md"
                color="#004987"
                fontFamily="body"
                onValueChange={itemValue => setCity(itemValue)}
                placeholder="Cidade:"
                placeholderTextColor={'#004987'}
                height={'55'}
                isDisabled={state === ''}
              >
                {listCities.map(b => (
                  <Select.Item key={b.id} label={b.nome} value={b.nome} />
                ))}
              </Select>

              <Text>Bairro:</Text>
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
          </TouchableWithoutFeedback>
        </Modal>
        <Modal
          size={'lg'}
          isOpen={showModal}
          onClose={() => setShowModal(false)}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <Modal.Content padding={'4'}>
              <ScrollView>
                <Modal.Header>Complete seu cadastro</Modal.Header>
                <Text>Nome Completo:</Text>
                <Input
                  mt={2}
                  mb={2}
                  placeholder="Nome Completo:"
                  InputLeftElement={
                    <Icon
                      as={
                        <Ionicons
                          name={'person-outline'}
                          color={colors.white}
                        />
                      }
                      ml={4}
                    />
                  }
                  onChangeText={setName}
                />
                <Text>Telefone:</Text>
                <Input
                  mb={2}
                  dataDetectorTypes="phoneNumber"
                  keyboardType="phone-pad"
                  placeholder="Telefone: (xx) xxxxx-xxxx"
                  InputLeftElement={
                    <Icon
                      as={
                        <Ionicons name={'call-outline'} color={colors.white} />
                      }
                      ml={4}
                    />
                  }
                  onChangeText={setPhone}
                />
                <Text>Data de Nascimento:</Text>
                <MaskedTextInput
                  style={styles.input}
                  placeholder={'dd/mm/aaaa'}
                  placeholderTextColor={'#004987'}
                  mask="99/99/9999"
                  onChangeText={text => {
                    setBirthDate(text)
                  }}
                  keyboardType="numeric"
                />
                <Text>Gênero:</Text>
                <Select
                  placeholder="Gênero"
                  placeholderTextColor={'#004987'}
                  color={'#004987'}
                  selectedValue={sex}
                  height="55"
                  mb="2"
                  fontSize="md"
                  fontFamily="body"
                  width={'100%'}
                  backgroundColor="white"
                  onValueChange={itemValue => setSex(itemValue)}
                >
                  <Select.Item label="Masculino" value="Masculino" />
                  <Select.Item label="Feminino" value="Feminino" />
                  <Select.Item label="Homossexual" value="Homossexual" />
                  <Select.Item label="Bissexual" value="Bissexual" />
                  <Select.Item label="Assexual" value="Assexual" />
                  <Select.Item label="Outros" value="Outros" />
                </Select>
                <Button
                  onPress={() => {
                    if (
                      sex === '' ||
                      phone === '' ||
                      name === '' ||
                      birthDate === ''
                    ) {
                      ToastAndroid.show(
                        'Verifique se todos os campos foram preenchidos.',
                        ToastAndroid.LONG
                      )
                    }
                    if (validateDate(birthDate) === false) {
                      ToastAndroid.show('Data inválida', ToastAndroid.LONG)
                    } else {
                      setShowModalLocal(true)
                      setShowModal(false)
                    }
                  }}
                  mt="4"
                  title="Prosseguir"
                />
              </ScrollView>
            </Modal.Content>
          </TouchableWithoutFeedback>
        </Modal>
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
const styles = StyleSheet.create({
  input: {
    color: '#004987',
    fontSize: 16,
    borderColor: '#00B37E',
    height: 45,
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: 'white',
    paddingHorizontal: 12,
    marginBottom: 8
  }
})
