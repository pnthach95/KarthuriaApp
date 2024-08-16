import {FasterImageView} from '@candlefinance/faster-image';
import API, {links} from 'api';
import GithubService from 'api/github';
import {
  imgDefaultEvent,
  imgEnemy,
  imgEvent,
  imgItem,
  imgRogue,
} from 'api/images';
import frame from 'assets/common/frame_accessory.png';
import icon from 'assets/common/icon.png';
import compareVersions from 'compare-versions';
import ConnectStatus from 'components/connectstatus';
import Countdown from 'components/countdown';
import ErrorView from 'components/errorview';
import Kirin from 'components/kirin';
import Separator from 'components/separator';
import TextRow from 'components/textrow';
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
import {ProgressBar, Surface, Text, TouchableRipple} from 'react-native-paper';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import AppStyles from 'theme/styles';
import type {ListRenderItem, ViewStyle} from 'react-native';
import type {MainBottomTabScreenProps} from 'typings/navigation';

type GithubVersion = {
  tag: string;
  filename: string;
  link: string;
};

const styles = StyleSheet.create({
  accessory: {aspectRatio: 1, width: '100%'},
  challenge: {alignSelf: 'center', height: 96, width: 86.4},
  enemy: {alignSelf: 'center', aspectRatio: 1, width: '75%'},
  event: {alignSelf: 'center', aspectRatio: 1568 / 399, width: '100%'},
});

const challengeRevueSeparator = () => <View className="w-3" />;
const keyExtractorForChallengeRevue = (item: TRogueEvent) =>
  item.beginAt.toString();

