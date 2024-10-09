import {useTranslation} from 'react-i18next';
import {createNativeBottomTabNavigator} from 'react-native-bottom-tabs/react-navigation';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import HomeScreen from 'screens/home';
import MemoirsScreen from 'screens/memoirs';
import MoreScreen from 'screens/more';
import StageGirlsScreen from 'screens/stagegirls';
import type {ImageSourcePropType} from 'react-native';
import type {BottomTabList} from 'typings/navigation';

const Tab = createNativeBottomTabNavigator<BottomTabList>();

const ICON_SIZE = 24;
const homeIcon = Icon.getImageSourceSync(
  'home',
  ICON_SIZE,
  'white',
) as ImageSourcePropType;
const stageGirlsIcon = Icon.getImageSourceSync(
  'star-four-points',
  ICON_SIZE,
  'white',
) as ImageSourcePropType;
const memoirsIcon = Icon.getImageSourceSync(
  'image-area',
  ICON_SIZE,
  'white',
) as ImageSourcePropType;
const moreIcon = Icon.getImageSourceSync(
  'dots-horizontal',
  ICON_SIZE,
  'white',
) as ImageSourcePropType;

const Tabs = () => {
  const {t} = useTranslation();

  return (
    <Tab.Navigator backBehavior="initialRoute">
      <Tab.Screen
        component={HomeScreen}
        name="MainScreen"
        options={{
          tabBarLabel: t('bottom-tabs.t1'),
          tabBarIcon: () => homeIcon,
        }}
      />
      <Tab.Screen
        component={StageGirlsScreen}
        name="StageGirlsScreen"
        options={{
          tabBarLabel: t('bottom-tabs.t2'),
          tabBarIcon: () => stageGirlsIcon,
        }}
      />
      <Tab.Screen
        component={MemoirsScreen}
        name="MemoirsScreen"
        options={{
          tabBarLabel: t('bottom-tabs.t3'),
          tabBarIcon: () => memoirsIcon,
        }}
      />
      <Tab.Screen
        component={MoreScreen}
        name="MoreScreen"
        options={{
          tabBarLabel: t('bottom-tabs.t4'),
          tabBarIcon: () => moreIcon,
        }}
      />
    </Tab.Navigator>
  );
};

export default Tabs;
