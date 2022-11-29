import API, {links} from 'api';
import {iconChara, imgMemoirBig} from 'api/images';
import {rarity} from 'assets';
import costEquip from 'assets/common/cost_equip.png';
import firstExecutableTurn from 'assets/common/first_executable_turn.png';
import frame from 'assets/common/frame_thumbnail_equip.png';
import recastTurn from 'assets/common/recast_turn.png';
import BaseScreen from 'components/basescreen';
import Separator from 'components/separator';
import SkillParam from 'components/skillparam';
import dayjs from 'dayjs';
import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Image, StyleSheet, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {
  Caption,
  Colors,
  DataTable,
  Headline,
  Paragraph,
  Subheading,
  Surface,
  Text,
  TouchableRipple,
  useTheme,
} from 'react-native-paper';
import AppStyles, {borderRadius, padding} from 'theme/styles';
import type {ImageProps} from 'react-native';
import type {RootStackScreenProps} from 'typings/navigation';

const RARITY_HEIGHT = 216 / 17;
const costContainerBG = '#2B2B2B';
const styles = StyleSheet.create({
  alignCenter: {
    alignItems: 'center',
  },
  block: {
    borderRadius,
    marginVertical: padding,
    padding,
  },
  charaIconContainer: {
    borderColor: Colors.grey400,
    borderRadius: 20,
    borderWidth: 1,
    marginLeft: padding,
    overflow: 'hidden',
  },
  cost: {
    height: 14,
    width: 18,
  },
  costContainer: {
    backgroundColor: costContainerBG,
    borderRadius: 5,
    marginRight: 5,
    padding: 3,
  },
  frameBorderRadius: {
    borderRadius: borderRadius * 2,
  },
  icon16: {
    height: 16,
    marginRight: 10,
    width: 16,
  },
  rarity: {
    bottom: padding / 2,
    left: padding / 2,
  },
  table: {
    borderRadius,
    marginVertical: padding,
  },
  wrap: {
    flexWrap: 'wrap',
  },
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
    borderBottomColor: colors.text,
  };

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

  const onLoad: ImageProps['onLoad'] = e =>
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

  return (
    <BaseScreen hasData={!!memoir} loading={loading}>
      {memoir && (
        <View style={AppStyles.paddingHorizontal}>
          <Headline style={AppStyles.centerText}>
            {memoir.basicInfo.name.en || memoir.basicInfo.name.ja}
          </Headline>
          <View style={AppStyles.bigImg}>
            <FastImage
              source={{uri: imgMemoirBig(memoir.basicInfo.cardID)}}
              style={[AppStyles.bigImg, styles.frameBorderRadius]}
            />
            <Image
              source={frame}
              style={[AppStyles.bigImg, AppStyles.absolute]}
            />
            <Image
              resizeMode="contain"
              source={rarity(memoir.basicInfo.rarity)}
              style={[styles.rarity, AppStyles.absolute, raritySize]}
              onLoad={onLoad}
            />
          </View>
          <Surface style={[AppStyles.shadow, styles.block]}>
            <View style={[AppStyles.row, AppStyles.spaceBetween]}>
              <Caption>{t('characters')}</Caption>
              <View style={AppStyles.row}>
                {Array.isArray(memoir.basicInfo.charas) ? (
                  memoir.basicInfo.charas.map(chara => {
                    const onPress = () =>
                      navigation.navigate('CharacterDetail', {id: chara});
                    return (
                      <View
                        key={`chara_${chara}`}
                        style={styles.charaIconContainer}>
                        <TouchableRipple onPress={onPress}>
                          <FastImage
                            source={{uri: iconChara(chara)}}
                            style={AppStyles.square40}
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
            <Caption>{t('released')}</Caption>
            {releasedJA && (
              <View style={[AppStyles.row, AppStyles.spaceBetween]}>
                <Text>{t('japanese')}</Text>
                <Text>{releasedJA.format('LLLL')}</Text>
              </View>
            )}
            {releasedWW && (
              <View style={[AppStyles.row, AppStyles.spaceBetween]}>
                <Text>{t('worldwide')}</Text>
                <Text>{releasedWW.format('LLLL')}</Text>
              </View>
            )}
          </Surface>
          <Subheading style={AppStyles.centerText}>{t('stats')}</Subheading>
          <Surface style={[AppStyles.shadow, styles.table]}>
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
          <Subheading style={AppStyles.centerText}>
            {t('auto-skills')}
          </Subheading>
          <Surface style={[AppStyles.shadow, styles.block]}>
            <Paragraph>
              {memoir.skill.type.en || memoir.skill.type.ja}
            </Paragraph>
            {memoir.skill.params.map((p, idx) => {
              return <SkillParam key={`skill_${idx}`} skillParam={p} />;
            })}
          </Surface>
          {memoir.activeSkill !== 0 && (
            <>
              <Subheading style={AppStyles.centerText}>
                {t('cut-in-skill')}
              </Subheading>
              <Surface style={[AppStyles.shadow, styles.block]}>
                <View
                  style={[
                    AppStyles.rowSpaceBetween,
                    styles.wrap,
                    borderBottomColor,
                  ]}>
                  <View style={[AppStyles.row, styles.alignCenter]}>
                    <View style={styles.costContainer}>
                      <Image source={costEquip} style={styles.cost} />
                    </View>
                    <Text>{memoir.activeSkill.cost.join('/')}</Text>
                  </View>
                  <Separator width={15} />
                  <View style={[AppStyles.row, styles.alignCenter]}>
                    <Image source={firstExecutableTurn} style={styles.icon16} />
                    <Text>
                      {memoir.activeSkill.execution.firstExecutableTurns.join(
                        '/',
                      )}
                    </Text>
                  </View>
                  <Separator width={15} />
                  <View style={[AppStyles.row, styles.alignCenter]}>
                    <Image source={recastTurn} style={styles.icon16} />
                    <Text>
                      {memoir.activeSkill.execution.recastTurns.join('/')}
                    </Text>
                  </View>
                  <Separator width={15} />
                  <Text>
                    {t('usage-limit')}
                    {memoir.activeSkill.execution.executeLimitCounts.join('/')}
                  </Text>
                </View>
                {memoir.activeSkill.params.map((p, idx) => {
                  return (
                    <SkillParam key={`activeskill_${idx}`} skillParam={p} />
                  );
                })}
              </Surface>
            </>
          )}
          <Subheading style={AppStyles.centerText}>
            {t('introduction')}
          </Subheading>
          <Surface style={[AppStyles.shadow, styles.block]}>
            <Paragraph>
              {memoir.basicInfo.profile.en || memoir.basicInfo.profile.ja}
            </Paragraph>
          </Surface>
        </View>
      )}
    </BaseScreen>
  );
};

MemoirDetailScreen.whyDidYouRender = true;

export default MemoirDetailScreen;
