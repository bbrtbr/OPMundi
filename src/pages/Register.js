import React, { useState, useContext } from 'react';
import  { UserContext } from "../contexts/UserContext";
import { VStack, Heading, Icon, useTheme, Image, CheckBox, Checkbox, Text } from 'native-base';
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from 'react-native';
import { Login } from './Login';
import { Input } from '../components/input'
import { Button } from '../components/button';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
const Stack = createNativeStackNavigator();
function ScreenRegister({navigation}){
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { colors } = useTheme();
    const [showPassword, setShowPassword] = useState(true);
    return(
        <VStack flex={1} alignItems="center" bg="white" px={8} pt={24}>
        <Image
        source={require('../assets/logotipo2.png')}
        width={"100%"}
        height={"95"}
        />
        <Input
        mt={3}
        mb={4}
        placeholder="E-mail"
        InputLeftElement={<Icon as={<Ionicons name={"mail"} color={colors.white} />} ml={4} />}
        onChangeText={setEmail}
      />
      <Input
        mb={4}
        placeholder="Senha"
        InputLeftElement={<Icon as={<Ionicons name={"key"} color={colors.white} />} ml={3} />}
        secureTextEntry={showPassword}
        onChangeText={setPassword}/>
        <Input
        mb={4}
        placeholder="Confirmar Senha"
        InputLeftElement={<Icon as={<Ionicons name={"key"} color={colors.white} />} ml={3} />}
        secureTextEntry={showPassword}/>
        <Button title="Registrar" w="100%"/>
        <TouchableOpacity onPress={() => navigation.navigate('Login')} >
                <Text >Já possui uma conta? Clique aqui!</Text>
         </TouchableOpacity>
        </VStack>
    )
}
export  function Register() {

  return (
   
    <Stack.Navigator screenOptions={{headerShown: false}} >
    <Stack.Screen name="ScreenRegister" component={ScreenRegister} />
    <Stack.Screen name="Login" component={Login} />
       </Stack.Navigator>


  )
}