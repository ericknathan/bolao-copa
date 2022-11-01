import { NativeBaseProvider, StatusBar } from "native-base";
import { useFonts, Roboto_400Regular, Roboto_500Medium, Roboto_700Bold } from '@expo-google-fonts/roboto';

import { THEME } from "./src/styles/theme";
import { Loading } from "./src/components";
import { SignIn } from "./src/screens";

export default function App() {
  const [fontsIsLoaded] = useFonts({ Roboto_400Regular, Roboto_500Medium, Roboto_700Bold });


  return (
    <NativeBaseProvider theme={THEME}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />
      { fontsIsLoaded ? <SignIn /> : <Loading /> }
    </NativeBaseProvider>
  );
}