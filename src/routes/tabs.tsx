import AnimatedTabBar from '@gorhom/animated-tabbar';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {Colors, useTheme} from 'react-native-paper';
import Animated from 'react-native-reanimated';
import Ionicons from 'react-native-vector-icons/MaterialCommunityIcons';
import HomeScreen from 'screens/home';
import MemoirsScreen from 'screens/memoirs';
import MoreScreen from 'screens/more';
import StageGirlsScreen from 'screens/stagegirls';
import type {
  BubbleTabBarIconProps,
  BubbleTabBarItemConfig,
  TabsConfig,
} from '@gorhom/animated-tabbar';
import type {BottomTabList} from 'typings/navigation';

const Tab = createBottomTabNavigator<BottomTabList>();

const Icon = Animated.createAnimatedComponent(Ionicons);

const homeIcon: React.FC<BubbleTabBarIconProps> = ({size, color}) => (
  <Icon color={color} name="home" size={size} />
);
const stageGirlsIcon: React.FC<BubbleTabBarIconProps> = ({size, color}) => (
  <Icon color={color} name="star-four-points" size={size} />
);
const memoirsIcon: React.FC<BubbleTabBarIconProps> = ({size, color}) => (
  <Icon color={color} name="image-area" size={size} />
);
const moreIcon: React.FC<BubbleTabBarIconProps> = ({size, color}) => (
  <Icon color={color} name="dots-horizontal" size={size} />
);

const tabs: TabsConfig<BubbleTabBarItemConfig, BottomTabList> = {
  MainScreen: {
    labelStyle: {
      color: Colors.red400,
    },
    icon: {
      component: homeIcon,
      activeColor: Colors.red400,
      inactiveColor: Colors.grey600,
    },
    background: {
      activeColor: Colors.red100,
      inactiveColor: 'transparent',
    },
  },
  StageGirlsScreen: {
    labelStyle: {
      color: Colors.blue400,
    },
    icon: {
      component: stageGirlsIcon,
      activeColor: Colors.blue400,
      inactiveColor: Colors.grey600,
    },
    background: {
      activeColor: Colors.blue50,
      inactiveColor: 'transparent',
    },
  },
  MemoirsScreen: {
    labelStyle: {
      color: Colors.lightGreen600,
    },
    icon: {
      component: memoirsIcon,
      activeColor: Colors.lightGreen600,
      inactiveColor: Colors.grey600,
    },
    background: {
      activeColor: Colors.lightGreen50,
      inactiveColor: 'transparent',
    },
  },
  MoreScreen: {
    labelStyle: {
      color: Colors.yellow900,
    },
    icon: {
      component: moreIcon,
      activeColor: Colors.yellow900,
      inactiveColor: Colors.grey600,
    },
    background: {
      activeColor: Colors.yellow100,
      inactiveColor: 'transparent',
    },
  },
};

const Tabs = () => {
  const {colors} = useTheme();
  const {t} = useTranslation();
  const tabStyle = {backgroundColor: colors.card};

  return (
    <Tab.Navigator
      backBehavior="initialRoute"
      screenOptions={{headerShown: false}}
      tabBar={props => (
        //@ts-ignore
        <AnimatedTabBar style={tabStyle} tabs={tabs} {...props} />
      )}>
      <Tab.Screen
        component={HomeScreen}
        name="MainScreen"
        options={{tabBarLabel: t('bottom-tabs.t1')}}
      />
      <Tab.Screen
        component={StageGirlsScreen}
        name="StageGirlsScreen"
        options={{tabBarLabel: t('bottom-tabs.t2')}}
      />
      <Tab.Screen
        component={MemoirsScreen}
        name="MemoirsScreen"
        options={{tabBarLabel: t('bottom-tabs.t3')}}
      />
      <Tab.Screen
        component={MoreScreen}
        name="MoreScreen"
        options={{tabBarLabel: t('bottom-tabs.t4')}}
      />
    </Tab.Navigator>
  );
};

export default Tabs;
