import {
  BottomSheetFlatList,
  BottomSheetHandle,
  BottomSheetModal,
  useBottomSheetDynamicSnapPoints,
} from '@gorhom/bottom-sheet';
import {website} from 'api';
import {links} from 'api/github';
import {charaImgs} from 'assets';
import webicon from 'assets/common/icon.png';
import CustomBackdrop from 'components/sheet/backdrop';
import CustomBackground from 'components/sheet/background';
import React, {useMemo, useRef, useState} from 'react';
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
import {
  onSaveOptions,
  setAppColor,
  setLanguage,
  useAppColor,
  useLanguage,
  useOptions,
} from 'store';
import {useSafeAreaPaddingTop} from 'theme/styles';
import Button from './button';
import type {ListRenderItem} from 'react-native';
import type {MainBottomTabScreenProps} from 'typings/navigation';

const APP_COLORS = [
  'karen',
  'hikari',
  'mahiru',
  'claudine',
  'maya',
  'junna',
  'nana',
  'futaba',
  'kaoruko',
] as AppOptions['appColor'][];

const openWebsite = () => Linking.openURL(website);

const openGithub = () => Linking.openURL(links.GITHUB_PROJECT);

const MoreScreen = ({navigation}: MainBottomTabScreenProps<'MoreScreen'>) => {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const initialSnapPoints = useMemo(() => ['CONTENT_HEIGHT'], []);
  const {
    animatedHandleHeight,
    animatedSnapPoints,
    animatedContentHeight,
    handleContentLayout,
  } = useBottomSheetDynamicSnapPoints(initialSnapPoints);
  const {t} = useTranslation();
  const appColor = useAppColor();
  const {colors} = useTheme();
  const options = useOptions();
  const language = useLanguage();
  const [languageMenuVisible, setLanguageMenuVisible] = useState(false);
  const top = useSafeAreaPaddingTop();
  const textPrimary = {color: colors.primary};

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
  const goToWidget = () => navigation.navigate('WidgetPreview');

  const charaRenderItem: ListRenderItem<AppOptions['appColor']> = ({
    item,
    index,
  }) => {
    const bgColor = {
      backgroundColor: item === appColor ? colors.primary : undefined,
    };
    const onPress = () => {
      setAppColor(item);
      bottomSheetModalRef.current?.dismiss();
    };

    return (
      <TouchableRipple
        borderless
        className="aspect-square w-1/6 items-center justify-center rounded-full"
        style={bgColor}
        onPress={onPress}>
        <Image className="h-full w-full" source={charaImgs[index]} />
      </TouchableRipple>
    );
  };

  const openColorSheet = () => bottomSheetModalRef.current?.present();

  return (
    <ScrollView
      contentContainerStyle={top}
      showsVerticalScrollIndicator={false}>
      <View className="flex-row items-center justify-between px-3 pb-3 pt-6">
        <Text className="font-bold" style={textPrimary}>
          {t('settings')}
        </Text>
      </View>
      <TouchableRipple onPress={themeToggle}>
        <View className="flex-row items-center justify-between p-3">
          <Text>{t('dark-theme')}</Text>
          <Switch value={options.isDark} onValueChange={themeToggle} />
        </View>
      </TouchableRipple>
      <TouchableRipple onPress={openColorSheet}>
        <View className="flex-row items-center justify-between px-3">
          <Text>{t('color')}</Text>
          <Image
            className="aspect-square w-10 rounded-full"
            source={charaImgs[APP_COLORS.findIndex(c => c === appColor)]}
            style={{backgroundColor: colors.primary}}
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
      <View className="flex-row items-center justify-between px-3 pb-3 pt-6">
        <Text className="font-bold" style={textPrimary}>
          {t('navigation')}
        </Text>
      </View>
      <Button
        color={MD2Colors.deepOrange500}
        icon="account"
        label={t('characters')}
        onPress={goToCharacters}
      />
      <Button
        color={MD2Colors.orange500}
        icon="khanda"
        label={t('accessories')}
        onPress={goToAccessories}
      />
      <Button
        color={MD2Colors.deepPurple400}
        icon="ninja"
        label={t('enemies')}
        onPress={goToEnemies}
      />
      <Button
        color={MD2Colors.lightGreen500}
        icon="widgets"
        label="Widget"
        onPress={goToWidget}
      />
      <View className="flex-row items-center justify-between px-3 pb-3 pt-6">
        <Text className="font-bold" style={textPrimary}>
          {t('resources')}
        </Text>
      </View>
      <TouchableRipple onPress={openWebsite}>
        <View className="flex-row items-center space-x-3 p-3">
          <Image className="h-8 w-8" source={webicon} />
          <Text>{t('karthuria-website')}</Text>
        </View>
      </TouchableRipple>
      <Button
        color={colors.onBackground}
        icon="github"
        label={t('source-code-on-github')}
        onPress={openGithub}
      />
      <View className="flex-row items-center justify-between px-3 pb-3 pt-6">
        <Text className="font-bold" style={textPrimary}>
          {t('notes')}
        </Text>
      </View>
      <Text className="p-3" variant="bodyMedium">
        {t('note-text', {website})}
      </Text>
      <Text className="mb-3 text-center" variant="bodySmall">
        {t('version', {version: getVersion()})}
      </Text>
      <BottomSheetModal
        ref={bottomSheetModalRef}
        backdropComponent={CustomBackdrop}
        backgroundComponent={CustomBackground}
        contentHeight={animatedContentHeight}
        handleComponent={props => (
          <BottomSheetHandle
            {...props}
            indicatorStyle={{backgroundColor: colors.onBackground}}
          />
        )}
        handleHeight={animatedHandleHeight}
        snapPoints={animatedSnapPoints}>
        <View onLayout={handleContentLayout}>
          <BottomSheetFlatList
            data={APP_COLORS}
            numColumns={6}
            renderItem={charaRenderItem}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </BottomSheetModal>
    </ScrollView>
  );
};

MoreScreen.whyDidYouRender = true;

export default MoreScreen;
