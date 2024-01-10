import API, {links} from 'api';
import {iconSchool} from 'api/images';
import {charaBase, charaPortrait} from 'api/images';
import BaseScreen from 'components/basescreen';
import dayjs from 'dayjs';
import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {Text} from 'react-native-paper';
import type {RootStackScreenProps} from 'typings/navigation';

const CharacterDetailScreen = ({
  route,
}: RootStackScreenProps<'CharacterDetail'>) => {
  const {t} = useTranslation();
  const [loading, setLoading] = useState(true);
  const [character, setCharater] = useState<TChara | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await API.get<TChara>(
          links.CHARA + `${route.params.id}.json`,
        );
        if (data.ok && data.data) {
          setCharater(data.data);
        }
      } catch (error) {
        //
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const birthday = character
    ? dayjs()
        .date(character.basicInfo.birth_day)
        .month(character.basicInfo.birth_month)
        .format('M/D')
    : '';

  return (
    <BaseScreen hasData={!!character} loading={loading}>
      {character && (
        <>
          <Text className="mb-3 text-center" variant="headlineLarge">
            {character.info.name.en || character.info.name.ja}
          </Text>
          <View className="mb-3 w-1/2 self-center">
            <FastImage
              className="aspect-character-portrait w-full"
              source={{uri: charaBase(character.basicInfo.charaID)}}
            />
            <FastImage
              className="absolute aspect-character-portrait w-full"
              source={{uri: charaPortrait(character.basicInfo.charaID)}}
            />
          </View>
          <View className="space-y-3 p-3">
            <View>
              <Text variant="labelSmall">{t('birthday')}</Text>
              <Text variant="bodyMedium">{birthday}</Text>
            </View>
            <View>
              <Text variant="labelSmall">{t('voice-actor')}</Text>
              <Text variant="bodyMedium">
                {character.info.cv.en || character.info.cv.ja}
              </Text>
            </View>
            <View className="flex-row items-center justify-between">
              <View className="flex-1">
                <Text variant="labelSmall">{t('school')}</Text>
                <Text variant="bodyMedium">
                  {character.info.department_1.en ||
                    character.info.department_1.ja}
                </Text>
              </View>
              <FastImage
                className="aspect-square w-10"
                source={{uri: iconSchool(character.basicInfo.school_id)}}
              />
            </View>
            <View>
              <Text variant="labelSmall">{t('department')}</Text>
              <Text variant="bodyMedium">
                {character.info.department_2.en ||
                  character.info.department_2.ja}
              </Text>
            </View>
            <View>
              <Text variant="labelSmall">{t('liked-food')}</Text>
              <Text variant="bodyMedium">
                {character.info.like_foods.en || character.info.like_foods.ja}
              </Text>
            </View>
            <View>
              <Text variant="labelSmall">{t('disliked-food')}</Text>
              <Text variant="bodyMedium">
                {character.info.dislike_foods.en ||
                  character.info.dislike_foods.ja}
              </Text>
            </View>
            <View>
              <Text variant="labelSmall">{t('likes')}</Text>
              <Text variant="bodyMedium">
                {character.info.likes.en || character.info.likes.ja}
              </Text>
            </View>
            <View>
              <Text variant="labelSmall">{t('dislikes')}</Text>
              <Text variant="bodyMedium">
                {character.info.dislikes.en || character.info.dislikes.ja}
              </Text>
            </View>
            <View>
              <Text variant="labelSmall">{t('introduction')}</Text>
              <Text variant="bodyMedium">
                {character.info.introduction.en ||
                  character.info.introduction.ja}
              </Text>
            </View>
          </View>
        </>
      )}
    </BaseScreen>
  );
};

export default CharacterDetailScreen;
