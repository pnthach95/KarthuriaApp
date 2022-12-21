import API, {links} from 'api';
import {iconAttribute, iconSkill, imgStageGirlBig} from 'api/images';
import {attackTypeText, position, rarity} from 'assets';
import frame from 'assets/common/frame_thumbnail_dress.png';
import BaseScreen from 'components/basescreen';
import SkillDetail from 'components/skilldetail';
import SkillParam from 'components/skillparam';
import dayjs from 'dayjs';
import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Image, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {
  Button,
  DataTable,
  Surface,
  Text,
  TouchableRipple,
} from 'react-native-paper';
import type {RootStackScreenProps} from 'typings/navigation';

const StageGirlDetailScreen = ({
  navigation,
  route,
}: RootStackScreenProps<'StageGirlDetail'>) => {
  const {t} = useTranslation();
  const [loading, setLoading] = useState(true);
  const [dress, setDress] = useState<TDress | null>(null);
  const [character, setCharater] = useState<TChara | null>(null);
  const [tabIndex, setTabIndex] = useState(0);

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

  const onPressTabStats = () => setTabIndex(0);
  const onPressTabInfo = () => setTabIndex(1);
  const onPressTabSkill = () => setTabIndex(2);

  return (
    <BaseScreen hasData={!!dress} loading={loading}>
      {dress && (
        <View className="px-3 pb-3">
          <Text className="text-center" variant="headlineLarge">
            {dress.basicInfo.name.en || dress.basicInfo.name.ja}
          </Text>
          {character && (
            <TouchableRipple className="mb-1" onPress={goToCharacterDetail}>
              <Text className="text-center" variant="titleMedium">
                {character.info.name.en || character.info.name.ja}
              </Text>
            </TouchableRipple>
          )}
          <View className="self-center">
            <FastImage
              className="aspect-memoir w-72"
              source={{uri: imgStageGirlBig(dress.basicInfo.cardID || '0')}}
            />
            <FastImage
              className="absolute aspect-memoir w-72"
              resizeMode="contain"
              source={frame}
            />
            <Image
              className="absolute right-0 h-9 w-9"
              source={{uri: iconAttribute(dress.base.attribute)}}
            />
            <Image
              className="absolute right-0 top-10 aspect-role w-9"
              resizeMethod="resize"
              resizeMode="contain"
              source={position(dress.base.roleIndex.role)}
            />
            <Image
              className="absolute left-1 bottom-1"
              source={rarity(dress.basicInfo.rarity)}
            />
          </View>
          <View className="py-3">
            <Surface className="my-1 rounded p-3" elevation={3}>
              <View className="flex-row justify-between">
                <Text variant="bodySmall">{t('cost')}</Text>
                <Text>{dress.base.cost}</Text>
              </View>
              <Text variant="bodySmall">{t('release-date')}</Text>
              {releasedJA && (
                <View className="flex-row justify-between">
                  <Text>{t('japanese')}</Text>
                  <Text>{releasedJA.format('LLLL')}</Text>
                </View>
              )}
              {releasedWW && (
                <View className="flex-row justify-between">
                  <Text>{t('worldwide')}</Text>
                  <Text>{releasedWW.format('LLLL')}</Text>
                </View>
              )}
              <View className="flex-row justify-between">
                <Text variant="bodySmall">{t('attack-type')}</Text>
                <Image
                  className="h-[22.4px] w-[63px]"
                  source={attackTypeText(dress.base.attackType)}
                />
              </View>
            </Surface>
          </View>
          <View className="flex-row">
            <Button
              className="flex-1"
              mode={tabIndex === 0 ? 'contained' : 'text'}
              uppercase={false}
              onPress={onPressTabStats}>
              <Text>{t('stats')}</Text>
            </Button>
            <Button
              className="flex-1"
              mode={tabIndex === 1 ? 'contained' : 'text'}
              uppercase={false}
              onPress={onPressTabInfo}>
              <Text>{t('info')}</Text>
            </Button>
            <Button
              className="flex-1"
              mode={tabIndex === 2 ? 'contained' : 'text'}
              uppercase={false}
              onPress={onPressTabSkill}>
              <Text>{t('act_skill')}</Text>
            </Button>
          </View>
          {tabIndex === 0 && (
            <View className="py-3">
              <Surface className="my-1 rounded" elevation={3}>
                <DataTable>
                  <DataTable.Row>
                    <DataTable.Cell className="flex-[2]">
                      {t('power-score-total')}
                    </DataTable.Cell>
                    <DataTable.Cell numeric>{dress.stat.total}</DataTable.Cell>
                  </DataTable.Row>
                  <DataTable.Row>
                    <DataTable.Cell className="flex-[2]">
                      {t('hp')}
                    </DataTable.Cell>
                    <DataTable.Cell numeric>{dress.stat.hp}</DataTable.Cell>
                  </DataTable.Row>
                  <DataTable.Row>
                    <DataTable.Cell className="flex-[2]">
                      {t('act-power')}
                    </DataTable.Cell>
                    <DataTable.Cell numeric>{dress.stat.atk}</DataTable.Cell>
                  </DataTable.Row>
                  <DataTable.Row>
                    <DataTable.Cell className="flex-[2]">
                      {t('normal-defense')}
                    </DataTable.Cell>
                    <DataTable.Cell numeric>{dress.stat.pdef}</DataTable.Cell>
                  </DataTable.Row>
                  <DataTable.Row>
                    <DataTable.Cell className="flex-[2]">
                      {t('special-defense')}
                    </DataTable.Cell>
                    <DataTable.Cell numeric>{dress.stat.mdef}</DataTable.Cell>
                  </DataTable.Row>
                  <DataTable.Row>
                    <DataTable.Cell className="flex-[2]">
                      {t('agility')}
                    </DataTable.Cell>
                    <DataTable.Cell numeric>{dress.stat.agi}</DataTable.Cell>
                  </DataTable.Row>
                </DataTable>
              </Surface>
            </View>
          )}
          {tabIndex === 1 && (
            <View className="py-3">
              <Surface className="my-1 space-y-3 rounded p-3" elevation={3}>
                <View>
                  <Text variant="bodySmall">{t('profile')}</Text>
                  <Text variant="bodyMedium">
                    {dress.basicInfo.profile.en || dress.basicInfo.profile.ja}
                  </Text>
                </View>
                <View>
                  <Text variant="bodySmall">{t('message')}</Text>
                  <Text variant="bodyMedium">
                    {dress.basicInfo.message.en || dress.basicInfo.message.ja}
                  </Text>
                </View>
                <View>
                  <Text variant="bodySmall">{t('description')}</Text>
                  <Text variant="bodyMedium">
                    {dress.basicInfo.description.en ||
                      dress.basicInfo.description.ja}
                  </Text>
                </View>
              </Surface>
            </View>
          )}
          {tabIndex === 2 && (
            <>
              <View className="py-3">
                <Text className="text-center" variant="titleMedium">
                  {t('basic-act')}
                </Text>
                {Object.values(dress.act).map((act, index) => {
                  return (
                    <SkillDetail key={`act${index}`} skill={act.skillNormal} />
                  );
                })}
              </View>
              <View className="py-3">
                <Text className="text-center" variant="titleMedium">
                  {t('climax-act')}
                </Text>
                <SkillDetail skill={dress.groupSkills.climaxACT.skillNormal} />
              </View>
              <View className="py-3">
                <Text className="text-center" variant="titleMedium">
                  {t('unit-skill')}
                </Text>
                <Surface className="my-1 rounded p-3" elevation={3}>
                  <View className="flex-row space-x-3">
                    <FastImage
                      className="h-10 w-10"
                      source={{
                        uri: iconSkill(dress.groupSkills.unitSkill.icon),
                      }}
                    />
                    <View className="flex-1 flex-row">
                      <Text variant="bodyMedium">
                        {dress.groupSkills.unitSkill.description.en ||
                          dress.groupSkills.unitSkill.description.ja}
                      </Text>
                    </View>
                  </View>
                </Surface>
              </View>
              <View className="py-3">
                <Text className="text-center" variant="titleMedium">
                  {t('auto-skills')}
                </Text>
                {Object.values(dress.skills).map((autoSkill, index) => {
                  return (
                    <Surface
                      key={`autoSkill${index}`}
                      className="my-1 rounded p-3"
                      elevation={3}>
                      <Text variant="bodyMedium">
                        {autoSkill.type.en || autoSkill.type.ja}
                      </Text>
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
              <View className="py-3">
                <Text className="text-center" variant="titleMedium">
                  {t('finishing-act')}
                </Text>
                <Surface className="my-1 rounded p-3" elevation={3}>
                  <View className="flex-row space-x-3">
                    <FastImage
                      className="h-10 w-10"
                      source={{
                        uri: iconSkill(dress.groupSkills.finishACT.icon),
                      }}
                    />
                    <View className="flex-1">
                      <Text>
                        {dress.groupSkills.finishACT.name.en ||
                          dress.groupSkills.finishACT.name.ja}
                      </Text>
                      <Text variant="bodySmall">
                        {dress.groupSkills.finishACT.description.en ||
                          dress.groupSkills.finishACT.description.ja}
                      </Text>
                    </View>
                  </View>
                </Surface>
              </View>
            </>
          )}
        </View>
      )}
    </BaseScreen>
  );
};

StageGirlDetailScreen.whyDidYouRender = true;

export default StageGirlDetailScreen;
