import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  ScrollView,
  Platform,
  StyleSheet,
  RefreshControl,
  Image,
  Linking,
} from 'react-native';
import {
  Text,
  Title,
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
  stageGirlImg,
} from '~/api/images';
import GithubService from '~/api/github';
import AppStyles, { borderRadius, padding } from '~/theme/styles';
import icon from '~/assets/common/icon.png';
import frame from '~/assets/common/frame_accessory.png';

import type { ViewStyle } from 'react-native';
import type {
  MainScreenProps,
  TAccessoryBasicInfo,
  TAccessoryList,
  TCurrentEvent,
  TEvent,
  TRogueEvent,
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
      style={[styles.eventImg, AppStyles.selfCenter]}
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
  const [refreshing, setRefreshing] = useState(false);
  const [section, setSection] =
    useState<{
      titan: TCurrentEvent['titan'];
      event: {
        data: TEvent[];
      };
      rogue: {
        data: TRogueEvent[];
      };
    } | null>(null);
  const [accessories, setAccessories] =
    useState<TAccessoryBasicInfo[] | null>(null);
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
    if (Platform.OS === 'android') {
      void checkVersion();
    }
    void loadData();
  }, []);

  const loadData = async () => {
    try {
      const gotData = await API.get<TCurrentEvent>(links.EVENT.WW);
      if (gotData.ok && gotData.data) {
        const data = gotData.data;
        setSection({
          event: {
            data: Object.values(data.event).map((d) => ({
              ...d,
              beginAt: d.beginAt.reduce<number[]>(
                (res, current) =>
                  res.findIndex((v) => v === current) === -1
                    ? [...res, current]
                    : res,
                [],
              ),
              endAt: d.endAt.reduce<number[]>(
                (res, current) =>
                  res.findIndex((v) => v === current) === -1
                    ? [...res, current]
                    : res,
                [],
              ),
            })),
          },
          rogue: { data: Object.values(data.rogue) },
          titan: data.titan,
        });
      }
      const accessoryData = await API.get<TAccessoryList>(links.LIST.ACCESSORY);
      if (accessoryData.data) {
        const data = accessoryData.data;
        setAccessories(Object.values(data));
      }
    } catch (error) {
      //
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const titanEnd = section && dayjs(section.titan.endAt * 1000);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    void loadData();
  }, []);

  const rc = <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />;

  const onDownloadApp = () => {
    if (version) {
      void Linking.openURL(version.link);
    }
  };

  return (
    <View style={[AppStyles.flex1, top]}>
      {version !== null && (
        <TouchableRipple onPress={onDownloadApp} style={styles.update}>
          <Text>{`Download new version ${version.tag} on Github!`}</Text>
        </TouchableRipple>
      )}
      <ConnectStatus />
      {loading ? (
        <Kirin />
      ) : section ? (
        <ScrollView
          refreshControl={rc}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={AppStyles.padding}>
          <View style={[AppStyles.row, AppStyles.center]}>
            <FastImage
              source={icon}
              style={[AppStyles.square40, AppStyles.marginRight]}
            />
            <Title>Project Karthuria</Title>
          </View>
          {section.event.data.length > 0 && (
            <View style={AppStyles.paddingVertical}>
              <Subheading style={AppStyles.centerText}>Events</Subheading>
              {section.event.data.map((item) => {
                const begin = item.beginAt.map((i) => dayjs(i * 1000));
                const end = item.endAt.map((i) => dayjs(i * 1000));
                if (
                  end.reduce(
                    (res, current) => current.diff(dayjs(), 'y') > 1 || res,
                    false,
                  )
                ) {
                  return null;
                }
                return (
                  <Surface
                    key={JSON.stringify(item)}
                    style={[AppStyles.contentBlock, AppStyles.shadow]}>
                    <EventImage img={eventImg(item.id)} />
                    <View style={AppStyles.paddingVertical}>
                      {end.map((e, i) => (
                        <Countdown
                          key={`${i}-${e.toISOString()}`}
                          miliseconds={e.diff(dayjs())}
                          style={AppStyles.centerText}
                        />
                      ))}
                    </View>
                    <View style={[AppStyles.row, AppStyles.spaceBetween]}>
                      <Caption>Begin</Caption>
                      <View>
                        {begin.map((b, i) => (
                          <Text
                            key={`${i}-${b.toISOString()}`}
                            style={styles.rightText}>
                            {b.format('llll')}
                          </Text>
                        ))}
                      </View>
                    </View>
                    <View style={[AppStyles.row, AppStyles.spaceBetween]}>
                      <Caption>End</Caption>
                      <View>
                        {end.map((e, i) => (
                          <Text
                            key={`${i}-${e.toISOString()}`}
                            style={styles.rightText}>
                            {e.format('llll')}
                          </Text>
                        ))}
                      </View>
                    </View>
                    {/* <View style={[AppStyles.row, AppStyles.spaceBetween]}>
                      <Caption>Type</Caption>
                      <Text>{item.referenceIndex}</Text>
                    </View> */}
                  </Surface>
                );
              })}
            </View>
          )}
          <View style={AppStyles.paddingVertical}>
            <Subheading style={AppStyles.centerText}>
              Challenge Revue
            </Subheading>
            <View
              style={[
                AppStyles.row,
                AppStyles.spaceBetween,
                styles.challengeRow,
              ]}>
              {section.rogue.data.map((item) => {
                const begin = dayjs(item.beginAt * 1000);
                const end = dayjs(item.endAt * 1000);
                const goToDetail = () =>
                  navigation.navigate('StageGirlDetail', { id: item.id });
                const { length } = section.rogue.data;
                const textView: ViewStyle = {
                  flexDirection: length === 1 ? 'row' : 'column',
                  alignItems: length === 1 ? 'center' : 'flex-start',
                };
                const widthView: ViewStyle = {
                  width:
                    styles.challengeRow.width / length - (length > 1 ? 5 : 0),
                };
                return (
                  <Surface
                    key={item.id}
                    style={[
                      AppStyles.padding,
                      AppStyles.borderRadius,
                      AppStyles.shadow,
                      widthView,
                    ]}>
                    <TouchableRipple
                      borderless
                      style={[styles.rogueImg, AppStyles.selfCenter]}
                      onPress={goToDetail}>
                      <FastImage
                        source={{ uri: rogueImg(item.id) }}
                        style={[styles.rogueImg, AppStyles.selfCenter]}
                      />
                    </TouchableRipple>
                    <View style={[AppStyles.spaceBetween, textView]}>
                      <Caption>Begin</Caption>
                      <Text>{begin.format('llll')}</Text>
                    </View>
                    <View style={[AppStyles.spaceBetween, textView]}>
                      <Caption>End</Caption>
                      <Text>{end.format('llll')}</Text>
                    </View>
                    {begin.diff(dayjs()) > 0 && (
                      <View style={[AppStyles.spaceBetween, textView]}>
                        <Caption>Start in</Caption>
                        <Countdown miliseconds={begin.diff(dayjs())} />
                      </View>
                    )}
                    {begin.diff(dayjs()) < 0 && end.diff(dayjs()) > 0 && (
                      <View style={[AppStyles.spaceBetween, textView]}>
                        <Caption>End in</Caption>
                        <Countdown miliseconds={end.diff(dayjs())} />
                      </View>
                    )}
                  </Surface>
                );
              })}
            </View>
          </View>
          <View style={AppStyles.paddingVertical}>
            <Subheading style={AppStyles.centerText}>
              Score Attack Revue
            </Subheading>
            <Surface
              style={[
                AppStyles.shadow,
                AppStyles.contentBlock,
                styles.titanContainer,
              ]}>
              <View style={AppStyles.row}>
                {Object.values(section.titan.enemy).map((item) => {
                  const source = { uri: enemyImg(item.id) };
                  const onPress = () =>
                    navigation.navigate('EnemyDetail', { id: `${item.id}_0` });

                  return (
                    <TouchableRipple
                      key={item.id}
                      style={[AppStyles.contentBlock, AppStyles.flex1]}
                      onPress={onPress}>
                      <>
                        <FastImage
                          source={source}
                          style={[AppStyles.square100, AppStyles.selfCenter]}
                        />
                        <ProgressBar
                          progress={parseInt(item.hpLeftPercent) / 100}
                          style={styles.hpBar}
                        />
                        <Text style={AppStyles.centerText}>
                          {item.hpLeft} ({item.hpLeftPercent}%)
                        </Text>
                      </>
                    </TouchableRipple>
                  );
                })}
              </View>
              {titanEnd && (
                <>
                  <View style={[AppStyles.row, AppStyles.spaceBetween]}>
                    <Caption>End</Caption>
                    <Text>{titanEnd.format('llll')}</Text>
                  </View>
                  <View style={AppStyles.paddingVertical}>
                    <Countdown
                      miliseconds={titanEnd.diff(dayjs())}
                      style={AppStyles.centerText}
                    />
                  </View>
                </>
              )}
              <View style={[AppStyles.row, AppStyles.spaceEvenly]}>
                {accessories &&
                  section.titan.reward.map((item) => {
                    const findA = accessories.find(
                      (a) => a.basicInfo.accID === item,
                    );
                    if (findA) {
                      const source = { uri: itemImg(findA.basicInfo.iconID) };
                      const stageGirl = {
                        uri: stageGirlImg(findA.basicInfo.cardID),
                      };
                      const onPress = () =>
                        navigation.navigate('AccessoryDetail', { id: item });

                      return (
                        <TouchableRipple
                          key={item}
                          borderless
                          onPress={onPress}
                          style={[styles.accessoryContainer, AppStyles.center]}>
                          <View style={AppStyles.square78}>
                            <FastImage
                              source={source}
                              style={AppStyles.square78}
                            />
                            <Image
                              source={frame}
                              style={[AppStyles.square78, AppStyles.absolute]}
                            />
                            <FastImage
                              source={stageGirl}
                              style={[
                                AppStyles.stageGirlBottomLeft,
                                AppStyles.absolute,
                              ]}
                            />
                          </View>
                        </TouchableRipple>
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
  accessoryContainer: {
    height: 88.4,
    width: 88.4,
  },
  challengeRow: {
    marginVertical: padding / 2,
    width: responsiveWidth(100) - 20,
  },
  eventImg: {
    height: 79.8,
    width: 313.6,
  },
  hpBar: {
    borderRadius: borderRadius * 2,
    height: 15,
  },
  rightText: {
    textAlign: 'right',
  },
  rogueImg: {
    height: 96,
    width: 86.4,
  },
  titanContainer: {
    paddingBottom: padding * 2,
  },
  update: {
    alignItems: 'center',
    backgroundColor: Colors.green400,
    padding: padding / 2,
  },
});

export default MainScreen;
