import {website} from 'api';
import {links} from 'api/github';
import webicon from 'assets/common/icon.png';
import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Image, Linking, ScrollView, View} from 'react-native';
import {getVersion} from 'react-native-device-info';
import {
  MD2Colors,
  Menu,
  Switch,
  Text,
  TouchableRipple,
  useTheme,
} from 'react-native-paper';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import useStore, {onSaveOptions, setLanguage} from 'store';
import type {MainBottomTabScreenProps} from 'typings/navigation';

const openWebsite = () => Linking.openURL(website);

const openGithub = () => Linking.openURL(links.GITHUB_PROJECT);

const MoreScreen = ({navigation}: MainBottomTabScreenProps<'MoreScreen'>) => {
  const {t} = useTranslation();
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const options = useStore(s => s.options);
  const language = useStore(s => s.language);
  const [languageMenuVisible, setLanguageMenuVisible] = useState(false);
  const top = {paddingTop: insets.top};

  /** Toggle dark theme */
  const themeToggle = () => {
    const data: AppOptions = {
      ...options,
      isDark: !options.isDark,
    };
    onSaveOptions(data);
  };
  const openLanguage = () => setLanguageMenuVisible(true);
  const closeLanguageMenu = () => setLanguageMenuVisible(false);
  const setLanguageEN = () => {
    setLanguage('en');
    closeLanguageMenu();
  };
  const setLanguageVI = () => {
    setLanguage('vi');
    closeLanguageMenu();
  };

  const goToCharacters = () => navigation.navigate('Characters');
  const goToAccessories = () => navigation.navigate('Accessories');
  const goToEnemies = () => navigation.navigate('Enemies');

  return (
    <ScrollView
      contentContainerStyle={top}
      showsVerticalScrollIndicator={false}>
      <View className="flex-row items-center justify-between px-3 pt-6 pb-3">
        <Text className="font-bold text-blue-600">{t('settings')}</Text>
      </View>
      <TouchableRipple onPress={themeToggle}>
        <View className="flex-row items-center justify-between p-3">
          <Text>{t('dark-theme')}</Text>
          <Switch
            thumbColor={MD2Colors.red500}
            trackColor={{false: MD2Colors.grey300, true: MD2Colors.red200}}
            value={options.isDark}
            onValueChange={themeToggle}
          />
        </View>
      </TouchableRipple>
      <TouchableRipple onPress={openLanguage}>
        <View className="flex-row items-center justify-between p-3">
          <Text>{t('language')}</Text>
          <Menu
            anchor={<Text>{t(language)}</Text>}
            visible={languageMenuVisible}
            onDismiss={closeLanguageMenu}>
            <Menu.Item title={t('en')} onPress={setLanguageEN} />
            <Menu.Item title={t('vi')} onPress={setLanguageVI} />
          </Menu>
        </View>
      </TouchableRipple>
      <View className="flex-row items-center justify-between px-3 pt-6 pb-3">
        <Text className="font-bold text-blue-600">{t('navigation')}</Text>
      </View>
      <TouchableRipple onPress={goToCharacters}>
        <View className="flex-row items-center space-x-3 p-3">
          <Icon color={MD2Colors.deepOrange500} name="account" size={32} />
          <Text>{t('characters')}</Text>
        </View>
      </TouchableRipple>
      <TouchableRipple onPress={goToAccessories}>
        <View className="flex-row items-center space-x-3 p-3">
          <Icon color={MD2Colors.orange500} name="khanda" size={32} />
          <Text>{t('accessories')}</Text>
        </View>
      </TouchableRipple>
      <TouchableRipple onPress={goToEnemies}>
        <View className="flex-row items-center space-x-3 p-3">
          <Icon color={MD2Colors.deepPurple400} name="ninja" size={32} />
          <Text>{t('enemies')}</Text>
        </View>
      </TouchableRipple>
      <View className="flex-row items-center justify-between px-3 pt-6 pb-3">
        <Text className="font-bold text-blue-600">{t('resources')}</Text>
      </View>
      <TouchableRipple onPress={openWebsite}>
        <View className="flex-row items-center space-x-3 p-3">
          <Image className="h-8 w-8" source={webicon} />
          <Text>{t('karthuria-website')}</Text>
        </View>
      </TouchableRipple>
      <TouchableRipple onPress={openGithub}>
        <View className="flex-row items-center space-x-3 p-3">
          <Icon color={theme.colors.onBackground} name="github" size={32} />
          <Text>{t('source-code-on-github')}</Text>
        </View>
      </TouchableRipple>
      <View className="flex-row items-center justify-between px-3 pt-6 pb-3">
        <Text className="font-bold text-blue-600">{t('notes')}</Text>
      </View>
      <View className="flex-row items-center p-3">
        <Text variant="bodyMedium">{t('note-text', {website})}</Text>
      </View>
      <Text className="text-center" variant="bodySmall">
        {t('version', {version: getVersion()})}
      </Text>
    </ScrollView>
  );
};

MoreScreen.whyDidYouRender = true;

export default MoreScreen;
