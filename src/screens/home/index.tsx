import React, { useState, useEffect } from 'react';
import { View, ScrollView, Platform, StyleSheet } from 'react-native';
import {
  Text,
  Title,
  Divider,
  Colors,
  TouchableRipple,
  Caption,
  ProgressBar,
  Subheading,
} from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { responsiveWidth } from 'react-native-responsive-dimensions';
import { getVersion } from 'react-native-device-info';
import FastImage from 'react-native-fast-image';
import compareVersions from 'compare-versions';
import dayjs from 'dayjs';
import ConnectStatus from '~/components/connectstatus';
import Countdown from '~/components/countdown';
import ErrorView from '~/components/errorview';
import Kirin from '~/components/kirin';
import API, { links } from '~/api';
import { defaultEventImg, enemyImg, eventImg, rogueImg } from '~/api/images';
import GithubService from '~/api/github';
import AppStyles from '~/theme/styles';
import icon from '~/assets/common/icon.png';

import type {
  MainScreenProps,
  TCurrentEvent,
  TEvent,
  TExtendedEvent,
} from '~/typings';

type GithubVersion = {
  tag: string;
  filename: string;
  link: string;
};

const EventImage = ({ img }: { img: string }): JSX.Element => {
  const [uri, setURI] = useState(img);
  const onError = () => setURI(defaultEventImg);

  return (
    <FastImage
      source={{ uri }}
      style={styles.eventImg}
      resizeMode='contain'
      onError={onError}
    />
  );
};

/** Main Screen */
const MainScreen: React.FC<MainScreenProps> = () => {
  const insets = useSafeAreaInsets();
  const [version, setVersion] = useState<GithubVersion | null>(null);
  const [loading, setLoading] = useState(true);
  const [section, setSection] = useState<{
    titan: TCurrentEvent['titan'];
    event: {
      data: TExtendedEvent[];
    };
    rogue: {
      data: TEvent[];
    };
  } | null>(null);
  const top = {
    paddingTop: insets.top,
  };

  useEffect(() => {
    const checkVersion = async () => {
      try {
        const result = await GithubService.fetchLatestVersion();
        if (compareVersions.compare(getVersion(), result.tag_name, '<')) {
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
    const loadData = async () => {
      try {
        const gotData = await API.get<TCurrentEvent>(links.EVENT.WW);
        if (gotData.data) {
          const data = gotData.data;
          setSection({
            event: { data: Object.values(data.event) },
            rogue: { data: Object.values(data.rogue) },
            titan: data.titan,
          });
        }
      } catch (error) {
        //
      } finally {
        setLoading(false);
      }
    };
    if (Platform.OS === 'android') {
      void checkVersion();
    }
    void loadData();
  }, []);

  return (
    <View style={[AppStyles.flex1, top]}>
      {version !== null && (
        <TouchableRipple style={styles.update}>
          <Text>{`Download new version ${version.tag} on Github!`}</Text>
        </TouchableRipple>
      )}
      <ConnectStatus />
      {/* BODY */}
      {loading ? (
        <Kirin />
      ) : section ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}>
          <View style={[AppStyles.row, AppStyles.center]}>
            <FastImage source={icon} style={styles.icon} />
            <Title>Project Karthuria</Title>
          </View>
          <Subheading style={AppStyles.centerText}>Events</Subheading>
          {section.event.data.map((item) => {
            const begin = dayjs(item.beginAt * 1000);
            const end = dayjs(item.endAt * 1000);
            if (end.diff(dayjs(), 'y') > 1) {
              return null;
            }
            return (
              <View key={JSON.stringify(item)} style={styles.item}>
                <EventImage img={eventImg(item.id)} />
                <Countdown
                  miliseconds={end.diff(dayjs())}
                  style={AppStyles.centerText}
                />
                <Caption>Begin</Caption>
                <Text>{begin.format('llll')}</Text>
                <Caption>End</Caption>
                <Text>{end.format('llll')}</Text>
                <Caption>Type</Caption>
                <Text>{item.referenceIndex}</Text>
              </View>
            );
          })}
          <Divider />
          <Subheading style={AppStyles.centerText}>Challenge Revue</Subheading>
          <View style={AppStyles.row}>
            {section.rogue.data.map((item) => {
              const begin = dayjs(item.beginAt * 1000);
              const end = dayjs(item.endAt * 1000);
              return (
                <View key={item.id} style={[styles.rowItem, AppStyles.flex1]}>
                  <FastImage
                    source={{ uri: rogueImg(item.id) }}
                    style={styles.rogueImg}
                  />
                  <Caption>Begin</Caption>
                  <Text>{begin.format('llll')}</Text>
                  <Caption>End</Caption>
                  <Text>{end.format('llll')}</Text>
                </View>
              );
            })}
          </View>
          <Divider />
          <Subheading style={AppStyles.centerText}>
            Score Attack Revue
          </Subheading>
          <View style={AppStyles.row}>
            {Object.values(section.titan.enemy).map((item) => {
              return (
                <View key={item.id} style={[styles.item, AppStyles.flex1]}>
                  <FastImage
                    source={{ uri: enemyImg(item.id) }}
                    style={styles.enemyImg}
                  />
                  <Caption>HP Left</Caption>
                  <Text style={AppStyles.centerText}>
                    {item.hpLeft} ({item.hpLeftPercent}%)
                  </Text>
                  <ProgressBar
                    progress={parseInt(item.hpLeftPercent) / 100}
                    style={styles.hpBar}
                  />
                </View>
              );
            })}
          </View>
          <Caption>End</Caption>
          <Text>{dayjs(section.titan.endAt * 1000).format('llll')}</Text>
          {section.titan.reward.map((item) => {
            return (
              <View key={item}>
                <Text>{item}</Text>
              </View>
            );
          })}
        </ScrollView>
      ) : (
        <ErrorView />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    padding: 10,
  },
  enemyImg: {
    alignSelf: 'center',
    height: 100,
    width: 100,
  },
  eventImg: {
    alignSelf: 'center',
    height: 114 * 0.7,
    width: 448 * 0.7,
  },
  hpBar: {
    height: 15,
    marginHorizontal: 30,
  },
  icon: {
    height: 40,
    marginRight: 10,
    width: 40,
  },
  item: {
    paddingBottom: 10,
  },
  rogueImg: {
    alignSelf: 'center',
    height: 160 * 0.6,
    width: 144 * 0.6,
  },
  rowItem: {
    padding: 10,
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
