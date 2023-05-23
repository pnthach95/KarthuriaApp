import 'locales';
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import {setRootViewBackgroundColor} from '@pnthach95/react-native-root-view-background';
import {
  NavigationContainer,
  DarkTheme as reactNavigationDark,
  DefaultTheme as reactNavigationLight,
} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import BlurStatusBar from 'components/blurstatusbar';
import Kirin from 'components/kirin';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import duration from 'dayjs/plugin/duration';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import React, {useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import RNBootSplash from 'react-native-bootsplash';
import ErrorBoundary from 'react-native-error-boundary';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {NetworkProvider} from 'react-native-offline';
import {
  MD3DarkTheme,
  MD3LightTheme,
  Provider as PaperProvider,
  adaptNavigationTheme,
} from 'react-native-paper';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import AccessoriesScreen from 'screens/accessories';
import AccessoryDetailScreen from 'screens/accessorydetail';
import CharacterDetailScreen from 'screens/characterdetail';
import CharactersScreen from 'screens/characters';
import CustomFallback from 'screens/customfallback';
import EnemiesScreen from 'screens/enemies';
import EnemyDetailScreen from 'screens/enemydetail';
import MemoirDetailScreen from 'screens/memoirdetail';
import StageGirlDetailScreen from 'screens/stagegirldetail';
import WidgetPreviewScreen from 'screens/widgetpreview';
import useStore, {onSwitchMainRoute, useHydration} from 'store';
import {useDarkColor, useLightColor} from 'theme';
import Tabs from './tabs';
import type {LinkingOptions} from '@react-navigation/native';
import type {RootStackParamList} from 'typings/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

const linking: LinkingOptions<RootStackParamList> = {
  prefixes: ['https://karth.top'],
  config: {
    initialRouteName: 'Main',
    screens: {
      Main: {
        screens: {
          StageGirlsScreen: 'dress',
          MemoirsScreen: 'equip',
        },
      },
      Characters: 'chara',
      CharacterDetail: 'chara/:id',
      StageGirlDetail: 'dress/:id',
      MemoirDetail: 'equip/:id',
      Accessories: 'accessory',
      AccessoryDetail: 'accessory/:id',
      Enemies: 'enemy',
      EnemyDetail: 'enemy/:id',
    },
  },
};

dayjs.extend(customParseFormat);
dayjs.extend(duration);
dayjs.extend(localizedFormat);

const Routes = () => {
  const hydrated = useHydration();
  const {i18n} = useTranslation();
  const options = useStore(s => s.options);
  const language = useStore(s => s.language);
  const materialLight = {...MD3LightTheme, colors: useLightColor()};
  const materialDark = {...MD3DarkTheme, colors: useDarkColor()};
  const {LightTheme, DarkTheme} = adaptNavigationTheme({
    reactNavigationLight,
    reactNavigationDark,
    materialLight,
    materialDark,
  });

  const appMaterialLight = {
    ...materialLight,
    colors: {
      ...materialLight.colors,
      ...LightTheme.colors,
    },
  };
  const appMaterialDark = {
    ...materialDark,
    colors: {
      ...materialDark.colors,
      ...DarkTheme.colors,
    },
  };
  const theme = options.isDark ? appMaterialDark : appMaterialLight;
  const navTheme = options.isDark ? DarkTheme : LightTheme;

  useEffect(() => {
    const getData = async () => {
      await RNBootSplash.hide({fade: true});
      onSwitchMainRoute('MAIN');
    };
    if (hydrated) {
      getData();
    }
  }, [hydrated]);

  useEffect(() => {
    i18n.changeLanguage(language);
  }, [language]);

  useEffect(() => {
    setRootViewBackgroundColor(theme.colors.background);
  }, [theme.colors.background]);

  return (
    <GestureHandlerRootView className="flex-1">
      <NetworkProvider>
        <SafeAreaProvider>
          <PaperProvider theme={theme}>
            <ErrorBoundary FallbackComponent={CustomFallback}>
              <BottomSheetModalProvider>
                <NavigationContainer
                  fallback={<Kirin />}
                  linking={linking}
                  theme={navTheme}>
                  <Stack.Navigator
                    screenOptions={{
                      headerBackTitle: 'Back',
                      headerShown: false,
                    }}>
                    <Stack.Screen component={Tabs} name="Main" />
                    <Stack.Screen
                      component={CharactersScreen}
                      name="Characters"
                      options={{headerShown: true}}
                    />
                    <Stack.Screen
                      component={CharacterDetailScreen}
                      name="CharacterDetail"
                    />
                    <Stack.Screen
                      component={StageGirlDetailScreen}
                      name="StageGirlDetail"
                    />
                    <Stack.Screen
                      component={MemoirDetailScreen}
                      name="MemoirDetail"
                    />
                    <Stack.Screen
                      component={AccessoriesScreen}
                      name="Accessories"
                      options={{headerShown: true}}
                    />
                    <Stack.Screen
                      component={AccessoryDetailScreen}
                      name="AccessoryDetail"
                    />
                    <Stack.Screen
                      component={EnemiesScreen}
                      name="Enemies"
                      options={{headerShown: true}}
                    />
                    <Stack.Screen
                      component={EnemyDetailScreen}
                      name="EnemyDetail"
                    />
                    <Stack.Screen
                      component={WidgetPreviewScreen}
                      name="WidgetPreview"
                      options={{headerShown: true, title: 'Widget'}}
                    />
                  </Stack.Navigator>
                </NavigationContainer>
                <BlurStatusBar />
              </BottomSheetModalProvider>
            </ErrorBoundary>
          </PaperProvider>
        </SafeAreaProvider>
      </NetworkProvider>
    </GestureHandlerRootView>
  );
};

export default Routes;
