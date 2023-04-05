import {MaterialBottomTabNavigationProp} from '@react-navigation/material-bottom-tabs';
import {CompositeNavigationProp} from '@react-navigation/native';
import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';

type BottomTabList = {
  MainScreen: undefined;
  StageGirlsScreen: undefined;
  MemoirsScreen: undefined;
  MoreScreen: undefined;
};

type MainBottomTabScreenProps<T extends keyof BottomTabList> = {
  navigation: CompositeNavigationProp<
    MaterialBottomTabNavigationProp<BottomTabList, T>,
    NativeStackNavigationProp<RootStackParamList>
  >;
};

type RootStackParamList = {
  Splash: undefined;
  Main: undefined;
  Characters: undefined;
  CharacterDetail: {id: number};
  StageGirlDetail: {id: string | number};
  MemoirDetail: {id: string};
  Accessories: undefined;
  AccessoryDetail: {id: number};
  Enemies: undefined;
  EnemyDetail: {id: string};
  WidgetPreview: undefined;
};

type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;
