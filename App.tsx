import { StatusBar, Text, View } from 'react-native';
import { NativeBaseProvider } from 'native-base';
import { useFonts, Roboto_400Regular, Roboto_700Bold } from '@expo-google-fonts/roboto'
import { Loading } from '@components/Loading';
import { THEME } from 'src/theme';
export default function App() {
  const [fontsLoaded] = useFonts({Roboto_400Regular, Roboto_700Bold})
  return (
    <NativeBaseProvider>

      <StatusBar
        barStyle='light-content'
        backgroundColor='transparent'
        translucent
        />
      {fontsLoaded ? 
      <Text>Hello World!</Text>
      : 
      <Loading/>
    }

    
    </NativeBaseProvider>
  );
}