const EventImage = ({img}: {img: string}) => {
  const [url, setURI] = useState(img);
  const onError = () => setURI(imgDefaultEvent);

  return (
    <FasterImageView
      source={{url, resizeMode: 'contain'}}
      style={styles.event}
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
      <Surface className="my-3 rounded p-3" elevation={3}>
        <TouchableRipple
          borderless
          className="h-24 w-[86.4px] self-center"
          onPress={goToDetail}>
          <FasterImageView
            source={{url: imgRogue(item.id)}}
            style={styles.challenge}
          />
        </TouchableRipple>
        <View className="justify-between" style={textView}>
          <Text variant="bodySmall">{t('begin')}</Text>
          <Text>{begin.format('llll')}</Text>
        </View>
        <View className="justify-between" style={textView}>
          <Text variant="bodySmall">{t('end')}</Text>
          <Text>{end.format('llll')}</Text>
        </View>
        {begin.diff(dayjs()) > 0 && (
          <View className="justify-between" style={textView}>
            <Text variant="bodySmall">{t('start-in')}</Text>
            <Countdown miliseconds={begin.diff(dayjs())} />
          </View>
        )}
        {begin.diff(dayjs()) < 0 && end.diff(dayjs()) > 0 && (
          <View className="justify-between" style={textView}>
            <Text variant="bodySmall">{t('end-in')}</Text>
            <Countdown miliseconds={end.diff(dayjs())} />
          </View>
        )}
      </Surface>
    );
  };

  return (
    <View className="flex-1">
      {loading ? (
        <Kirin />
      ) : (
        <ScrollView
          contentContainerStyle={AppStyles.grow}
          refreshControl={rc}
          showsVerticalScrollIndicator={false}>
          <ConnectStatus />
          {version && (
            <TouchableRipple
              className="items-center bg-green-600 p-1"
              onPress={onDownloadApp}>
              <Text>
                {t('download-new-version-on-github', {vTag: version.tag})}
              </Text>
            </TouchableRipple>
          )}
          {section ? (
            <>
              <View className="flex-row items-center justify-center space-x-3">
                <Image className="aspect-square w-10" source={icon} />
                <Text variant="titleLarge">{t('project-karthuria')}</Text>
              </View>
              {section.event.data.length > 0 && (
                <View className="py-3">
                  <Text className="text-center" variant="titleMedium">
                    {t('events')}
                  </Text>
                  <View className="mt-2 space-y-3">
                    {section.event.data.map(item => {
                      const begin = item.beginAt.map(i => dayjs(i * 1000));
                      const end = item.endAt.map(i => dayjs(i * 1000));
                      if (
                        end.reduce(
                          (res, current) =>
                            current.diff(dayjs(), 'y') > 1 || res,
                          false,
                        )
                      ) {
                        return null;
                      }
                      return (
                        <Surface
                          key={JSON.stringify(item)}
                          className="mx-3 rounded p-3"
                          elevation={3}>
                          <EventImage img={imgEvent(item.id)} />
                          <Separator />
                          <View className="flex-row justify-between">
                            <Text variant="bodySmall">{t('begin')}</Text>
                            <View className="flex-1">
                              {[
                                ...new Set(begin.map(b => b.format('llll'))),
                              ].map((s, i) => (
                                <Text key={`${i}-${s}`} className="text-right">
                                  {s}
                                </Text>
                              ))}
                            </View>
                          </View>
                          <View className="flex-row justify-between">
                            <Text variant="bodySmall">{t('end')}</Text>
                            <View className="flex-1">
                              {end.map((e, i) => (
                                <View key={`${i}-${e.toISOString()}`}>
                                  <Text className="text-right">
                                    {e.format('llll')}
                                  </Text>
                                  {dayjs().isAfter(begin[0]) && (
                                    <Countdown
                                      right
                                      miliseconds={e.diff(dayjs())}
                                    />
                                  )}
                                </View>
                              ))}
                            </View>
                          </View>
                        </Surface>
                      );
                    })}
                  </View>
                </View>
              )}
              {section.rogue.data.length > 0 && (
                <View className="pt-3">
                  <Text className="text-center" variant="titleMedium">
                    {t('challenge-revue')}
                  </Text>
                  <FlatList
                    horizontal
                    contentContainerStyle={AppStyles.paddingHorizontal}
                    data={section.rogue.data}
                    ItemSeparatorComponent={challengeRevueSeparator}
                    keyExtractor={keyExtractorForChallengeRevue}
                    renderItem={renderChallengeRevue}
                    showsHorizontalScrollIndicator={false}
                  />
                </View>
              )}
              <View className="mt-3 pb-3">
                <Text className="text-center" variant="titleMedium">
                  {t('score-attack-revue')}
                </Text>
                <Surface className="mx-3 mt-2 rounded p-3 pb-6" elevation={3}>
                  <View className="flex-row">
                    {Object.values(section.titan.enemy).map(item => {
                      const onPress = () =>
                        navigation.navigate('EnemyDetail', {
                          id: `${item.id}_0`,
                        });

                      return (
                        <TouchableRipple
                          key={item.id}
                          className="my-1 flex-1 rounded p-3"
                          onPress={onPress}>
                          <View className="space-y-2">
                            <FasterImageView
                              source={{url: imgEnemy(item.id)}}
                              style={styles.enemy}
                            />
                            <ProgressBar
                              className="h-3 rounded-full"
                              progress={parseInt(item.hpLeftPercent, 10) / 100}
                            />
                            <Text className="text-center">
                              {item.hpLeft} ({item.hpLeftPercent}%)
                            </Text>
                          </View>
                        </TouchableRipple>
                      );
                    })}
                  </View>
                  {titanEnd && (
                    <>
                      <TextRow hideDivider label={t('end')}>
                        {titanEnd.format('llll')}
                      </TextRow>
                      <View className="py-3">
                        <Countdown
                          center
                          miliseconds={titanEnd.diff(dayjs())}
                        />
                      </View>
                    </>
                  )}
                  <View className="flex-row justify-evenly">
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
                              className="aspect-square w-1/4 items-center justify-center overflow-visible"
                              onPress={onPress}>
                              <>
                                <FasterImageView
                                  source={{
                                    url: imgItem(findA.basicInfo.iconID),
                                  }}
                                  style={styles.accessory}
                                />
                                <Image
                                  className="absolute aspect-square w-full"
                                  resizeMode="contain"
                                  source={frame}
                                />
                              </>
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

export default MainScreen;
