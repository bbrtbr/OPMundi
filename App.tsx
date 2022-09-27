import { NativeBaseProvider, StatusBar } from 'native-base'
import {
  useFonts,
  Roboto_400Regular as roboto400Regular,
  Roboto_700Bold as roboto700Bold
} from '@expo-google-fonts/roboto'
import { UserContextProvider } from './src/contexts/UserContext'
import { THEME } from './src/components/theme'
import { Loading } from './src/components/loading'
import Routes from './src/routes'

export default function App() {
  const [fontsLoaded] = useFonts({
    robotoRegular: roboto400Regular,
    robotoBold: roboto700Bold
  })

  return (
    <NativeBaseProvider theme={THEME}>
      <UserContextProvider>
        <StatusBar
          barStyle="light-content"
          backgroundColor="transparent"
          translucent
        />

        {fontsLoaded ? <Routes /> : <Loading />}
      </UserContextProvider>
    </NativeBaseProvider>
  )
}
