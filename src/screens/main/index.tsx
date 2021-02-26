import React, { useState, useEffect } from 'react';
import { View, ScrollView, Platform, StyleSheet } from 'react-native';
import { Text, Colors, TouchableRipple } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { responsiveWidth } from 'react-native-responsive-dimensions';
import { getVersion } from 'react-native-device-info';
import FastImage from 'react-native-fast-image';
import ConnectStatus from '~/components/connectstatus';
import GithubService from '~/api/github';
import AppStyles from '~/theme/styles';

import type { MainScreenProps } from '~/typings';

type GithubVersion = {
  tag: string;
  filename: string;
  link: string;
};

/** Main Screen */
const MainScreen: React.FC<MainScreenProps> = () => {
  const { top } = useSafeAreaInsets();
  const [version, setVersion] = useState<GithubVersion | null>(null);

  useEffect(() => {
    if (Platform.OS === 'android') {
      void checkVersion();
    }
  }, []);

  const checkVersion = async () => {
    try {
      const result = await GithubService.fetchLatestVersion();
      // console.log('github', result);
      if (compareVersion(getVersion(), result.tag_name)) {
        setVersion({
          tag: result.tag_name,
          filename: result.assets[0].name,
          link: result.assets[0].browser_download_url,
        });
      }
    } catch (error) {
      //
    }
  };

  const compareVersion = (appVersion: string, gitVersion: string) => {
    const pa = appVersion.split('.');
    const pb = gitVersion.split('.');
    for (let i = 0; i < 3; i++) {
      const na = Number(pa[i]);
      const nb = Number(pb[i]);
      if (na > nb) return false;
      if (nb > na) return true;
      if (!isNaN(na) && isNaN(nb)) return false;
      if (isNaN(na) && !isNaN(nb)) return true;
    }
    return false;
  };

  return (
    <View style={AppStyles.flex1}>
      {/* HEADER */}
      <View style={[styles.header, { paddingTop: top }]}>
        {/* <FastImage
          source={Images.logo}
          resizeMode='contain'
          style={AppStyles.imageHeader}
        /> */}
      </View>
      {version !== null && (
        <TouchableRipple style={styles.update}>
          <Text>{`Download new version ${version.tag} on Github!`}</Text>
        </TouchableRipple>
      )}
      <ConnectStatus />
      {/* BODY */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}></ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    alignItems: 'center',
    padding: 10,
  },
  header: {
    alignItems: 'center',
  },
  update: {
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: Colors.green400,
    padding: 5,
    width: responsiveWidth(90),
  },
});

export default MainScreen;
