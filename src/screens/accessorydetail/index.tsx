import API, {links} from 'api';
import {iconAct, imgItem, imgStageGirl} from 'api/images';
import frame from 'assets/common/frame_accessory.png';
import sgFrame from 'assets/common/frame_stage_girl.png';
import BaseScreen from 'components/basescreen';
import SkillDetail from 'components/skilldetail';
import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {DataTable, Surface, Text, TouchableRipple} from 'react-native-paper';
import type {RootStackScreenProps} from 'typings/navigation';

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
        const response = await API.get<TAccessory>(
          links.ACCESSORY + `${id}.json`,
        );
        if (response.ok && response.data) {
          setAccessory(response.data);
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
          <Text className="text-center" variant="headlineLarge">
            {accessory.basicInfo.name.en || accessory.basicInfo.name.ja}
          </Text>
          <View className="flex-row justify-evenly py-3">
            <View>
              <FastImage
                className="aspect-square w-28"
                source={{uri: imgItem(accessory.basicInfo.iconID)}}
              />
              <FastImage
                className="absolute aspect-square w-28"
                source={frame}
              />
              <FastImage
                className="absolute right-0 aspect-square w-7"
                source={{uri: iconAct(accessory.skillInfo.skillSlot)}}
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
                        className="aspect-stage-girl h-28"
                        source={{uri: imgStageGirl(card)}}
                      />
                      <FastImage
                        className="absolute aspect-stage-girl h-28"
                        source={sgFrame}
                      />
                    </View>
                  </TouchableRipple>
                );
              })}
            </View>
          </View>
          <View className="px-3">
            <View className="py-3">
              <Text className="text-center" variant="titleMedium">
                {t('basic-act')}
              </Text>
              {accessory.skillInfo.skill.skillNormal && (
                <SkillDetail skill={accessory.skillInfo.skill.skillNormal} />
              )}
            </View>
            <View className="space-y-2 py-3">
              <Text className="text-center" variant="titleMedium">
                {t('max-stats')}
              </Text>
              <Surface className="rounded" elevation={3}>
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
