import Kirin from '~/components/kirin';
import AccessoriesScreen from '~/screens/accessories';
import AccessoryDetailScreen from '~/screens/accessorydetail';
import CharacterDetailScreen from '~/screens/characterdetail';
import CharactersScreen from '~/screens/characters';
import EnemiesScreen from '~/screens/enemies';
import EnemyDetailScreen from '~/screens/enemydetail';
import MemoirDetailScreen from '~/screens/memoirdetail';
import StageGirlDetailScreen from '~/screens/stagegirldetail';
import useStore, {onSwitchMainRoute, useHydration} from '~/store';
import {Dark, Light} from '~/theme';
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import {setRootViewBackgroundColor} from '@pnthach95/react-native-root-view-background';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {colord} from 'colord';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import duration from 'dayjs/plugin/duration';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import React, {useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {StatusBar} from 'react-native';
import RNBootSplash from 'react-native-bootsplash';
import ErrorBoundary from 'react-native-error-boundary';
import NavigationBarColor from 'react-native-navigation-bar-color';
import {NetworkProvider} from 'react-native-offline';
import {Provider as PaperProvider} from 'react-native-paper';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import Tabs from './tabs';
import '~/locales';
import type {RootStackParamList} from '~/typings/navigation';

const Stack = createStackNavigator<RootStackParamList>();

dayjs.extend(customParseFormat);
dayjs.extend(duration);
dayjs.extend(localizedFormat);

const Routes = () => {
  const hydrated = useHydration();
  const {i18n} = useTranslation();
  const mainRoute = useStore(s => s.mainRoute);
  const options = useStore(s => s.options);
  const language = useStore(s => s.language);
  const theme = options.isDark ? Dark : Light;
  const statusBarColor = colord(
    options.isDark ? Dark.colors.card : Light.colors.card,
  );
  const statusBarStyle = options.isDark ? 'light-content' : 'dark-content';

  useEffect(() => {
    const getData = async () => {
      await RNBootSplash.hide({fade: true});
      onSwitchMainRoute('MAIN');
    };
    if (hydrated) void getData();
  }, [hydrated]);

  useEffect(() => {
    i18n.changeLanguage(language);
  }, [language]);

  useEffect(() => {
    setRootViewBackgroundColor(
      options.isDark ? Dark.colors.background : Light.colors.background,
    );
    void NavigationBarColor(statusBarColor.toHex(), !options.isDark, true);
  }, [options.isDark]);

  return (
    <NetworkProvider>
      <SafeAreaProvider>
        <PaperProvider theme={theme}>
          <ErrorBoundary>
            <BottomSheetModalProvider>
              <StatusBar
                translucent
                backgroundColor={statusBarColor.alpha(0.5).toHex()}
                barStyle={statusBarStyle}
              />
              <NavigationContainer theme={theme}>
                <Stack.Navigator
                  screenOptions={{headerBackTitle: 'Back', headerShown: false}}>
                  {mainRoute === 'SPLASH' ? (
                    <Stack.Screen component={Kirin} name='Splash' />
                  ) : (
                    <>
                      <Stack.Screen component={Tabs} name='Main' />
                      <Stack.Screen
                        component={CharactersScreen}
                        name='Characters'
                        options={{headerShown: true}}
                      />
                      <Stack.Screen
                        component={CharacterDetailScreen}
                        name='CharacterDetail'
                      />
                      <Stack.Screen
                        component={StageGirlDetailScreen}
                        name='StageGirlDetail'
                      />
                      <Stack.Screen
                        component={MemoirDetailScreen}
                        name='MemoirDetail'
                      />
                      <Stack.Screen
                        component={AccessoriesScreen}
                        name='Accessories'
                        options={{headerShown: true}}
                      />
                      <Stack.Screen
                        component={AccessoryDetailScreen}
                        name='AccessoryDetail'
                      />
                      <Stack.Screen
                        component={EnemiesScreen}
                        name='Enemies'
                        options={{headerShown: true}}
                      />
                      <Stack.Screen
                        component={EnemyDetailScreen}
                        name='EnemyDetail'
                      />
                    </>
                  )}
                </Stack.Navigator>
              </NavigationContainer>
            </BottomSheetModalProvider>
          </ErrorBoundary>
        </PaperProvider>
      </SafeAreaProvider>
    </NetworkProvider>
  );
};

export default Routes;
