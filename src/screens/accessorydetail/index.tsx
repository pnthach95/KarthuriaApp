import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import {
  Headline,
  Subheading,
  Surface,
  DataTable,
  TouchableRipple,
} from 'react-native-paper';
import { CachedImage } from '@georstat/react-native-image-cache';
import API, { links } from '~/api';
import { actIcon, itemImg, stageGirlImg } from '~/api/images';
import BaseScreen from '~/components/basescreen';
import SkillDetail from '~/components/skilldetail';
import AppStyles from '~/theme/styles';
import frame from '~/assets/common/frame_accessory.png';
import sgFrame from '~/assets/common/frame_stage_girl.png';

import type { RootStackScreenProps, TAccessory } from '~/typings';

const styles = StyleSheet.create({
  stageGirl: {
    height: 112,
    width: 100.8,
  },
});

const AccessoryDetail = ({
  navigation,
  route,
}: RootStackScreenProps<'AccessoryDetail'>) => {
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

  return (
    <BaseScreen loading={loading} hasData={!!accessory}>
      {accessory && (
        <>
          <Headline style={AppStyles.centerText}>
            {accessory.basicInfo.name.en || accessory.basicInfo.name.ja}
          </Headline>
          <View
            style={[
              AppStyles.row,
              AppStyles.spaceEvenly,
              AppStyles.paddingVertical,
            ]}>
            <View>
              <CachedImage
                source={itemImg(accessory.basicInfo.iconID)}
                style={AppStyles.square112}
              />
              <Image
                source={frame}
                style={[AppStyles.square112, AppStyles.absolute]}
              />
              <CachedImage
                source={actIcon(accessory.skillInfo.skillSlot)}
                style={[
                  AppStyles.square28,
                  AppStyles.right0,
                  AppStyles.absolute,
                ]}
              />
            </View>
            <View>
              {accessory.basicInfo.cards.map(card => {
                const goToStageGirlDetail = () =>
                  accessory &&
                  navigation.navigate('StageGirlDetail', { id: card });

                return (
                  <TouchableRipple
                    key={card}
                    borderless
                    onPress={goToStageGirlDetail}>
                    <View>
                      <CachedImage
                        source={stageGirlImg(card)}
                        style={styles.stageGirl}
                      />
                      <Image
                        source={sgFrame}
                        style={[styles.stageGirl, AppStyles.absolute]}
                      />
                    </View>
                  </TouchableRipple>
                );
              })}
            </View>
          </View>
          <View style={AppStyles.paddingHorizontal}>
            <View style={AppStyles.paddingVertical}>
              <Subheading style={AppStyles.centerText}>Skill</Subheading>
              {accessory.skillInfo.skill.normalSkill && (
                <SkillDetail skill={accessory.skillInfo.skill.normalSkill} />
              )}
            </View>
            <View style={AppStyles.paddingVertical}>
              <Subheading style={AppStyles.centerText}>Max Stats</Subheading>
              <Surface style={[AppStyles.shadow, AppStyles.borderRadius]}>
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

AccessoryDetail.whyDidYouRender = true;

export default AccessoryDetail;
