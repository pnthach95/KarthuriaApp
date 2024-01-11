import API, {links} from 'api';
import {iconAct, imgItem, imgStageGirl} from 'api/images';
import frame from 'assets/common/frame_accessory.png';
import sgFrame from 'assets/common/frame_stage_girl.png';
import Kirin from 'components/kirin';
import SkillDetail from 'components/skilldetail';
import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {ScrollView, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {DataTable, Surface, Text, TouchableRipple} from 'react-native-paper';
import {useSafeAreaPaddingBottom} from 'theme/styles';
import type {RootStackScreenProps} from 'typings/navigation';

const AccessoryDetailScreen = ({
  navigation,
  route,
}: RootStackScreenProps<'AccessoryDetail'>) => {
  const {t} = useTranslation();
  const [loading, setLoading] = useState(true);
  const [accessory, setAccessory] = useState<TAccessory | null>(null);
  const contentContainer = useSafeAreaPaddingBottom(0, {padding: 12});

  useEffect(() => {
    if (accessory) {
      navigation.setOptions({
        title: accessory.basicInfo.name.en || accessory.basicInfo.name.ja,
      });
    }
  }, [accessory]);

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

  if (loading) {
    return <Kirin />;
  }

  if (accessory) {
    return (
      <ScrollView
        contentContainerStyle={contentContainer}
        showsVerticalScrollIndicator={false}>
        <View className="flex-row justify-evenly py-3">
          <View>
            <FastImage
              className="aspect-square w-28"
              source={{uri: imgItem(accessory.basicInfo.iconID)}}
            />
            <FastImage className="absolute aspect-square w-28" source={frame} />
            <FastImage
              className="absolute right-0 aspect-square w-7"
              source={{uri: iconAct(accessory.skillInfo.skillSlot)}}
            />
          </View>
        </View>
        <View className="flex-row flex-wrap justify-center">
          {accessory.basicInfo.cards.map(card => {
            const goToStageGirlDetail = () =>
              accessory && navigation.navigate('StageGirlDetail', {id: card});

            return (
              <TouchableRipple
                key={card}
                borderless
                onPress={goToStageGirlDetail}>
                <View>
                  <FastImage
                    className="aspect-stage-girl h-16"
                    source={{uri: imgStageGirl(card)}}
                  />
                  <FastImage
                    className="absolute aspect-stage-girl h-16"
                    source={sgFrame}
                  />
                </View>
              </TouchableRipple>
            );
          })}
        </View>
        <View className="px-3">
          {accessory.skillInfo.skill && (
            <View className="py-3">
              <Text className="text-center" variant="titleMedium">
                {t('basic-act')}
              </Text>
              {accessory.skillInfo.skill.skillNormal && (
                <SkillDetail skill={accessory.skillInfo.skill.skillNormal} />
              )}
            </View>
          )}
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
                  <DataTable.Cell numeric>{accessory.stat.atk}</DataTable.Cell>
                </DataTable.Row>
                <DataTable.Row>
                  <DataTable.Cell>{t('normal-defense')}</DataTable.Cell>
                  <DataTable.Cell numeric>{accessory.stat.pdef}</DataTable.Cell>
                </DataTable.Row>
                <DataTable.Row>
                  <DataTable.Cell>{t('special-defense')}</DataTable.Cell>
                  <DataTable.Cell numeric>{accessory.stat.mdef}</DataTable.Cell>
                </DataTable.Row>
                <DataTable.Row>
                  <DataTable.Cell>{t('agility')}</DataTable.Cell>
                  <DataTable.Cell numeric>{accessory.stat.agi}</DataTable.Cell>
                </DataTable.Row>
                <DataTable.Row>
                  <DataTable.Cell>{t('dexterity')}</DataTable.Cell>
                  <DataTable.Cell numeric>{accessory.stat.dex}</DataTable.Cell>
                </DataTable.Row>
                <DataTable.Row>
                  <DataTable.Cell>{t('critical')}</DataTable.Cell>
                  <DataTable.Cell numeric>{accessory.stat.cri}</DataTable.Cell>
                </DataTable.Row>
              </DataTable>
            </Surface>
          </View>
        </View>
      </ScrollView>
    );
  }
};

export default AccessoryDetailScreen;
