/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect } from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from './src/screens/Login/Index';
import HomeScreen from './src/screens/Home/Index';
import TicketPesajeShow from './src/screens/TicketPesaje/Show';
import GuiaRemisionSearchScreen from './src/screens/GuiaRemision/Search';
import PesajeCreateScreen from './src/screens/Pesaje/Create';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SplashScreen from 'react-native-splash-screen';
import TicketProvider from './src/screens/TicketPesaje/Show/provider/TicketProvider';

const Stack = createNativeStackNavigator();

function App(): JSX.Element {
  const [loading, setLoading] = React.useState(true);
  const [user, setUser] = React.useState(null);

  useEffect(() => {
    AsyncStorage.getItem('user')
      .then((response) => {
        if (response) {
          setUser(JSON.parse(response));
        }
        setLoading(false);
      })
     .finally(() => {
     })
  }, [])

  return (
    <NavigationContainer>
      <TicketProvider>
        <Stack.Navigator
          initialRouteName='login'
          screenOptions={{
            headerShown: false,
            contentStyle: {
              backgroundColor: 'white',
            }
          }}
        >
          <Stack.Screen name="login" component={LoginScreen} />
          <Stack.Screen name="home" component={HomeScreen} />
          <Stack.Screen name="ticket_pesaje.show" component={TicketPesajeShow} />
          <Stack.Screen name="pesaje.create" component={PesajeCreateScreen} />
          <Stack.Screen name="guia_remision.search" component={GuiaRemisionSearchScreen} />
        </Stack.Navigator>
      </TicketProvider>
    </NavigationContainer>
  )

  // return (
  //   // <SafeAreaView style={backgroundStyle}>
  //   //   <StatusBar
  //   //     barStyle={isDarkMode ? 'light-content' : 'dark-content'}
  //   //     backgroundColor={backgroundStyle.backgroundColor}
  //   //   />
  //   //   <ScrollView
  //   //     contentInsetAdjustmentBehavior="automatic"
  //   //     style={backgroundStyle}>
  //   //     <Header />
  //   //     <View
  //   //       style={{
  //   //         backgroundColor: isDarkMode ? Colors.black : Colors.white,
  //   //       }}>
  //   //       <Section title="Step One">
  //   //         Edit <Text style={styles.highlight}>App.tsx</Text> to change this
  //   //         screen and then come back to see your edits.
  //   //       </Section>
  //   //       <Section title="See Your Changes">
  //   //         <ReloadInstructions />
  //   //       </Section>
  //   //       <Section title="Debug">
  //   //         <DebugInstructions />
  //   //       </Section>
  //   //       <Section title="Learn More">
  //   //         Read the docs to discover what to do next:
  //   //       </Section>
  //   //       <LearnMoreLinks />
  //   //     </View>
  //   //   </ScrollView>
  //   // </SafeAreaView>
  // );
}
export default App;
