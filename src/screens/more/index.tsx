import React, { useContext } from 'react';
import { View, ScrollView, StyleSheet, Linking } from 'react-native';
import {
  Text,
  Paragraph,
  Switch,
  TouchableRipple,
  Colors,
  useTheme,
  Caption,
} from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import FastImage from 'react-native-fast-image';
import { getVersion } from 'react-native-device-info';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AppContext from '~/context';
import { website } from '~/api';
import { links } from '~/api/github';
import AppStyles from '~/theme/styles';
import webicon from '~/assets/common/icon.png';

import type { AppOptions, MoreScreenProps } from '~/typings';

const MoreScreen = ({ navigation }: MoreScreenProps): JSX.Element => {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const { state, dispatch } = useContext(AppContext);
  const top = { paddingTop: insets.top };

  /** Toggle dark theme */
  const themeToggle = () => {
    const data: AppOptions = {
      ...state.options,
      isDark: !state.options.isDark,
    };
    dispatch({ type: 'SAVE_OPTIONS', data });
  };

  const goToCharacters = () => navigation.navigate('Characters');

  const goToAccessories = () => navigation.navigate('Accessories');

  const openWebsite = () => Linking.openURL(website);

  const openGithub = () => Linking.openURL(links.GITHUB_PROJECT);

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={top}>
      <View style={styles.group}>
        <Text style={styles.headline}>Settings</Text>
      </View>
      <TouchableRipple onPress={themeToggle}>
        <View style={styles.settingRow}>
          <Text>Dark theme</Text>
          <Switch value={state.options.isDark} onValueChange={themeToggle} />
        </View>
      </TouchableRipple>
      <View style={styles.group}>
        <Text style={styles.headline}>Navigation</Text>
      </View>
      <TouchableRipple onPress={goToCharacters}>
        <View style={styles.normalRow}>
          <Icon name='account' color={Colors.purpleA200} size={32} />
          <View style={styles.space} />
          <Text>Characters</Text>
        </View>
      </TouchableRipple>
      <TouchableRipple onPress={goToAccessories}>
        <View style={styles.normalRow}>
          <Icon name='sword' color={Colors.orange500} size={32} />
          <View style={styles.space} />
          <Text>Accessories</Text>
        </View>
      </TouchableRipple>
      <View style={styles.group}>
        <Text style={styles.headline}>Resources</Text>
      </View>
      <TouchableRipple onPress={openWebsite}>
        <View style={styles.normalRow}>
          <FastImage source={webicon} style={styles.icon} />
          <View style={styles.space} />
          <Text>Karthuria website</Text>
        </View>
      </TouchableRipple>
      <TouchableRipple onPress={openGithub}>
        <View style={styles.normalRow}>
          <Icon name='github' color={theme.colors.text} size={32} />
          <View style={styles.space} />
          <Text>Source code on Github</Text>
        </View>
      </TouchableRipple>
      <View style={styles.group}>
        <Text style={styles.headline}>Notes</Text>
      </View>
      <View style={styles.normalRow}>
        <Paragraph>
          This app is using API from Project Karthuria website ({website}) and
          is not affiliated with Bushiroad, ATeam and any other original owners.
          All assets files are property of their original owners.
        </Paragraph>
      </View>
      <Caption style={AppStyles.centerText}>Version {getVersion()}</Caption>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  group: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 10,
    paddingHorizontal: 10,
    paddingTop: 20,
  },
  headline: {
    color: Colors.blue600,
    fontWeight: 'bold',
  },
  icon: {
    height: 32,
    width: 32,
  },
  normalRow: {
    alignItems: 'center',
    flexDirection: 'row',
    padding: 10,
  },
  settingRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },
  space: {
    width: 10,
  },
});

export default MoreScreen;
