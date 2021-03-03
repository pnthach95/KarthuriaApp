import React, { useState, useEffect } from 'react';
import { View, ScrollView, Platform, StyleSheet } from 'react-native';
import {
  Text,
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
import ErrorView from '~/components/errorview';
import Kirin from '~/components/kirin';
import API, { links } from '~/api';
import { eventImg } from '~/api/images';
import GithubService from '~/api/github';
import AppStyles from '~/theme/styles';

import type {
  MainScreenProps,
  TCurrentEvent,
  TEvent,
  TExtendedEvent,
} from '~/typings';
import Countdown from '~/components/countdown';

type GithubVersion = {
  tag: string;
  filename: string;
  link: string;
};

const EventImage = ({ img }: { img: string }): JSX.Element => {
  const [uri, setURI] = useState(img);
  return (
    <FastImage
      source={{ uri }}
      style={styles.eventImg}
      resizeMode='contain'
      onError={() =>
        setURI(
          'https://api.karen.makoo.eu/api/assets/ww/res/ui/images/common/base_heading_medium.png',
        )
      }
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
          <Subheading style={AppStyles.centerText}>Challenge Revue</Subheading>
          {section.rogue.data.map((item) => {
            const begin = dayjs(item.beginAt * 1000);
            const end = dayjs(item.endAt * 1000);
            return (
              <View key={item.id}>
                <Caption>Begin</Caption>
                <Text>{begin.format('llll')}</Text>
                <Caption>End</Caption>
                <Text>{end.format('llll')}</Text>
              </View>
            );
          })}
          <Subheading style={AppStyles.centerText}>
            Score Attack Revue
          </Subheading>
          <Caption>End</Caption>
          <Text>{dayjs(section.titan.endAt * 1000).format('llll')}</Text>
          {Object.values(section.titan.enemy).map((item) => {
            return (
              <View key={item.id}>
                <Caption>HP Left</Caption>
                <Text>{item.hpLeft}</Text>
                <ProgressBar
                  progress={parseInt(item.hpLeftPercent) / 100}
                  style={styles.hpBar}
                />
              </View>
            );
          })}
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
  eventImg: {
    alignSelf: 'center',
    height: 114 * 0.7,
    width: 448 * 0.7,
  },
  hpBar: {
    marginHorizontal: 30,
  },
  item: {
    paddingBottom: 10,
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
