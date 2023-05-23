import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {CommonActions} from '@react-navigation/routers';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {BottomNavigation} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import HomeScreen from 'screens/home';
import MemoirsScreen from 'screens/memoirs';
import MoreScreen from 'screens/more';
import StageGirlsScreen from 'screens/stagegirls';
import type {BottomTabList} from 'typings/navigation';

const Tab = createBottomTabNavigator<BottomTabList>();

const ICON_SIZE = 24;

const Tabs = () => {
  const {t} = useTranslation();

  return (
    <Tab.Navigator
      backBehavior="initialRoute"
      screenOptions={{headerShown: false}}
      tabBar={({navigation, state, descriptors, insets}) => (
        <BottomNavigation.Bar
          getLabelText={({route}) => {
            const {options} = descriptors[route.key];
            const label =
              options.tabBarLabel !== undefined
                ? (options.tabBarLabel as string)
                : options.title !== undefined
                ? options.title
                : route.name;
            return label;
          }}
          navigationState={state}
          renderIcon={({route, focused, color}) => {
            const {options} = descriptors[route.key];
            if (options.tabBarIcon) {
              return options.tabBarIcon({focused, color, size: 24});
            }
            return null;
          }}
          safeAreaInsets={insets}
          onTabPress={({route, preventDefault}) => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (event.defaultPrevented) {
              preventDefault();
            } else {
              navigation.dispatch({
                ...CommonActions.navigate(route.name, route.params),
                target: state.key,
              });
            }
          }}
        />
      )}>
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
