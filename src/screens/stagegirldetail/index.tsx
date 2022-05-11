import React, { useEffect, useState } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import {
  ActivityIndicator,
  Caption,
  Headline,
  Text,
  Subheading,
  Paragraph,
  DataTable,
  Surface,
  TouchableRipple,
} from 'react-native-paper';
import { CachedImage } from '@georstat/react-native-image-cache';
import dayjs from 'dayjs';
import API, { links } from '~/api';
import { skillIcon, stageGirlBigImg } from '~/api/images';
import BaseScreen from '~/components/basescreen';
import Separator from '~/components/separator';
import SkillDetail from '~/components/skilldetail';
import AppStyles, { borderRadius, padding } from '~/theme/styles';
import { attackTypeText, attribute, position, rarity } from '~/assets';
import frame from '~/assets/common/frame_thumbnail_dress.png';

import type { TDress, RootStackScreenProps, TChara } from '~/typings';

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

const loadingImage = () => (
  <View style={[AppStyles.flex1, AppStyles.center, AppStyles.bigImg]}>
    <ActivityIndicator size='large' />
  </View>
);

const StageGirlDetail = ({
  navigation,
  route,
}: RootStackScreenProps<'StageGirlDetail'>) => {
  const [loading, setLoading] = useState(true);
  const [dress, setDress] = useState<TDress | null>(null);
  const [character, setCharater] = useState<TChara | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const { id } = route.params;
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
    void loadData();
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
    <BaseScreen loading={loading} hasData={!!dress}>
      {dress && (
        <View style={styles.padding}>
          <Headline style={AppStyles.centerText}>
            {dress.basicInfo.name.en || dress.basicInfo.name.ja}
          </Headline>
          {character && (
            <TouchableRipple
              onPress={goToCharacterDetail}
              style={AppStyles.marginBottom}>
              <Subheading style={AppStyles.centerText}>
                {character.info.name.en || character.info.name.ja}
              </Subheading>
            </TouchableRipple>
          )}
          <View style={AppStyles.bigImg}>
            <CachedImage
              source={stageGirlBigImg(dress.basicInfo.cardID || '0')}
              style={AppStyles.bigImg}
              loadingImageComponent={loadingImage}
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
              <Caption>Release date</Caption>
              {releasedJA && (
                <View style={[AppStyles.row, AppStyles.spaceBetween]}>
                  <Text>Japanese</Text>
                  <Text>{releasedJA.format('LLLL')}</Text>
                </View>
              )}
              {releasedWW && (
                <View style={[AppStyles.row, AppStyles.spaceBetween]}>
                  <Text>Worldwide</Text>
                  <Text>{releasedWW.format('LLLL')}</Text>
                </View>
              )}
              <View style={[AppStyles.row, AppStyles.spaceBetween]}>
                <Caption>Attack type</Caption>
                <Image
                  source={attackTypeText(dress.base.attackType)}
                  style={styles.attackType}
                />
              </View>
            </Surface>
          </View>
          <View style={AppStyles.paddingVertical}>
            <Subheading style={AppStyles.centerText}>Stats</Subheading>
            <Surface style={[AppStyles.shadow, styles.infoBlock]}>
              <DataTable>
                <DataTable.Row>
                  <DataTable.Cell>Power Score (Total)</DataTable.Cell>
                  <DataTable.Cell numeric>{dress.stat.total}</DataTable.Cell>
                </DataTable.Row>
                <DataTable.Row>
                  <DataTable.Cell>HP</DataTable.Cell>
                  <DataTable.Cell numeric>{dress.stat.hp}</DataTable.Cell>
                </DataTable.Row>
                <DataTable.Row>
                  <DataTable.Cell>Act Power</DataTable.Cell>
                  <DataTable.Cell numeric>{dress.stat.atk}</DataTable.Cell>
                </DataTable.Row>
                <DataTable.Row>
                  <DataTable.Cell>Normal Defense</DataTable.Cell>
                  <DataTable.Cell numeric>{dress.stat.pdef}</DataTable.Cell>
                </DataTable.Row>
                <DataTable.Row>
                  <DataTable.Cell>Special Defense</DataTable.Cell>
                  <DataTable.Cell numeric>{dress.stat.mdef}</DataTable.Cell>
                </DataTable.Row>
                <DataTable.Row>
                  <DataTable.Cell>Agility</DataTable.Cell>
                  <DataTable.Cell numeric>{dress.stat.agi}</DataTable.Cell>
                </DataTable.Row>
              </DataTable>
            </Surface>
          </View>
          <View style={AppStyles.paddingVertical}>
            <Subheading style={AppStyles.centerText}>Info</Subheading>
            <Surface style={[AppStyles.shadow, AppStyles.contentBlock]}>
              <Caption>Profile</Caption>
              <Paragraph>
                {dress.basicInfo.profile.en || dress.basicInfo.profile.ja}
              </Paragraph>
              <Separator />
              <Caption>Message</Caption>
              <Paragraph>
                {dress.basicInfo.message.en || dress.basicInfo.message.ja}
              </Paragraph>
              <Separator />
              <Caption>Description</Caption>
              <Paragraph>
                {dress.basicInfo.description.en ||
                  dress.basicInfo.description.ja}
              </Paragraph>
            </Surface>
          </View>
          <View style={AppStyles.paddingVertical}>
            <Subheading style={AppStyles.centerText}>Basic ACT</Subheading>
            {Object.values(dress.act).map((act, index) => {
              return (
                <SkillDetail key={`act${index}`} skill={act.normalSkill} />
              );
            })}
          </View>
          <View style={AppStyles.paddingVertical}>
            <Subheading style={AppStyles.centerText}>Auto Skills</Subheading>
            {Object.values(dress.skills).map((autoSkill, index) => {
              return (
                <Surface
                  key={`autoSkill${index}`}
                  style={[AppStyles.shadow, AppStyles.contentBlock]}>
                  <View style={AppStyles.row}>
                    <CachedImage
                      source={skillIcon(autoSkill.iconID)}
                      style={[AppStyles.square40, AppStyles.marginRight]}
                    />
                    <View style={AppStyles.flex1}>
                      <Paragraph>
                        {autoSkill.info.en || autoSkill.info.ja}
                      </Paragraph>
                    </View>
                  </View>
                </Surface>
              );
            })}
          </View>
          <View style={AppStyles.paddingVertical}>
            <Subheading style={AppStyles.centerText}>Climax ACT</Subheading>
            <SkillDetail skill={dress.groupSkills.climaxACT} />
          </View>
          <View style={AppStyles.paddingVertical}>
            <Subheading style={AppStyles.centerText}>Unit Skill</Subheading>
            <Surface style={[AppStyles.shadow, AppStyles.contentBlock]}>
              <View style={AppStyles.row}>
                <CachedImage
                  source={skillIcon(dress.groupSkills.unitSkill.iconID)}
                  style={[AppStyles.square40, AppStyles.marginRight]}
                />
                <View style={AppStyles.flex1}>
                  <Paragraph>
                    {dress.groupSkills.unitSkill.info.en ||
                      dress.groupSkills.unitSkill.info.ja}
                  </Paragraph>
                </View>
              </View>
            </Surface>
          </View>
          <View style={AppStyles.paddingVertical}>
            <Subheading style={AppStyles.centerText}>Finishing ACT</Subheading>
            <Surface style={[AppStyles.shadow, AppStyles.contentBlock]}>
              <View style={AppStyles.row}>
                <CachedImage
                  source={skillIcon(dress.groupSkills.finishACT.iconID)}
                  style={[AppStyles.square40, AppStyles.marginRight]}
                />
                <View style={AppStyles.flex1}>
                  <Text>
                    {dress.groupSkills.finishACT.name.en ||
                      dress.groupSkills.finishACT.name.ja}
                  </Text>
                  <Caption>
                    {dress.groupSkills.finishACT.info.en ||
                      dress.groupSkills.finishACT.info.ja}
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

StageGirlDetail.whyDidYouRender = true;

export default StageGirlDetail;
