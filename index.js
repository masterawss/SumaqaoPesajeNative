import * as React from 'react';
import { AppRegistry } from 'react-native';
import { MD3LightTheme as DefaultTheme, PaperProvider } from 'react-native-paper';
import { name as appName } from './app.json';
import App from './App';
import TicketProvider from './src/screens/TicketPesaje/Show/provider/TicketProvider';

const theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: 'tomato',
      secondary: 'yellow',
      surface: 'white',
      background: 'white',
      surfaceVariant: 'white',
      primaryContainer: 'white',
      secondaryContainer: 'white',
      outlineVariant: 'white',
    },
  };

export default function Main() {
  return (
    <PaperProvider theme={theme}>
        <App />
    </PaperProvider>
  );
}

AppRegistry.registerComponent(appName, () => Main);