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
  Surface,
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
import {
  defaultEventImg,
  enemyImg,
  eventImg,
  itemImg,
  rogueImg,
} from '~/api/images';
import GithubService from '~/api/github';
import AppStyles from '~/theme/styles';
import icon from '~/assets/common/icon.png';
import frame from '~/assets/common/frame_accessory.png';

import type {
  MainScreenProps,
  TAccessoryBasicInfo,
  TAccessoryList,
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
const MainScreen = ({ navigation }: MainScreenProps): JSX.Element => {
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
  const [accessories, setAccessories] = useState<TAccessoryBasicInfo[] | null>(
    null,
  );
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
        const accessoryData = await API.get<TAccessoryList>(
          links.LIST.ACCESSORY,
        );
        if (accessoryData.data) {
          const data = accessoryData.data;
          setAccessories(Object.values(data));
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

  const titanEnd = section && dayjs(section.titan.endAt * 1000);

  return (
    <View style={[AppStyles.flex1, top]}>
      {version !== null && (
        <TouchableRipple style={styles.update}>
          <Text>{`Download new version ${version.tag} on Github!`}</Text>
        </TouchableRipple>
      )}
      <ConnectStatus />
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
          <View style={styles.block}>
            <Subheading style={AppStyles.centerText}>Events</Subheading>
            {section.event.data.map((item) => {
              const begin = dayjs(item.beginAt * 1000);
              const end = dayjs(item.endAt * 1000);
              if (end.diff(dayjs(), 'y') > 1) {
                return null;
              }
              return (
                <Surface
                  key={JSON.stringify(item)}
                  style={[styles.item, AppStyles.shadow]}>
                  <EventImage img={eventImg(item.id)} />
                  <View style={styles.block}>
                    <Countdown
                      miliseconds={end.diff(dayjs())}
                      style={AppStyles.centerText}
                    />
                  </View>
                  <View style={[AppStyles.row, AppStyles.spaceBetween]}>
                    <Caption>Begin</Caption>
                    <Text>{begin.format('llll')}</Text>
                  </View>
                  <View style={[AppStyles.row, AppStyles.spaceBetween]}>
                    <Caption>End</Caption>
                    <Text>{end.format('llll')}</Text>
                  </View>
                  <View style={[AppStyles.row, AppStyles.spaceBetween]}>
                    <Caption>Type</Caption>
                    <Text>{item.referenceIndex}</Text>
                  </View>
                </Surface>
              );
            })}
          </View>
          <View style={styles.block}>
            <Subheading style={AppStyles.centerText}>
              Challenge Revue
            </Subheading>
            <View
              style={[
                AppStyles.row,
                AppStyles.spaceBetween,
                AppStyles.center,
                styles.item,
              ]}>
              {section.rogue.data.map((item) => {
                const begin = dayjs(item.beginAt * 1000);
                const end = dayjs(item.endAt * 1000);
                const goToDetail = () =>
                  navigation.navigate('StageGirlDetail', { id: item.id });
                return (
                  <Surface
                    key={item.id}
                    style={[styles.rogueItem, AppStyles.shadow]}>
                    <TouchableRipple borderless onPress={goToDetail}>
                      <FastImage
                        source={{ uri: rogueImg(item.id) }}
                        style={styles.rogueImg}
                      />
                    </TouchableRipple>
                    <Caption>Begin</Caption>
                    <Text>{begin.format('llll')}</Text>
                    <Caption>End</Caption>
                    <Text>{end.format('llll')}</Text>
                    {begin.diff(dayjs()) > 0 && (
                      <>
                        <Caption>Start in</Caption>
                        <Countdown miliseconds={begin.diff(dayjs())} />
                      </>
                    )}
                    {begin.diff(dayjs()) < 0 && end.diff(dayjs()) > 0 && (
                      <>
                        <Caption>End in</Caption>
                        <Countdown miliseconds={end.diff(dayjs())} />
                      </>
                    )}
                  </Surface>
                );
              })}
            </View>
          </View>
          <Divider />

          <View style={styles.block}>
            <Subheading style={AppStyles.centerText}>
              Score Attack Revue
            </Subheading>
            <Surface style={[AppStyles.shadow, styles.item]}>
              <View style={AppStyles.row}>
                {Object.values(section.titan.enemy).map((item) => {
                  const source = { uri: enemyImg(item.id) };
                  return (
                    <View key={item.id} style={[styles.item, AppStyles.flex1]}>
                      <FastImage source={source} style={styles.enemyImg} />
                      <ProgressBar
                        progress={parseInt(item.hpLeftPercent) / 100}
                        style={styles.hpBar}
                      />
                      <Text style={AppStyles.centerText}>
                        {item.hpLeft} ({item.hpLeftPercent}%)
                      </Text>
                    </View>
                  );
                })}
              </View>
              {titanEnd && (
                <>
                  <View style={[AppStyles.row, AppStyles.spaceBetween]}>
                    <Caption>End</Caption>
                    <Text>{titanEnd.format('llll')}</Text>
                  </View>
                  <View style={styles.block}>
                    <Countdown
                      miliseconds={titanEnd.diff(dayjs())}
                      style={AppStyles.centerText}
                    />
                  </View>
                </>
              )}
              <View style={AppStyles.row}>
                {accessories &&
                  section.titan.reward.map((item) => {
                    const findA = accessories.find(
                      (a) => a.basicInfo.accID === item,
                    );
                    if (findA) {
                      const source = { uri: itemImg(findA.basicInfo.iconID) };
                      return (
                        <View
                          key={item}
                          style={[AppStyles.flex1, AppStyles.center]}>
                          <FastImage
                            source={source}
                            style={styles.accessoryImg}
                          />
                          <FastImage
                            source={frame}
                            style={[styles.accessoryImg, AppStyles.absolute]}
                          />
                        </View>
                      );
                    }
                    return null;
                  })}
              </View>
            </Surface>
          </View>
        </ScrollView>
      ) : (
        <ErrorView />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  accessoryImg: {
    height: 112 * 0.7,
    width: 112 * 0.7,
  },
  block: {
    paddingVertical: 10,
  },
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
    borderRadius: 10,
    height: 15,
    marginHorizontal: 30,
  },
  icon: {
    height: 40,
    marginRight: 10,
    width: 40,
  },
  item: {
    borderRadius: 5,
    marginVertical: 5,
    padding: 10,
  },
  rogueImg: {
    alignSelf: 'center',
    height: 160 * 0.6,
    width: 144 * 0.6,
  },
  rogueItem: {
    borderRadius: 5,
    padding: 10,
    width: responsiveWidth(50) - 20,
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
