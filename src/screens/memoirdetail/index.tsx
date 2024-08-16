import {FasterImageView} from '@candlefinance/faster-image';
import API, {links} from 'api';
import {iconChara, imgMemoirBig} from 'api/images';
import {rarity} from 'assets';
import costEquip from 'assets/common/cost_equip.png';
import firstExecutableTurn from 'assets/common/first_executable_turn.png';
import frame from 'assets/common/frame_thumbnail_equip.png';
import recastTurn from 'assets/common/recast_turn.png';
import Kirin from 'components/kirin';
import SaveButton from 'components/savebutton';
import SkillParam from 'components/skillparam';
import TextRow from 'components/textrow';
import dayjs from 'dayjs';
import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Image, ScrollView, StyleSheet, View} from 'react-native';
import {
  DataTable,
  Surface,
  Text,
  TouchableRipple,
  useTheme,
} from 'react-native-paper';
import {useSafeAreaPaddingBottom} from 'theme/styles';
import type {ImageLoadEventData, NativeSyntheticEvent} from 'react-native';
import type {RootStackScreenProps} from 'typings/navigation';

const RARITY_HEIGHT = 216 / 17;

const styles = StyleSheet.create({
  card: {
    alignSelf: 'center',
    aspectRatio: 4 / 3,
    borderRadius: 12,
    width: '100%',
  },
  icon: {aspectRatio: 1, width: 40},
});

