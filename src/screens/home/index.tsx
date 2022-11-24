import API, {links} from 'api';
import GithubService from 'api/github';
import {
  defaultEventImg,
  enemyImg,
  eventImg,
  itemImg,
  rogueImg,
  stageGirlImg,
} from 'api/images';
import frame from 'assets/common/frame_accessory.png';
import icon from 'assets/common/icon.png';
import compareVersions from 'compare-versions';
import ConnectStatus from 'components/connectstatus';
import Countdown from 'components/countdown';
import ErrorView from 'components/errorview';
import Kirin from 'components/kirin';
import Separator from 'components/separator';
import dayjs from 'dayjs';
import React, {useCallback, useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
  FlatList,
  Image,
  Linking,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import {getVersion} from 'react-native-device-info';
import FastImage from 'react-native-fast-image';
import {
  Caption,
  Colors,
  ProgressBar,
  Subheading,
  Surface,
  Text,
  Title,
  TouchableRipple,
} from 'react-native-paper';
import {responsiveScreenWidth} from 'react-native-responsive-dimensions';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import AppStyles, {borderRadius, padding} from 'theme/styles';
import type {ListRenderItem, ViewStyle} from 'react-native';
import type {MainBottomTabScreenProps} from 'typings/navigation';

type GithubVersion = {
  tag: string;
  filename: string;
  link: string;
};

const challengeRevueSeparator = () => <Separator width={10} />;

const EventImage = ({img}: {img: string}) => {
  const [uri, setURI] = useState(img);
  const onError = () => setURI(defaultEventImg);

  return (
    <FastImage
      resizeMode="contain"
      source={{uri}}
      style={[styles.eventImg, AppStyles.selfCenter]}
      onError={onError}
    />
  );
};

/** Main Screen */
const MainScreen = ({navigation}: MainBottomTabScreenProps<'MainScreen'>) => {
  const {t} = useTranslation();
  const insets = useSafeAreaInsets();
  const [version, setVersion] = useState<GithubVersion | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [section, setSection] = useState<{
    titan: TCurrentEvent['titan'];
    event: {
      data: TEvent[];
    };
    rogue: {
      data: TRogueEvent[];
    };
  } | null>(null);
  const [accessories, setAccessories] = useState<TAccessoryBasicInfo[] | null>(
    null,
  );

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
      checkVersion();
    }
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const gotData = await API.get<TCurrentEvent>(links.EVENT.WW);
      if (gotData.ok && gotData.data) {
        const data = gotData.data;
        setSection({
          event: {
            data: Object.values(data.event).map(d => ({
              ...d,
              beginAt: d.beginAt.reduce<number[]>(
                (res, current) =>
                  res.findIndex(v => v === current) === -1
                    ? [...res, current]
                    : res,
                [],
              ),
              endAt: d.endAt.reduce<number[]>(
                (res, current) =>
                  res.findIndex(v => v === current) === -1
                    ? [...res, current]
                    : res,
                [],
              ),
            })),
          },
          rogue: {data: data.rogue ? Object.values(data.rogue) : []},
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
    loadData();
  }, []);

  const rc = (
    <RefreshControl
      progressViewOffset={insets.top}
      refreshing={refreshing}
      onRefresh={onRefresh}
    />
  );

  const onDownloadApp = () => {
    if (version) {
      Linking.openURL(version.link);
    }
  };

  const renderChallengeRevue: ListRenderItem<TRogueEvent> = ({item}) => {
    const begin = dayjs(item.beginAt * 1000);
    const end = dayjs(item.endAt * 1000);
    const goToDetail = () =>
      navigation.navigate('StageGirlDetail', {id: item.id});
    const length = section ? section.rogue.data.length : 1;
    const textView: ViewStyle = {
      flexDirection: length === 1 ? 'row' : 'column',
      alignItems: length === 1 ? 'center' : 'flex-start',
    };
    return (
      <Surface
        key={item.id}
        style={[
          AppStyles.padding,
          AppStyles.borderRadius,
          AppStyles.shadow,
          styles.challengeRevue,
        ]}>
        <TouchableRipple
          borderless
          style={[styles.rogueImg, AppStyles.selfCenter]}
          onPress={goToDetail}>
          <FastImage
            source={{uri: rogueImg(item.id)}}
            style={[styles.rogueImg, AppStyles.selfCenter]}
          />
        </TouchableRipple>
        <View style={[AppStyles.spaceBetween, textView]}>
          <Caption>{t('begin')}</Caption>
          <Text>{begin.format('llll')}</Text>
        </View>
        <View style={[AppStyles.spaceBetween, textView]}>
          <Caption>{t('end')}</Caption>
          <Text>{end.format('llll')}</Text>
        </View>
        {begin.diff(dayjs()) > 0 && (
          <View style={[AppStyles.spaceBetween, textView]}>
            <Caption>{t('start-in')}</Caption>
            <Countdown miliseconds={begin.diff(dayjs())} />
          </View>
        )}
        {begin.diff(dayjs()) < 0 && end.diff(dayjs()) > 0 && (
          <View style={[AppStyles.spaceBetween, textView]}>
            <Caption>{t('end-in')}</Caption>
            <Countdown miliseconds={end.diff(dayjs())} />
          </View>
        )}
      </Surface>
    );
  };

  return (
    <View style={AppStyles.flex1}>
      {loading ? (
        <Kirin />
      ) : (
        <ScrollView
          contentContainerStyle={[
            AppStyles.paddingHorizontal,
            AppStyles.grow,
            AppStyles.columnWrapper,
          ]}
          refreshControl={rc}
          showsVerticalScrollIndicator={false}>
          <ConnectStatus />
          {version && (
            <TouchableRipple style={styles.update} onPress={onDownloadApp}>
              <Text>
                {t('download-new-version-on-github', {vTag: version.tag})}
              </Text>
            </TouchableRipple>
          )}
          {section ? (
            <>
              <View style={[AppStyles.row, AppStyles.center]}>
                <Image
                  source={icon}
                  style={[AppStyles.square40, AppStyles.marginRight]}
                />
                <Title>{t('project-karthuria')}</Title>
              </View>
              {section.event.data.length > 0 && (
                <View style={AppStyles.paddingVertical}>
                  <Subheading style={AppStyles.centerText}>
                    {t('events')}
                  </Subheading>
                  {section.event.data.map(item => {
                    const begin = item.beginAt.map(i => dayjs(i * 1000));
                    const end = item.endAt.map(i => dayjs(i * 1000));
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
                        <Separator />
                        <View style={[AppStyles.row, AppStyles.spaceBetween]}>
                          <Caption>{t('begin')}</Caption>
                          <View style={AppStyles.flex1}>
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
                          <Caption>{t('end')}</Caption>
                          <View style={AppStyles.flex1}>
                            {end.map((e, i) => (
                              <View key={`${i}-${e.toISOString()}`}>
                                <Text style={styles.rightText}>
                                  {e.format('llll')}
                                </Text>
                                {dayjs().isAfter(begin[0]) && (
                                  <Countdown
                                    miliseconds={e.diff(dayjs())}
                                    style={styles.rightText}
                                  />
                                )}
                              </View>
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
              {section.rogue.data.length > 0 && (
                <View style={AppStyles.paddingVertical}>
                  <Subheading style={AppStyles.centerText}>
                    {t('challenge-revue')}
                  </Subheading>
                  <FlatList
                    horizontal
                    data={section.rogue.data}
                    ItemSeparatorComponent={challengeRevueSeparator}
                    renderItem={renderChallengeRevue}
                    showsHorizontalScrollIndicator={false}
                  />
                </View>
              )}
              <View style={AppStyles.paddingVertical}>
                <Subheading style={AppStyles.centerText}>
                  {t('score-attack-revue')}
                </Subheading>
                <Surface
                  style={[
                    AppStyles.shadow,
                    AppStyles.contentBlock,
                    styles.titanContainer,
                  ]}>
                  <View style={AppStyles.row}>
                    {Object.values(section.titan.enemy).map(item => {
                      const onPress = () =>
                        navigation.navigate('EnemyDetail', {
                          id: `${item.id}_0`,
                        });

                      return (
                        <TouchableRipple
                          key={item.id}
                          style={[AppStyles.contentBlock, AppStyles.flex1]}
                          onPress={onPress}>
                          <>
                            <FastImage
                              source={{uri: enemyImg(item.id)}}
                              style={[
                                AppStyles.square100,
                                AppStyles.selfCenter,
                              ]}
                            />
                            <ProgressBar
                              progress={parseInt(item.hpLeftPercent, 10) / 100}
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
                        <Caption>{t('end')}</Caption>
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
                      section.titan.reward.map(item => {
                        const findA = accessories.find(
                          a => a.basicInfo.accID === item,
                        );
                        if (findA) {
                          const onPress = () =>
                            navigation.navigate('AccessoryDetail', {
                              id: item,
                            });

                          return (
                            <TouchableRipple
                              key={item}
                              borderless
                              style={[
                                styles.accessoryContainer,
                                AppStyles.center,
                              ]}
                              onPress={onPress}>
                              <View style={AppStyles.square78}>
                                <FastImage
                                  source={{
                                    uri: itemImg(findA.basicInfo.iconID),
                                  }}
                                  style={AppStyles.square78}
                                />
                                <Image
                                  source={frame}
                                  style={[
                                    AppStyles.square78,
                                    AppStyles.absolute,
                                  ]}
                                />
                                <FastImage
                                  source={{
                                    uri: stageGirlImg(findA.basicInfo.cards[0]),
                                  }}
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
            </>
          ) : (
            <ErrorView />
          )}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  accessoryContainer: {
    height: 88.4,
    width: 88.4,
  },
  challengeRevue: {
    width: responsiveScreenWidth(66),
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

MainScreen.whyDidYouRender = true;

export default MainScreen;
