import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import {
  Caption,
  Headline,
  Text,
  Subheading,
  DataTable,
  Surface,
  Colors,
} from 'react-native-paper';
import FastImage from 'react-native-fast-image';
import dayjs from 'dayjs';
import API, { links } from '~/api';
import { skillIcon, stageGirlBigImg } from '~/api/images';
import BaseScreen from '~/components/basescreen';
import Separator from '~/components/separator';
import AppStyles from '~/theme/styles';
import { attackTypeText, attribute, position, rarity } from '~/assets';
import frame from '~/assets/common/frame_thumbnail_dress_rainbow.png';

import type { OnLoadEvent } from 'react-native-fast-image';
import type { TDress, StageGirlDetailProps } from '~/typings';

const styles = StyleSheet.create({
  animation: {
    color: Colors.red300,
  },
  attackType: {
    height: 32 * 0.7,
    width: 90 * 0.7,
  },
  attribute: {
    height: 40,
    right: 0,
    width: 40,
  },
  block: {
    paddingVertical: 10,
  },
  img: {
    alignSelf: 'center',
    height: 360 * 0.6,
    width: 480 * 0.6,
  },
  infoBlock: {
    borderRadius: 5,
  },
  padding: {
    paddingBottom: 10,
    paddingHorizontal: 10,
  },
  rarity: {
    bottom: 5,
    left: 5,
  },
  role: {
    height: 80 / 3,
    right: 0,
    top: 40,
    width: 40,
  },
  skillIcon: {
    height: 40,
    marginRight: 10,
    width: 40,
  },
  surfaceBlock: {
    borderRadius: 5,
    marginVertical: 5,
    padding: 10,
  },
  tiva: {
    color: Colors.blue300,
  },
});

type Info = { info: string };

const TiVa = ({ info }: Info) => (
  <Text>
    Ti/Va: <Text style={styles.tiva}>{info}</Text>
  </Text>
);

const Animation = ({ info }: Info) => (
  <Text>
    Animation: <Text style={styles.animation}>{info}</Text>
  </Text>
);

