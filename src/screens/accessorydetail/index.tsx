import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import {
  Text,
  Headline,
  Subheading,
  Surface,
  Caption,
  DataTable,
  TouchableRipple,
} from 'react-native-paper';
import FastImage from 'react-native-fast-image';
import API, { links } from '~/api';
import { actIcon, itemImg, skillIcon, stageGirlImg } from '~/api/images';
import BaseScreen from '~/components/basescreen';
import Animation from '~/components/animationtext';
import TiVa from '~/components/tivatext';
import AppStyles from '~/theme/styles';
import frame from '~/assets/common/frame_accessory.png';
import sgFrame from '~/assets/common/frame_stage_girl.png';

import type { AccessoryDetailProps, TAccessory } from '~/typings';

const styles = StyleSheet.create({
  accessoryImg: {
    height: 112,
    width: 112,
  },
  actIcon: {
    height: 28,
    right: 0,
    width: 28,
  },
  block: {
    paddingVertical: 10,
  },
  borderRadius: {
    borderRadius: 5,
  },
  container: {
    paddingHorizontal: 10,
  },
  skillIcon: {
    height: 40,
    marginRight: 10,
    width: 40,
  },
  stageGirl: {
    height: 112,
    width: (144 * 112) / 160,
  },
  surfaceBlock: {
    borderRadius: 5,
    marginVertical: 5,
    padding: 10,
  },
});

const AccessoryDetail = ({
  navigation,
  route,
}: AccessoryDetailProps): JSX.Element => {
  const [loading, setLoading] = useState(true);
  const [accessory, setAccessory] = useState<TAccessory | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const { id } = route.params;
        const gotData = await API.get<TAccessory>(
          links.ACCESSORY + `${id}.json`,
        );
        if (gotData.ok && gotData.data) {
          setAccessory(gotData.data);
        }
      } catch (error) {
        //
      } finally {
        setLoading(false);
      }
    };
    void loadData();
  }, []);

  const goToStageGirlDetail = () =>
    accessory &&
    navigation.navigate('StageGirlDetail', {
      id: accessory.basicInfo.cardID,
    });

  return (
    <BaseScreen loading={loading} hasData={!!accessory}>
      {accessory && (
        <>
          <Headline style={AppStyles.centerText}>
            {accessory.basicInfo.name.en || accessory.basicInfo.name.ja}
          </Headline>
          <View style={[AppStyles.row, AppStyles.spaceEvenly, styles.block]}>
            <View>
              <FastImage
                source={{ uri: itemImg(accessory.basicInfo.iconID) }}
                style={styles.accessoryImg}
              />
              <FastImage
                source={frame}
                style={[styles.accessoryImg, AppStyles.absolute]}
              />
              <FastImage
                source={{ uri: actIcon(accessory.skillInfo.skillSlot) }}
                style={[styles.actIcon, AppStyles.absolute]}
              />
            </View>
            <TouchableRipple borderless onPress={goToStageGirlDetail}>
              <View>
                <FastImage
                  source={{ uri: stageGirlImg(accessory.basicInfo.cardID) }}
                  style={styles.stageGirl}
                />
                <FastImage
                  source={sgFrame}
                  style={[styles.stageGirl, AppStyles.absolute]}
                />
              </View>
            </TouchableRipple>
          </View>
          <View style={styles.container}>
            <View style={styles.block}>
              <Subheading style={AppStyles.centerText}>Skill</Subheading>
              <Surface style={[AppStyles.shadow, styles.surfaceBlock]}>
                <View style={AppStyles.row}>
                  <FastImage
                    source={{
                      uri: skillIcon(
                        accessory.skillInfo.skill.normalSkill.iconID,
                      ),
                    }}
                    style={styles.skillIcon}
                  />
                  <View style={AppStyles.flex1}>
                    <View style={AppStyles.row}>
                      <View style={AppStyles.flex1}>
                        <Text>
                          {accessory.skillInfo.skill.normalSkill.name.en ||
                            accessory.skillInfo.skill.normalSkill.name.ja}
                        </Text>
                      </View>
                      <Text>
                        AP: {accessory.skillInfo.skill.normalSkill.cost}
                      </Text>
                    </View>
                    <Caption>
                      {accessory.skillInfo.skill.normalSkill.description.en ||
                        accessory.skillInfo.skill.normalSkill.description.ja}
                    </Caption>
                    <TiVa
                      info={accessory.skillInfo.skill.normalSkill.skillInfo}
                    />
                    <Animation
                      info={accessory.skillInfo.skill.normalSkill.skillCycle}
                    />
                  </View>
                </View>
              </Surface>
            </View>
            <View style={styles.block}>
              <Subheading style={AppStyles.centerText}>Max Stats</Subheading>
              <Surface style={[AppStyles.shadow, styles.borderRadius]}>
                <DataTable>
                  <DataTable.Row>
                    <DataTable.Cell>HP</DataTable.Cell>
                    <DataTable.Cell numeric>{accessory.stat.hp}</DataTable.Cell>
                  </DataTable.Row>
                  <DataTable.Row>
                    <DataTable.Cell>Act Power</DataTable.Cell>
                    <DataTable.Cell numeric>
                      {accessory.stat.atk}
                    </DataTable.Cell>
                  </DataTable.Row>
                  <DataTable.Row>
                    <DataTable.Cell>Normal Defense</DataTable.Cell>
                    <DataTable.Cell numeric>
                      {accessory.stat.pdef}
                    </DataTable.Cell>
                  </DataTable.Row>
                  <DataTable.Row>
                    <DataTable.Cell>Special Defense</DataTable.Cell>
                    <DataTable.Cell numeric>
                      {accessory.stat.mdef}
                    </DataTable.Cell>
                  </DataTable.Row>
                  <DataTable.Row>
                    <DataTable.Cell>Agility</DataTable.Cell>
                    <DataTable.Cell numeric>
                      {accessory.stat.agi}
                    </DataTable.Cell>
                  </DataTable.Row>
                  <DataTable.Row>
                    <DataTable.Cell>Dexterity</DataTable.Cell>
                    <DataTable.Cell numeric>
                      {accessory.stat.dex}
                    </DataTable.Cell>
                  </DataTable.Row>
                  <DataTable.Row>
                    <DataTable.Cell>Critical</DataTable.Cell>
                    <DataTable.Cell numeric>
                      {accessory.stat.cri}
                    </DataTable.Cell>
                  </DataTable.Row>
                </DataTable>
              </Surface>
            </View>
          </View>
        </>
      )}
    </BaseScreen>
  );
};

export default AccessoryDetail;
