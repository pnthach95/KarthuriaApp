import {FasterImageView} from '@candlefinance/faster-image';
import API, {links} from 'api';
import {charaBase, charaPortrait} from 'api/images';
import {iconSchool} from 'api/images';
import Kirin from 'components/kirin';
import dayjs from 'dayjs';
import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {ScrollView, StyleSheet, View} from 'react-native';
import {Text} from 'react-native-paper';
import {useSafeAreaPaddingBottom} from 'theme/styles';
import type {RootStackScreenProps} from 'typings/navigation';

const styles = StyleSheet.create({
  bg: {aspectRatio: 19 / 30, width: '100%'},
  char: {aspectRatio: 19 / 30, position: 'absolute', width: '100%'},
  icon: {aspectRatio: 1, width: 40},
});

const CharacterDetailScreen = ({
  navigation,
  route,
}: RootStackScreenProps<'CharacterDetail'>) => {
  const {t} = useTranslation();
  const [loading, setLoading] = useState(true);
  const [character, setCharater] = useState<TChara | null>(null);
  const contentContainer = useSafeAreaPaddingBottom(0, {padding: 12});

  useEffect(() => {
    if (character) {
      navigation.setOptions({
        title: character.info.name.en || character.info.name.ja,
      });
    }
  }, [character]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await API.get<TChara>(
          links.CHARA + `${route.params.id}.json`,
        );
        if (response.ok && response.data) {
          setCharater(response.data);
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

  if (loading) {
    return <Kirin />;
  }

  if (character) {
    return (
      <ScrollView
        contentContainerStyle={contentContainer}
        showsVerticalScrollIndicator={false}>
        <View className="mb-3 w-1/2 self-center">
          <FasterImageView
            source={{url: charaBase(character.basicInfo.charaID)}}
            style={styles.bg}
          />
          <FasterImageView
            source={{url: charaPortrait(character.basicInfo.charaID)}}
            style={styles.char}
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
            <FasterImageView
              source={{url: iconSchool(character.basicInfo.school_id)}}
              style={styles.icon}
            />
          </View>
          <View>
            <Text variant="labelSmall">{t('department')}</Text>
            <Text variant="bodyMedium">
              {character.info.department_2.en || character.info.department_2.ja}
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
              {character.info.introduction.en || character.info.introduction.ja}
            </Text>
          </View>
        </View>
      </ScrollView>
    );
  }
};

export default CharacterDetailScreen;
