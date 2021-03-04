import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AnimatedTabBar from '@gorhom/animated-tabbar';
import { useTheme, Colors } from 'react-native-paper';
import Animated from 'react-native-reanimated';
import Ionicons from 'react-native-vector-icons/Ionicons';

import HomeScreen from '~/screens/home';
import StageGirlsScreen from '~/screens/stagegirls';
import MemoirsScreen from '~/screens/memoirs';
import MoreScreen from '~/screens/more';

import type {
  TabsConfig,
  BubbleTabBarItemConfig,
} from '@gorhom/animated-tabbar';
import type { BottomTabList } from '~/typings';

type IconProps = {
  color: Animated.Node<string>;
  size: number;
};

const Tab = createBottomTabNavigator<BottomTabList>();

const Icon = Animated.createAnimatedComponent(Ionicons);

const homeIcon = ({ size, color }: IconProps) => (
  <Icon name='home' size={size} color={color} />
);
const stageGirlsIcon = ({ size, color }: IconProps) => (
  <Icon name='tablet-portrait' size={size} color={color} />
);
const memoirsIcon = ({ size, color }: IconProps) => (
  <Icon name='image' size={size} color={color} />
);
const moreIcon = ({ size, color }: IconProps) => (
  <Icon name='ellipsis-horizontal' size={size} color={color} />
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

const Tabs = (): JSX.Element => {
  const { colors } = useTheme();
  const tabStyle = { backgroundColor: colors.card };

  return (
    <Tab.Navigator
      backBehavior='initialRoute'
      tabBar={(props) => (
        //@ts-ignore
        <AnimatedTabBar tabs={tabs} style={tabStyle} {...props} />
      )}>
      <Tab.Screen
        name='MainScreen'
        component={HomeScreen}
        options={{ tabBarLabel: 'Home' }}
      />
      <Tab.Screen
        name='StageGirlsScreen'
        component={StageGirlsScreen}
        options={{ tabBarLabel: 'Stage Girls' }}
      />
      <Tab.Screen
        name='MemoirsScreen'
        component={MemoirsScreen}
        options={{ tabBarLabel: 'Memoirs' }}
      />
      <Tab.Screen
        name='MoreScreen'
        component={MoreScreen}
        options={{ tabBarLabel: 'More' }}
      />
    </Tab.Navigator>
  );
};

export default Tabs;