const MemoirDetailScreen = ({
  route,
  navigation,
}: RootStackScreenProps<'MemoirDetail'>) => {
  const {t} = useTranslation();
  const {colors} = useTheme();
  const [loading, setLoading] = useState(true);
  const [memoir, setMemoir] = useState<TEquip | null>(null);
  const [raritySize, setRaritySize] = useState({
    height: RARITY_HEIGHT,
    width: (140 * RARITY_HEIGHT) / 28,
  });
  const borderBottomColor = {
    borderBottomColor: colors.onBackground,
  };
  const contentContainer = useSafeAreaPaddingBottom(0, {padding: 12});

  useEffect(() => {
    if (memoir) {
      navigation.setOptions({
        title: memoir.basicInfo.name.en || memoir.basicInfo.name.ja,
        headerRight: memoir.basicInfo.cardID
          ? ({tintColor, pressColor}) => (
              <SaveButton
                filename={
                  (memoir.basicInfo.name.en || memoir.basicInfo.name.ja) +
                  '_' +
                  memoir.basicInfo.cardID +
                  '.png'
                }
                path={imgMemoirBig(memoir.basicInfo.cardID)}
                pressColor={pressColor}
                tintColor={tintColor}
              />
            )
          : undefined,
      });
    }
  }, [memoir]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await API.get<TEquip>(
          links.EQUIP + route.params.id + '.json',
        );
        if (response.ok && response.data) {
          setMemoir(response.data);
        }
      } catch (error) {
        //
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const onLoad = (e: NativeSyntheticEvent<ImageLoadEventData>) =>
    setRaritySize({
      height: RARITY_HEIGHT,
      width:
        (e.nativeEvent.source.width * RARITY_HEIGHT) /
        e.nativeEvent.source.height,
    });

  const releasedJA = memoir && dayjs(memoir.basicInfo.released.ja * 1000);
  const releasedWW =
    memoir &&
    memoir.basicInfo.released.ww &&
    dayjs(memoir.basicInfo.released.ww * 1000);

  if (loading) {
    return <Kirin />;
  }

  if (memoir) {
    return (
      <ScrollView
        contentContainerStyle={contentContainer}
        showsVerticalScrollIndicator={false}>
        <View className="mt-3 aspect-memoir w-5/6 self-center">
          <FasterImageView
            source={{url: imgMemoirBig(memoir.basicInfo.cardID)}}
            style={styles.card}
          />
          <Image
            className="absolute aspect-memoir w-full self-center"
            source={frame}
          />
          <Image
            className="absolute bottom-1 left-1"
            resizeMode="contain"
            source={rarity(memoir.basicInfo.rarity)}
            style={raritySize}
            onLoad={onLoad}
          />
        </View>
        <Surface className="my-3 rounded p-3" elevation={3}>
          <View className="flex-row items-center justify-between">
            <Text variant="labelSmall">{t('characters')}</Text>
            <View className="flex-row">
              {Array.isArray(memoir.basicInfo.charas) ? (
                memoir.basicInfo.charas.map(chara => {
                  const onPress = () =>
                    navigation.navigate('CharacterDetail', {id: chara});
                  return (
                    <View
                      key={`chara_${chara}`}
                      className="ml-3 overflow-hidden rounded-3xl border border-gray-500">
                      <TouchableRipple onPress={onPress}>
                        <FasterImageView
                          source={{url: iconChara(chara)}}
                          style={styles.icon}
                        />
                      </TouchableRipple>
                    </View>
                  );
                })
              ) : (
                <Text>{t('no-characters-appear-on-this-memoir')}</Text>
              )}
            </View>
          </View>
          <Text variant="labelSmall">{t('released')}</Text>
          {releasedJA && (
            <TextRow hideDivider label={t('japanese')}>
              {releasedJA.format('LLLL')}
            </TextRow>
          )}
          {releasedWW && (
            <TextRow hideDivider label={t('worldwide')}>
              {releasedWW.format('LLLL')}
            </TextRow>
          )}
        </Surface>
        <Text className="text-center" variant="titleMedium">
          {t('stats')}
        </Text>
        <Surface className="my-3 rounded" elevation={3}>
          <DataTable>
            <DataTable.Row>
              <DataTable.Cell>{t('power-score-total')}</DataTable.Cell>
              <DataTable.Cell numeric>{memoir.stat.total}</DataTable.Cell>
            </DataTable.Row>
            <DataTable.Row>
              <DataTable.Cell>{t('hp')}</DataTable.Cell>
              <DataTable.Cell numeric>{memoir.stat.hp}</DataTable.Cell>
            </DataTable.Row>
            <DataTable.Row>
              <DataTable.Cell>{t('act-power')}</DataTable.Cell>
              <DataTable.Cell numeric>{memoir.stat.atk}</DataTable.Cell>
            </DataTable.Row>
            <DataTable.Row>
              <DataTable.Cell>{t('normal-defense')}</DataTable.Cell>
              <DataTable.Cell numeric>{memoir.stat.pdef}</DataTable.Cell>
            </DataTable.Row>
            <DataTable.Row>
              <DataTable.Cell>{t('special-defense')}</DataTable.Cell>
              <DataTable.Cell numeric>{memoir.stat.mdef}</DataTable.Cell>
            </DataTable.Row>
          </DataTable>
        </Surface>
        <Text className="text-center" variant="titleMedium">
          {t('auto-skills')}
        </Text>
        <Surface className="my-3 rounded p-3" elevation={3}>
          <Text variant="bodyMedium">
            {memoir.skill.type.en || memoir.skill.type.ja}
          </Text>
          {memoir.skill.params.map((p, idx) => {
            return <SkillParam key={`skill_${idx}`} skillParam={p} />;
          })}
        </Surface>
        {!!memoir.activeSkill && (
          <>
            <Text className="text-center" variant="titleMedium">
              {t('cut-in-skill')}
            </Text>
            <Surface className="my-3 rounded p-3" elevation={3}>
              <View
                className="flex-row flex-wrap items-center justify-between"
                style={borderBottomColor}>
                <View className="flex-row items-center">
                  <View className="mr-1 rounded bg-gray-700 p-1">
                    <Image className="h-[14px] w-[18px]" source={costEquip} />
                  </View>
                  <Text>{memoir.activeSkill.cost.join('/')}</Text>
                </View>
                <View className="flex-row items-center space-x-3">
                  <Image className="h-4 w-4" source={firstExecutableTurn} />
                  <Text>
                    {memoir.activeSkill.execution.firstExecutableTurns.join(
                      '/',
                    )}
                  </Text>
                </View>
                <View className="flex-row items-center space-x-3">
                  <Image className="h-4 w-4" source={recastTurn} />
                  <Text>
                    {memoir.activeSkill.execution.recastTurns.join('/')}
                  </Text>
                </View>
                <Text>
                  {t('usage-limit')}
                  {memoir.activeSkill.execution.executeLimitCounts.join('/')}
                </Text>
              </View>
              {memoir.activeSkill.params.map((p, idx) => {
                return <SkillParam key={`activeskill_${idx}`} skillParam={p} />;
              })}
            </Surface>
          </>
        )}
        <Text className="text-center" variant="titleMedium">
          {t('introduction')}
        </Text>
        <Surface className="my-3 rounded p-3" elevation={3}>
          <Text variant="bodyMedium">
            {memoir.basicInfo.profile.en || memoir.basicInfo.profile.ja}
          </Text>
        </Surface>
      </ScrollView>
    );
  }
};

export default MemoirDetailScreen;
