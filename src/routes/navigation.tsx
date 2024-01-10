import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Kirin from 'components/kirin';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {StatusBar} from 'react-native';
import AccessoriesScreen from 'screens/accessories';
import AccessoryDetailScreen from 'screens/accessorydetail';
import CharacterDetailScreen from 'screens/characterdetail';
import CharactersScreen from 'screens/characters';
import EnemiesScreen from 'screens/enemies';
import EnemyDetailScreen from 'screens/enemydetail';
import MemoirDetailScreen from 'screens/memoirdetail';
import StageGirlDetailScreen from 'screens/stagegirldetail';
import WidgetPreviewScreen from 'screens/widgetpreview';
import {useOptions} from 'store';
import {useAppTheme} from 'theme';
import Tabs from './tabs';
import type {LinkingOptions} from '@react-navigation/native';
import type {RootStackParamList} from 'typings/navigation';

const Stack = createStackNavigator<RootStackParamList>();

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

const Navigation = () => {
  const {t} = useTranslation();
  const options = useOptions();
  const {LightTheme, DarkTheme} = useAppTheme();
  const navTheme = options.isDark ? DarkTheme : LightTheme;

  return (
    <>
      <StatusBar
        backgroundColor={navTheme.colors.card}
        barStyle={options.isDark ? 'light-content' : 'dark-content'}
      />
      <NavigationContainer
        fallback={<Kirin />}
        linking={linking}
        theme={navTheme}>
        <Stack.Navigator
          screenOptions={{
            headerBackTitle: 'Back',
          }}>
          <Stack.Screen
            component={Tabs}
            name="Main"
            options={{headerShown: false}}
          />
          <Stack.Screen component={CharactersScreen} name="Characters" />
          <Stack.Screen
            component={CharacterDetailScreen}
            name="CharacterDetail"
          />
          <Stack.Screen
            component={StageGirlDetailScreen}
            name="StageGirlDetail"
            options={{headerTitle: t('loading')}}
          />
          <Stack.Screen component={MemoirDetailScreen} name="MemoirDetail" />
          <Stack.Screen component={AccessoriesScreen} name="Accessories" />
          <Stack.Screen
            component={AccessoryDetailScreen}
            name="AccessoryDetail"
          />
          <Stack.Screen component={EnemiesScreen} name="Enemies" />
          <Stack.Screen component={EnemyDetailScreen} name="EnemyDetail" />
          <Stack.Screen
            component={WidgetPreviewScreen}
            name="WidgetPreview"
            options={{title: 'Widget'}}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
};

export default Navigation;
