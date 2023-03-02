import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import React from 'react';
import {useTranslation} from 'react-i18next';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import HomeScreen from 'screens/home';
import MemoirsScreen from 'screens/memoirs';
import MoreScreen from 'screens/more';
import StageGirlsScreen from 'screens/stagegirls';
import type {BottomTabList} from 'typings/navigation';

const Tab = createMaterialBottomTabNavigator<BottomTabList>();

const ICON_SIZE = 24;

const Tabs = () => {
  const {t} = useTranslation();

  return (
    <Tab.Navigator backBehavior="initialRoute">
      <Tab.Screen
        component={HomeScreen}
        name="MainScreen"
        options={{
          tabBarLabel: t('bottom-tabs.t1'),
          tabBarIcon: ({color}) => (
            <Icon color={color} name="home" size={ICON_SIZE} />
          ),
        }}
      />
      <Tab.Screen
        component={StageGirlsScreen}
        name="StageGirlsScreen"
        options={{
          tabBarLabel: t('bottom-tabs.t2'),
          tabBarIcon: ({color}) => (
            <Icon color={color} name="star-four-points" size={ICON_SIZE} />
          ),
        }}
      />
      <Tab.Screen
        component={MemoirsScreen}
        name="MemoirsScreen"
        options={{
          tabBarLabel: t('bottom-tabs.t3'),
          tabBarIcon: ({color}) => (
            <Icon color={color} name="image-area" size={ICON_SIZE} />
          ),
        }}
      />
      <Tab.Screen
        component={MoreScreen}
        name="MoreScreen"
        options={{
          tabBarLabel: t('bottom-tabs.t4'),
          tabBarIcon: ({color}) => (
            <Icon color={color} name="dots-horizontal" size={ICON_SIZE} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default Tabs;
