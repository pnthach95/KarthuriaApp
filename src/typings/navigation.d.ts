import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import {CompositeNavigationProp} from '@react-navigation/native';
import {StackNavigationProp, StackScreenProps} from '@react-navigation/stack';

type BottomTabList = {
  MainScreen: undefined;
  StageGirlsScreen: undefined;
  MemoirsScreen: undefined;
  MoreScreen: undefined;
};

type MainBottomTabScreenProps<T extends keyof BottomTabList> = {
  navigation: CompositeNavigationProp<
    BottomTabNavigationProp<BottomTabList, T>,
    StackNavigationProp<RootStackParamList>
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
};
type RootStackScreenProps<T extends keyof RootStackParamList> =
  StackScreenProps<RootStackParamList, T>;
