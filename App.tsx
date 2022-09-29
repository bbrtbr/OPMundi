import { NativeBaseProvider, StatusBar } from 'native-base'
import {
  useFonts,
  Roboto_400Regular as robotoRegular,
  Roboto_700Bold as robotoBold
} from '@expo-google-fonts/roboto'
import { UserContextProvider } from './src/contexts/UserContext'
import { THEME } from './src/components/theme'
import { Loading } from './src/components/loading'
import Routes from './src/routes'

export default function App() {
  const [fontsLoaded] = useFonts({
    robotoRegular,
    robotoBold
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
