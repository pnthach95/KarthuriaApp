import React, { useEffect } from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { setRootViewBackgroundColor } from '@pnthach95/react-native-root-view-background';
import NavigationBarColor from 'react-native-navigation-bar-color';
import { Provider as PaperProvider } from 'react-native-paper';
import tinycolor from 'tinycolor2';
import { setObject } from '~/mmkv';
import { Dark, Light } from '~/theme';
import { useAppContext } from '~/context';

import Tabs from './tabs';
import SplashScreen from '~/screens/splash';
import Characters from '~/screens/characters';
import CharacterDetail from '~/screens/characterdetail';
import StageGirlDetail from '~/screens/stagegirldetail';
import MemoirDetail from '~/screens/memoirdetail';
import Accessories from '~/screens/accessories';
import AccessoryDetail from '~/screens/accessorydetail';
import EnemiesScreen from '~/screens/enemies';
import EnemyDetail from '~/screens/enemydetail';

import type { RootStackParamList } from '~/typings';

const Stack = createStackNavigator<RootStackParamList>();

const noHeader = { headerShown: false };

const Routes = (): JSX.Element => {
  const { state } = useAppContext();
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

  useEffect(() => {
    void setObject('options', state.options);
  }, [state.options]);

  return (
    <PaperProvider theme={switchTheme}>
      <BottomSheetModalProvider>
        <StatusBar backgroundColor={statusBarColor} barStyle={statusBarStyle} />
        <NavigationContainer theme={switchTheme}>
          <Stack.Navigator screenOptions={{ headerBackTitle: 'Back' }}>
            {state.mainRoute === 'SPLASH' ? (
              <Stack.Screen
                name='Splash'
                component={SplashScreen}
                options={noHeader}
              />
            ) : (
              <>
                <Stack.Screen name='Main' component={Tabs} options={noHeader} />
                <Stack.Screen name='Characters' component={Characters} />
                <Stack.Screen
                  name='CharacterDetail'
                  component={CharacterDetail}
                  options={noHeader}
                />
                <Stack.Screen
                  name='StageGirlDetail'
                  component={StageGirlDetail}
                  options={noHeader}
                />
                <Stack.Screen
                  name='MemoirDetail'
                  component={MemoirDetail}
                  options={noHeader}
                />
                <Stack.Screen name='Accessories' component={Accessories} />
                <Stack.Screen
                  name='AccessoryDetail'
                  component={AccessoryDetail}
                  options={noHeader}
                />
                <Stack.Screen name='Enemies' component={EnemiesScreen} />
                <Stack.Screen
                  name='EnemyDetail'
                  component={EnemyDetail}
                  options={noHeader}
                />
              </>
            )}
          </Stack.Navigator>
        </NavigationContainer>
      </BottomSheetModalProvider>
    </PaperProvider>
  );
};

export default Routes;