const StageGirlDetail = ({ route }: StageGirlDetailProps): JSX.Element => {
  const [loading, setLoading] = useState(true);
  const [dress, setDress] = useState<TDress | null>(null);
  const [raritySize, setRaritySize] = useState({ height: 28, width: 140 });

  useEffect(() => {
    const loadData = async () => {
      const { id } = route.params;
      const data = await API.get<TDress>(links.DRESS + `${id}.json`);
      if (data.data) {
        setDress(data.data);
        setLoading(false);
      }
    };
    void loadData();
  }, []);

  const releasedJA = dress && dayjs(dress.basicInfo.released.ja * 1000);
  const releasedWW = dress && dayjs(dress.basicInfo.released.ww * 1000);

  const onLoad = (e: OnLoadEvent) =>
    setRaritySize({
      height: e.nativeEvent.height * 0.3,
      width: e.nativeEvent.width * 0.3,
    });

  return (
    <BaseScreen loading={loading} hasData={!!dress}>
      {dress && (
        <View style={styles.padding}>
          <Headline style={AppStyles.centerText}>
            {dress.basicInfo.name.en || dress.basicInfo.name.ja}
          </Headline>
          <View style={styles.img}>
            <FastImage
              source={{ uri: stageGirlBigImg(dress.basicInfo.cardID || '0') }}
              style={styles.img}
            />
            <FastImage
              source={frame}
              style={[styles.img, AppStyles.absolute]}
            />
            <FastImage
              source={attribute(dress.base.attribute)}
              style={[styles.attribute, AppStyles.absolute]}
            />
            <FastImage
              source={position(dress.base.roleIndex.role)}
              style={[styles.role, AppStyles.absolute]}
            />
            <FastImage
              source={rarity(dress.basicInfo.rarity)}
              resizeMode='contain'
              onLoad={onLoad}
              style={[styles.rarity, raritySize, AppStyles.absolute]}
            />
          </View>
          <View style={styles.block}>
            <Surface style={[AppStyles.shadow, styles.surfaceBlock]}>
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
                <FastImage
                  source={attackTypeText(dress.base.attackType)}
                  style={styles.attackType}
                />
              </View>
            </Surface>
          </View>
          <View style={styles.block}>
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
          <View style={styles.block}>
            <Subheading style={AppStyles.centerText}>Info</Subheading>
            <Surface style={[AppStyles.shadow, styles.surfaceBlock]}>
              <Caption>Profile</Caption>
              <Text>
                {dress.basicInfo.profile.en || dress.basicInfo.profile.ja}
              </Text>
              <Separator />
              <Caption>Message</Caption>
              <Text>
                {dress.basicInfo.message.en || dress.basicInfo.message.ja}
              </Text>
              <Separator />
              <Caption>Description</Caption>
              <Text>
                {dress.basicInfo.description.en ||
                  dress.basicInfo.description.ja}
              </Text>
            </Surface>
          </View>
          <View style={styles.block}>
            <Subheading style={AppStyles.centerText}>Basic ACT</Subheading>
            {Object.values(dress.act).map((act, index) => {
              const icon = { uri: skillIcon(act.normalSkill.iconID) };
              return (
                <Surface
                  key={`act${index}`}
                  style={[AppStyles.shadow, styles.surfaceBlock]}>
                  <View style={AppStyles.row}>
                    <FastImage source={icon} style={styles.skillIcon} />
                    <View style={AppStyles.flex1}>
                      <View style={AppStyles.row}>
                        <View style={AppStyles.flex1}>
                          <Text>
                            {act.normalSkill.name.en || act.normalSkill.name.ja}
                          </Text>
                        </View>
                        <Text>AP: {act.normalSkill.cost}</Text>
                      </View>
                      <TiVa info={act.normalSkill.skillInfo} />
                      <Animation info={act.normalSkill.skillCycle} />
                    </View>
                  </View>
                </Surface>
              );
            })}
          </View>
          <View style={styles.block}>
            <Subheading style={AppStyles.centerText}>Auto Skills</Subheading>
            {Object.values(dress.skills).map((autoSkill, index) => {
              const icon = { uri: skillIcon(autoSkill.iconID) };
              return (
                <Surface
                  key={`autoSkill${index}`}
                  style={[AppStyles.shadow, styles.surfaceBlock]}>
                  <View style={AppStyles.row}>
                    <FastImage source={icon} style={styles.skillIcon} />
                    <View style={AppStyles.flex1}>
                      <Text>{autoSkill.info.en || autoSkill.info.ja}</Text>
                    </View>
                  </View>
                </Surface>
              );
            })}
          </View>
          <View style={styles.block}>
            <Subheading style={AppStyles.centerText}>Climax ACT</Subheading>
            <Surface style={[AppStyles.shadow, styles.surfaceBlock]}>
              <View style={AppStyles.row}>
                <FastImage
                  source={{
                    uri: skillIcon(dress.groupSkills.climaxACT.iconID),
                  }}
                  style={styles.skillIcon}
                />
                <View style={AppStyles.flex1}>
                  <View style={AppStyles.row}>
                    <View style={AppStyles.flex1}>
                      <Text>
                        {dress.groupSkills.climaxACT.name.en ||
                          dress.groupSkills.climaxACT.name.ja}
                      </Text>
                    </View>
                    <Text>AP: {dress.groupSkills.climaxACT.cost}</Text>
                  </View>
                  <Caption>
                    {dress.groupSkills.climaxACT.description.en ||
                      dress.groupSkills.climaxACT.description.ja}
                  </Caption>
                  <TiVa info={dress.groupSkills.climaxACT.skillInfo} />
                  <Animation info={dress.groupSkills.climaxACT.skillCycle} />
                </View>
              </View>
            </Surface>
          </View>
          <View style={styles.block}>
            <Subheading style={AppStyles.centerText}>Unit Skill</Subheading>
            <Surface style={[AppStyles.shadow, styles.surfaceBlock]}>
              <View style={AppStyles.row}>
                <FastImage
                  source={{
                    uri: skillIcon(dress.groupSkills.unitSkill.iconID),
                  }}
                  style={styles.skillIcon}
                />
                <View style={AppStyles.flex1}>
                  <Text>
                    {dress.groupSkills.unitSkill.info.en ||
                      dress.groupSkills.unitSkill.info.ja}
                  </Text>
                </View>
              </View>
            </Surface>
          </View>
          <View style={styles.block}>
            <Subheading style={AppStyles.centerText}>Finishing ACT</Subheading>
            <Surface style={[AppStyles.shadow, styles.surfaceBlock]}>
              <View style={AppStyles.row}>
                <FastImage
                  source={{
                    uri: skillIcon(dress.groupSkills.finishACT.iconID),
                  }}
                  style={styles.skillIcon}
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

export default StageGirlDetail;
