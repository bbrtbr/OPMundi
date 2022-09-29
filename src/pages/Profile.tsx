import React, { useContext } from 'react'
import { VStack, Heading, Text, Divider } from 'native-base'
import { UserContext } from '../contexts/UserContext'
import type { User } from '../models/user'
import { Button } from '../components/button'
export function Profile() {
  const { user }: { user: User } = useContext(UserContext)
  const { signOut } = useContext(UserContext)

  return (
    <VStack flex={1} p={4}>
      <Heading>Meus Dados</Heading>
      <Divider my={4} />
      <Text fontSize={'lg'}>Nome: {user.name}</Text>
      <Text fontSize={'lg'} my={1}>
        E-mail: {user.email}
      </Text>
      <Text fontSize={'lg'} my={1}>
        Telefone: {user.phone}
      </Text>
      <Text fontSize={'lg'} my={1}>
        Sexo: {user.sex}
      </Text>
      <Text fontSize={'lg'} my={1}>
        Estado: {user.state}
      </Text>
      <Text fontSize={'lg'} my={1}>
        Cidade: {user.city}
      </Text>
      <Text fontSize={'lg'} my={1}>
        Bairro: {user.district}
      </Text>
      <Button width={'100%'} title="Sair" mt={10} onPress={signOut}>
        Sair
      </Button>
    </VStack>
  )
}
