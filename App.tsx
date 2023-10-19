/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from './src/screens/Login/Index';
import HomeScreen from './src/screens/Home/Index';
import IngresoShowScreen from './src/screens/Ingreso/Show';
import GuiaIngresoSearchScreen from './src/screens/GuiaIngreso/Search';
import PesajeCreateScreen from './src/screens/Pesaje/Create';

const Stack = createNativeStackNavigator();

function App(): JSX.Element {

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName='pesaje.create'
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: 'white',
          }
        }}
      >
        <Stack.Screen name="login" component={LoginScreen} />
        <Stack.Screen name="home" component={HomeScreen} />
        <Stack.Screen name="ingreso.show" component={IngresoShowScreen} />
        <Stack.Screen name="guia_ingreso.search" component={GuiaIngresoSearchScreen} />
        <Stack.Screen name="pesaje.create" component={PesajeCreateScreen} />
      </Stack.Navigator>
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
