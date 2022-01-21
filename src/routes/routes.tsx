import React, { useEffect } from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import RNBootSplash from 'react-native-bootsplash';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { setRootViewBackgroundColor } from '@pnthach95/react-native-root-view-background';
import NavigationBarColor from 'react-native-navigation-bar-color';
import { Provider as PaperProvider } from 'react-native-paper';
import tinycolor from 'tinycolor2';
import useStore, { useHydration } from '~/store';
import { Dark, Light } from '~/theme';

import Tabs from './tabs';
import Kirin from '~/components/kirin';
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

const Routes = (): JSX.Element => {
  const hydrated = useHydration();
  const mainRoute = useStore((s) => s.mainRoute);
  const options = useStore((s) => s.options);
  const onSwitchMainRoute = useStore((s) => s.onSwitchMainRoute);
  const switchTheme = options.isDark ? Dark : Light;
  const statusBarColor = tinycolor(
    options.isDark ? Dark.colors.card : Light.colors.card,
  );
  const statusBarStyle = options.isDark ? 'light-content' : 'dark-content';

  useEffect(() => {
    const getData = async () => {
      await RNBootSplash.hide({ fade: true });
      onSwitchMainRoute('MAIN');
    };
    if (hydrated) void getData();
  }, [hydrated]);

  useEffect(() => {
    setRootViewBackgroundColor(
      options.isDark ? Dark.colors.background : Light.colors.background,
    );
    void NavigationBarColor(
      statusBarColor.toHexString(),
      !options.isDark,
      true,
    );
  }, [options.isDark]);

  return (
    <PaperProvider theme={switchTheme}>
      <BottomSheetModalProvider>
        <StatusBar
          backgroundColor={statusBarColor.setAlpha(0.5).toHex8String()}
          barStyle={statusBarStyle}
          translucent
        />
        <NavigationContainer theme={switchTheme}>
          <Stack.Navigator
            screenOptions={{ headerBackTitle: 'Back', headerShown: false }}>
            {mainRoute === 'SPLASH' ? (
              <Stack.Screen name='Splash' component={Kirin} />
            ) : (
              <>
                <Stack.Screen name='Main' component={Tabs} />
                <Stack.Screen
                  name='Characters'
                  component={Characters}
                  options={{ headerShown: true }}
                />
                <Stack.Screen
                  name='CharacterDetail'
                  component={CharacterDetail}
                />
                <Stack.Screen
                  name='StageGirlDetail'
                  component={StageGirlDetail}
                />
                <Stack.Screen name='MemoirDetail' component={MemoirDetail} />
                <Stack.Screen
                  name='Accessories'
                  component={Accessories}
                  options={{ headerShown: true }}
                />
                <Stack.Screen
                  name='AccessoryDetail'
                  component={AccessoryDetail}
                />
                <Stack.Screen
                  name='Enemies'
                  component={EnemiesScreen}
                  options={{ headerShown: true }}
                />
                <Stack.Screen name='EnemyDetail' component={EnemyDetail} />
              </>
            )}
          </Stack.Navigator>
        </NavigationContainer>
      </BottomSheetModalProvider>
    </PaperProvider>
  );
};

export default Routes;
