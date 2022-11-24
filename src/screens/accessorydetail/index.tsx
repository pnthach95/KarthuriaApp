import API, {links} from 'api';
import {iconAct, imgItem, imgStageGirl} from 'api/images';
import frame from 'assets/common/frame_accessory.png';
import sgFrame from 'assets/common/frame_stage_girl.png';
import BaseScreen from 'components/basescreen';
import SkillDetail from 'components/skilldetail';
import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Image, StyleSheet, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {
  DataTable,
  Headline,
  Subheading,
  Surface,
  TouchableRipple,
} from 'react-native-paper';
import AppStyles from 'theme/styles';
import type {RootStackScreenProps} from 'typings/navigation';

const styles = StyleSheet.create({
  stageGirl: {
    height: 112,
    width: 100.8,
  },
});

const AccessoryDetailScreen = ({
  navigation,
  route,
}: RootStackScreenProps<'AccessoryDetail'>) => {
  const {t} = useTranslation();
  const [loading, setLoading] = useState(true);
  const [accessory, setAccessory] = useState<TAccessory | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const {id} = route.params;
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
    loadData();
  }, []);

  return (
    <BaseScreen hasData={!!accessory} loading={loading}>
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
              <FastImage
                source={{uri: imgItem(accessory.basicInfo.iconID)}}
                style={AppStyles.square112}
              />
              <Image
                source={frame}
                style={[AppStyles.square112, AppStyles.absolute]}
              />
              <FastImage
                source={{uri: iconAct(accessory.skillInfo.skillSlot)}}
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
                  navigation.navigate('StageGirlDetail', {id: card});

                return (
                  <TouchableRipple
                    key={card}
                    borderless
                    onPress={goToStageGirlDetail}>
                    <View>
                      <FastImage
                        source={{uri: imgStageGirl(card)}}
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
              <Subheading style={AppStyles.centerText}>{t('skill')}</Subheading>
              {accessory.skillInfo.skill.normalSkill && (
                <SkillDetail skill={accessory.skillInfo.skill.normalSkill} />
              )}
            </View>
            <View style={AppStyles.paddingVertical}>
              <Subheading style={AppStyles.centerText}>
                {t('max-stats')}
              </Subheading>
              <Surface style={[AppStyles.shadow, AppStyles.borderRadius]}>
                <DataTable>
                  <DataTable.Row>
                    <DataTable.Cell>{t('hp')}</DataTable.Cell>
                    <DataTable.Cell numeric>{accessory.stat.hp}</DataTable.Cell>
                  </DataTable.Row>
                  <DataTable.Row>
                    <DataTable.Cell>{t('act-power')}</DataTable.Cell>
                    <DataTable.Cell numeric>
                      {accessory.stat.atk}
                    </DataTable.Cell>
                  </DataTable.Row>
                  <DataTable.Row>
                    <DataTable.Cell>{t('normal-defense')}</DataTable.Cell>
                    <DataTable.Cell numeric>
                      {accessory.stat.pdef}
                    </DataTable.Cell>
                  </DataTable.Row>
                  <DataTable.Row>
                    <DataTable.Cell>{t('special-defense')}</DataTable.Cell>
                    <DataTable.Cell numeric>
                      {accessory.stat.mdef}
                    </DataTable.Cell>
                  </DataTable.Row>
                  <DataTable.Row>
                    <DataTable.Cell>{t('agility')}</DataTable.Cell>
                    <DataTable.Cell numeric>
                      {accessory.stat.agi}
                    </DataTable.Cell>
                  </DataTable.Row>
                  <DataTable.Row>
                    <DataTable.Cell>{t('dexterity')}</DataTable.Cell>
                    <DataTable.Cell numeric>
                      {accessory.stat.dex}
                    </DataTable.Cell>
                  </DataTable.Row>
                  <DataTable.Row>
                    <DataTable.Cell>{t('critical')}</DataTable.Cell>
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

AccessoryDetailScreen.whyDidYouRender = true;

export default AccessoryDetailScreen;
