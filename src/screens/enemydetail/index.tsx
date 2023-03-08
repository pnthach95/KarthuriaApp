import API, {links} from 'api';
import {iconAttribute, imgEnemy} from 'api/images';
import BaseScreen from 'components/basescreen';
import SkillDetail from 'components/skilldetail';
import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Image, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {Surface, Text} from 'react-native-paper';
import type {RootStackScreenProps} from 'typings/navigation';

const EnemyDetailScreen = ({route}: RootStackScreenProps<'EnemyDetail'>) => {
  const {t} = useTranslation();
  const [loading, setLoading] = useState(true);
  const [enemy, setEnemy] = useState<TEnemy | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const {id} = route.params;
        const response = await API.get<TEnemy>(links.ENEMY + `${id}.json`);
        if (response.ok && response.data) {
          setEnemy(response.data);
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
    <BaseScreen hasData={!!enemy} loading={loading}>
      {enemy && (
        <>
          <Text className="text-center" variant="headlineLarge">
            {enemy.basicInfo.name.en || enemy.basicInfo.name.ja}
          </Text>
          <View className="py-3">
            <View className="aspect-square w-28 self-center">
              <FastImage
                className="aspect-square w-28 self-center"
                source={{uri: imgEnemy(enemy.basicInfo.icon)}}
              />
              <Image
                className="absolute aspect-square w-7"
                source={{uri: iconAttribute(enemy.basicInfo.attribute)}}
              />
            </View>
          </View>
          <View className="px-3">
            <View className="py-3">
              <Surface className="my-1 rounded p-3" elevation={3}>
                <Text variant="bodySmall">{t('profile')}</Text>
                <Text variant="bodyMedium">
                  {enemy.basicInfo.personality.en ||
                    enemy.basicInfo.personality.ja}
                </Text>
              </Surface>
            </View>
            <View className="py-3">
              <Text className="text-center" variant="titleMedium">
                {t('skill')}
              </Text>
              {enemy.skills.map((skill, idx) => {
                return <SkillDetail key={idx} skill={skill.skillNormal} />;
              })}
            </View>
          </View>
        </>
      )}
    </BaseScreen>
  );
};

EnemyDetailScreen.whyDidYouRender = true;

export default EnemyDetailScreen;
