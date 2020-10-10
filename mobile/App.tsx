import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { HOME, CREATE } from './src/constants/routes';
import { YellowBox } from 'react-native';

import Home from './src/screens/Home';
import Create from './src/screens/Create';

import { COLOR, ThemeContext, getTheme } from 'react-native-material-ui';

const Stack = createStackNavigator();

const uiTheme = {
  palette: {
    primaryColor: COLOR.white,
    secondaryColor: COLOR.black
  },
}

YellowBox.ignoreWarnings(['Remote debugger']);

const App = () => {
  return (
    <ThemeContext.Provider value={getTheme(uiTheme)}>
      <NavigationContainer >
        <Stack.Navigator
          initialRouteName={HOME} 
          screenOptions={{ 
            headerTitle: 'InstaScreen',
            headerTitleAlign: 'center',
            headerTitleStyle: {
              color: uiTheme.palette.primaryColor
            },
            headerStyle: {
              backgroundColor: uiTheme.palette.secondaryColor,
            },
            headerTintColor: '#FFF'
          }}
          mode="modal"
          >
          <Stack.Screen
            name={HOME}
            component={Home}
            
          />
          <Stack.Screen
            name={CREATE}
            component={Create}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </ThemeContext.Provider>
  );
}

export default App;