import {website} from 'api';
import {links} from 'api/github';
import webicon from 'assets/common/icon.png';
import Separator from 'components/separator';
import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Image, Linking, ScrollView, StyleSheet, View} from 'react-native';
import {getVersion} from 'react-native-device-info';
import {
  Caption,
  Colors,
  Menu,
  Paragraph,
  Switch,
  Text,
  TouchableRipple,
  useTheme,
} from 'react-native-paper';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import useStore, {onSaveOptions, setLanguage} from 'store';
import AppStyles, {padding} from 'theme/styles';
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
      <View style={[styles.group, AppStyles.rowSpaceBetween]}>
        <Text style={styles.headline}>{t('settings')}</Text>
      </View>
      <TouchableRipple onPress={themeToggle}>
        <View style={[styles.row, AppStyles.spaceBetween]}>
          <Text>{t('dark-theme')}</Text>
          <Switch
            thumbColor={Colors.red500}
            trackColor={{false: Colors.grey300, true: Colors.red200}}
            value={options.isDark}
            onValueChange={themeToggle}
          />
        </View>
      </TouchableRipple>
      <TouchableRipple onPress={openLanguage}>
        <View style={[styles.row, AppStyles.spaceBetween]}>
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
      <View style={[styles.group, AppStyles.rowSpaceBetween]}>
        <Text style={styles.headline}>{t('navigation')}</Text>
      </View>
      <TouchableRipple onPress={goToCharacters}>
        <View style={styles.row}>
          <Icon color={Colors.deepOrange500} name="account" size={32} />
          <Separator width={10} />
          <Text>{t('characters')}</Text>
        </View>
      </TouchableRipple>
      <TouchableRipple onPress={goToAccessories}>
        <View style={styles.row}>
          <Icon color={Colors.orange500} name="khanda" size={32} />
          <Separator width={10} />
          <Text>{t('accessories')}</Text>
        </View>
      </TouchableRipple>
      <TouchableRipple onPress={goToEnemies}>
        <View style={styles.row}>
          <Icon color={Colors.deepPurple400} name="ninja" size={32} />
          <Separator width={10} />
          <Text>{t('enemies')}</Text>
        </View>
      </TouchableRipple>
      <View style={[styles.group, AppStyles.rowSpaceBetween]}>
        <Text style={styles.headline}>{t('resources')}</Text>
      </View>
      <TouchableRipple onPress={openWebsite}>
        <View style={styles.row}>
          <Image source={webicon} style={styles.icon} />
          <Separator width={10} />
          <Text>{t('karthuria-website')}</Text>
        </View>
      </TouchableRipple>
      <TouchableRipple onPress={openGithub}>
        <View style={styles.row}>
          <Icon color={theme.colors.text} name="github" size={32} />
          <Separator width={10} />
          <Text>{t('source-code-on-github')}</Text>
        </View>
      </TouchableRipple>
      <View style={[styles.group, AppStyles.rowSpaceBetween]}>
        <Text style={styles.headline}>{t('notes')}</Text>
      </View>
      <View style={styles.row}>
        <Paragraph>{t('note-text', {website})}</Paragraph>
      </View>
      <Caption style={AppStyles.centerText}>
        {t('version', {version: getVersion()})}
      </Caption>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  group: {
    paddingBottom: padding,
    paddingHorizontal: padding,
    paddingTop: 2 * padding,
  },
  headline: {
    color: Colors.blue600,
    fontWeight: 'bold',
  },
  icon: {
    height: 32,
    width: 32,
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    padding,
  },
});

MoreScreen.whyDidYouRender = true;

export default MoreScreen;
