import React, { useState, useContext } from 'react'
import { UserContext } from '../contexts/UserContext'
import {
  VStack,
  Heading,
  Icon,
  useTheme,
  Image,
  Text,
  Checkbox
} from 'native-base'
import { Ionicons } from '@expo/vector-icons'
import {
  TouchableWithoutFeedback,
  TouchableOpacity,
  ToastAndroid,
  Keyboard
} from 'react-native'
import { Input } from '../components/input'
import { Button } from '../components/button'

export function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(true)
  const { signIn, isLoading, resetPass } = useContext(UserContext)
  const { colors } = useTheme()

  function onClickResetPass() {
    if (email === '') {
      ToastAndroid.show('Preencha seu email.', ToastAndroid.LONG)
    } else {
      resetPass(email)
    }
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <VStack flex={1} alignItems="center" bg="white" px={8} pt={24}>
        <Image
          source={require('../assets/logotipo.png')}
          resizeMode="contain"
          width={100}
          height={100}
          alt={'OPMundi'}
        />
        <Heading color="gray.300" fontSize="xl" mt={6} mb={6}>
          Acesse sua conta
        </Heading>

        <Input
          mb={4}
          placeholder="E-mail"
          InputLeftElement={
            <Icon as={<Ionicons name={'mail'} color={colors.white} />} ml={4} />
          }
          onChangeText={setEmail}
        />

        <Input
          mb={6}
          placeholder="Senha"
          InputLeftElement={
            <Icon as={<Ionicons name={'key'} color={colors.white} />} ml={3} />
          }
          secureTextEntry={showPassword}
          onChangeText={setPassword}
        />

        <Checkbox
          value={'Mostrar Senha'}
          onChange={() => setShowPassword(!showPassword)}
          mb={3}
          color="gray.300"
        >
          Mostrar Senha
        </Checkbox>

        <Button
          title="Entrar"
          w="full"
          mt={3}
          mb={1}
          onPress={async () => {
            if (email && password) {
              await signIn(email, password)
            }
          }}
          isLoading={isLoading}
        />
        <TouchableOpacity onPress={onClickResetPass}>
          <Text>Esqueceu sua senha?</Text>
        </TouchableOpacity>
      </VStack>
    </TouchableWithoutFeedback>
  )
}
