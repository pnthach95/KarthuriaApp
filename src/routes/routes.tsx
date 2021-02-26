import React, { useContext, useEffect } from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { setRootViewBackgroundColor } from '@pnthach95/react-native-root-view-background';
import NavigationBarColor from 'react-native-navigation-bar-color';
import { Provider as PaperProvider } from 'react-native-paper';
import tinycolor from 'tinycolor2';

import { Dark, Light } from '~/theme';
import UserContext from '~/context';

import Tabs from './tabs';
import SplashScreen from '~/screens/splash';

import type { RootStackParamList } from '~/typings';

const Stack = createStackNavigator<RootStackParamList>();

const noHeader = { headerShown: false };

const Routes = (): JSX.Element => {
  const { state } = useContext(UserContext);
  const switchTheme = state.options.isDark ? Dark : Light;
  const statusBarColor = state.options.isDark
    ? Dark.colors.card
    : Light.colors.card;
  const statusBarStyle = state.options.isDark
    ? 'light-content'
    : 'dark-content';

  useEffect(() => {
    setRootViewBackgroundColor(
      state.options.isDark ? Dark.colors.background : Light.colors.background,
    );
    const c = tinycolor(statusBarColor);
    void NavigationBarColor(c.toHexString(), !state.options.isDark, true);
  }, [state.options.isDark]);

  return (
    <PaperProvider theme={switchTheme}>
      <StatusBar backgroundColor={statusBarColor} barStyle={statusBarStyle} />
      <NavigationContainer theme={switchTheme}>
        <Stack.Navigator screenOptions={{ headerBackTitle: 'Back' }}>
          {state.loading ? (
            <Stack.Screen
              name='Splash'
              component={SplashScreen}
              options={noHeader}
            />
          ) : (
            <>
              <Stack.Screen name='Main' component={Tabs} options={noHeader} />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
};

export default Routes;
