import API, {links} from 'api';
import {iconSkill, imgStageGirlBig} from 'api/images';
import {attackTypeText, attribute, position, rarity} from 'assets';
import frame from 'assets/common/frame_thumbnail_dress.png';
import BaseScreen from 'components/basescreen';
import Separator from 'components/separator';
import SkillDetail from 'components/skilldetail';
import SkillParam from 'components/skillparam';
import dayjs from 'dayjs';
import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Image, StyleSheet, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {
  Caption,
  DataTable,
  Headline,
  Paragraph,
  Subheading,
  Surface,
  Text,
  TouchableRipple,
} from 'react-native-paper';
import AppStyles, {borderRadius, padding} from 'theme/styles';
import type {RootStackScreenProps} from 'typings/navigation';

const styles = StyleSheet.create({
  attackType: {
    height: 22.4,
    width: 63,
  },
  infoBlock: {
    borderRadius,
    marginVertical: padding / 2,
  },
  padding: {
    paddingBottom: padding,
    paddingHorizontal: padding,
  },
  rarity: {
    bottom: padding / 2,
    left: padding / 2,
  },
  role: {
    height: 80 / 3,
    right: 0,
    top: 40,
    width: 40,
  },
});

const StageGirlDetailScreen = ({
  navigation,
  route,
}: RootStackScreenProps<'StageGirlDetail'>) => {
  const {t} = useTranslation();
  const [loading, setLoading] = useState(true);
  const [dress, setDress] = useState<TDress | null>(null);
  const [character, setCharater] = useState<TChara | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const {id} = route.params;
        const dressData = await API.get<TDress>(links.DRESS + `${id}.json`);
        if (dressData.ok && dressData.data) {
          setDress(dressData.data);
          const charaData = await API.get<TChara>(
            links.CHARA + `${dressData.data.basicInfo.character}.json`,
          );
          if (charaData.ok && charaData.data) {
            setCharater(charaData.data);
          }
        }
      } catch (error) {
        //
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const releasedJA =
    dress &&
    dress.basicInfo.released.ja &&
    dayjs(dress.basicInfo.released.ja * 1000);
  const releasedWW =
    dress &&
    dress.basicInfo.released.ww &&
    dayjs(dress.basicInfo.released.ww * 1000);

  const goToCharacterDetail = () =>
    character &&
    navigation.navigate('CharacterDetail', {
      id: character.basicInfo.charaID,
    });

  return (
    <BaseScreen hasData={!!dress} loading={loading}>
      {dress && (
        <View style={styles.padding}>
          <Headline style={AppStyles.centerText}>
            {dress.basicInfo.name.en || dress.basicInfo.name.ja}
          </Headline>
          {character && (
            <TouchableRipple
              style={AppStyles.marginBottom}
              onPress={goToCharacterDetail}>
              <Subheading style={AppStyles.centerText}>
                {character.info.name.en || character.info.name.ja}
              </Subheading>
            </TouchableRipple>
          )}
          <View style={AppStyles.bigImg}>
            <FastImage
              source={{uri: imgStageGirlBig(dress.basicInfo.cardID || '0')}}
              style={AppStyles.bigImg}
            />
            <Image
              source={frame}
              style={[AppStyles.bigImg, AppStyles.absolute]}
            />
            <Image
              source={attribute(dress.base.attribute)}
              style={[AppStyles.square40, AppStyles.right0, AppStyles.absolute]}
            />
            <Image
              source={position(dress.base.roleIndex.role)}
              style={[styles.role, AppStyles.absolute]}
            />
            <Image
              source={rarity(dress.basicInfo.rarity)}
              style={[styles.rarity, AppStyles.absolute]}
            />
          </View>
          <View style={AppStyles.paddingVertical}>
            <Surface style={[AppStyles.shadow, AppStyles.contentBlock]}>
              <View style={[AppStyles.row, AppStyles.spaceBetween]}>
                <Caption>{t('cost')}</Caption>
                <Text>{dress.base.cost}</Text>
              </View>
              <Caption>{t('release-date')}</Caption>
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
              <View style={[AppStyles.row, AppStyles.spaceBetween]}>
                <Caption>{t('attack-type')}</Caption>
                <Image
                  source={attackTypeText(dress.base.attackType)}
                  style={styles.attackType}
                />
              </View>
            </Surface>
          </View>
          <View style={AppStyles.paddingVertical}>
            <Subheading style={AppStyles.centerText}>{t('stats')}</Subheading>
            <Surface style={[AppStyles.shadow, styles.infoBlock]}>
              <DataTable>
                <DataTable.Row>
                  <DataTable.Cell>{t('power-score-total')}</DataTable.Cell>
                  <DataTable.Cell numeric>{dress.stat.total}</DataTable.Cell>
                </DataTable.Row>
                <DataTable.Row>
                  <DataTable.Cell>{t('hp')}</DataTable.Cell>
                  <DataTable.Cell numeric>{dress.stat.hp}</DataTable.Cell>
                </DataTable.Row>
                <DataTable.Row>
                  <DataTable.Cell>{t('act-power')}</DataTable.Cell>
                  <DataTable.Cell numeric>{dress.stat.atk}</DataTable.Cell>
                </DataTable.Row>
                <DataTable.Row>
                  <DataTable.Cell>{t('normal-defense')}</DataTable.Cell>
                  <DataTable.Cell numeric>{dress.stat.pdef}</DataTable.Cell>
                </DataTable.Row>
                <DataTable.Row>
                  <DataTable.Cell>{t('special-defense')}</DataTable.Cell>
                  <DataTable.Cell numeric>{dress.stat.mdef}</DataTable.Cell>
                </DataTable.Row>
                <DataTable.Row>
                  <DataTable.Cell>{t('agility')}</DataTable.Cell>
                  <DataTable.Cell numeric>{dress.stat.agi}</DataTable.Cell>
                </DataTable.Row>
              </DataTable>
            </Surface>
          </View>
          <View style={AppStyles.paddingVertical}>
            <Subheading style={AppStyles.centerText}>{t('info')}</Subheading>
            <Surface style={[AppStyles.shadow, AppStyles.contentBlock]}>
              <Caption>{t('profile')}</Caption>
              <Paragraph>
                {dress.basicInfo.profile.en || dress.basicInfo.profile.ja}
              </Paragraph>
              <Separator />
              <Caption>{t('message')}</Caption>
              <Paragraph>
                {dress.basicInfo.message.en || dress.basicInfo.message.ja}
              </Paragraph>
              <Separator />
              <Caption>{t('description')}</Caption>
              <Paragraph>
                {dress.basicInfo.description.en ||
                  dress.basicInfo.description.ja}
              </Paragraph>
            </Surface>
          </View>
          <View style={AppStyles.paddingVertical}>
            <Subheading style={AppStyles.centerText}>
              {t('basic-act')}
            </Subheading>
            {Object.values(dress.act).map((act, index) => {
              return (
                <SkillDetail key={`act${index}`} skill={act.skillNormal} />
              );
            })}
          </View>
          <View style={AppStyles.paddingVertical}>
            <Subheading style={AppStyles.centerText}>
              {t('climax-act')}
            </Subheading>
            <SkillDetail skill={dress.groupSkills.climaxACT.skillNormal} />
          </View>
          <View style={AppStyles.paddingVertical}>
            <Subheading style={AppStyles.centerText}>
              {t('unit-skill')}
            </Subheading>
            <Surface style={[AppStyles.shadow, AppStyles.contentBlock]}>
              <View style={AppStyles.row}>
                <FastImage
                  source={{uri: iconSkill(dress.groupSkills.unitSkill.icon)}}
                  style={[AppStyles.square40, AppStyles.marginRight]}
                />
                <View style={AppStyles.flex1}>
                  <Paragraph>
                    {dress.groupSkills.unitSkill.description.en ||
                      dress.groupSkills.unitSkill.description.ja}
                  </Paragraph>
                </View>
              </View>
            </Surface>
          </View>
          <View style={AppStyles.paddingVertical}>
            <Subheading style={AppStyles.centerText}>
              {t('auto-skills')}
            </Subheading>
            {Object.values(dress.skills).map((autoSkill, index) => {
              return (
                <Surface
                  key={`autoSkill${index}`}
                  style={[AppStyles.shadow, AppStyles.contentBlock]}>
                  <Paragraph>
                    {autoSkill.type.en || autoSkill.type.ja}
                  </Paragraph>
                  {autoSkill.params.map((as, idx) => {
                    return (
                      <SkillParam
                        key={`sgd_skill_param_${idx}`}
                        skillParam={as}
                      />
                    );
                  })}
                </Surface>
              );
            })}
          </View>
          <View style={AppStyles.paddingVertical}>
            <Subheading style={AppStyles.centerText}>
              {t('finishing-act')}
            </Subheading>
            <Surface style={[AppStyles.shadow, AppStyles.contentBlock]}>
              <View style={AppStyles.row}>
                <FastImage
                  source={{uri: iconSkill(dress.groupSkills.finishACT.icon)}}
                  style={[AppStyles.square40, AppStyles.marginRight]}
                />
                <View style={AppStyles.flex1}>
                  <Text>
                    {dress.groupSkills.finishACT.name.en ||
                      dress.groupSkills.finishACT.name.ja}
                  </Text>
                  <Caption>
                    {dress.groupSkills.finishACT.description.en ||
                      dress.groupSkills.finishACT.description.ja}
                  </Caption>
                </View>
              </View>
            </Surface>
          </View>
        </View>
      )}
    </BaseScreen>
  );
};

StageGirlDetailScreen.whyDidYouRender = true;

export default StageGirlDetailScreen;
